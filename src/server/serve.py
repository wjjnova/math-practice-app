#!/usr/bin/env python3
"""
Lightweight static file server for the Math Quest app.

Usage:
    python3 src/server/serve.py [--port 3000]

The server hosts files from ../client and falls back to index.html for unknown
paths so the app can be opened via http://localhost:<port>.
"""

from __future__ import annotations

import argparse
import http.server
import os
import json
import threading
import urllib.parse
import urllib.request
import urllib.error
import re
import ssl
from pathlib import Path
from socketserver import ThreadingMixIn
import signal
from fractions import Fraction

SERVER_ROOT = Path(__file__).resolve().parent
SRC_ROOT = SERVER_ROOT.parent
PROJECT_ROOT = SRC_ROOT.parent
PUBLIC_DIR = SRC_ROOT / "client"
FALLBACK_FILE = PUBLIC_DIR / "index.html"
DATASET_URL = "https://raw.githubusercontent.com/openai/grade-school-math/master/grade_school_math/data/train.jsonl"
DATASET_FILE = PROJECT_ROOT / "data" / "questions_gsm8k.json"
DATASET_ROUTE = "/data/questions_gsm8k.json"
_DATASET_LOCK = threading.Lock()


def extract_numeric(value: str) -> float | None:
    candidate = value.strip().replace(",", "")
    if "/" in candidate and all(part.strip("- ").isdigit() for part in candidate.split("/") if part):
        try:
            return float(Fraction(candidate))
        except (ZeroDivisionError, ValueError):
            return None
    try:
        return float(candidate)
    except ValueError:
        match = re.search(r"-?\d+(?:\.\d+)?", candidate)
        if match:
            try:
                return float(match.group())
            except ValueError:
                return None
    return None


def ensure_dataset_file(force: bool = False) -> Path:
    with _DATASET_LOCK:
        if DATASET_FILE.exists() and not force:
            return DATASET_FILE
        print("Preparing GSM8K dataset...")
        records = download_and_transform_dataset(DATASET_URL)
        DATASET_FILE.parent.mkdir(parents=True, exist_ok=True)
        with DATASET_FILE.open("w", encoding="utf-8") as handle:
            json.dump(records, handle, ensure_ascii=False, indent=2)
        print(f"Wrote dataset with {len(records)} entries to {DATASET_FILE}")
        return DATASET_FILE


def download_and_transform_dataset(source_url: str) -> list[dict]:
    dataset: list[dict] = []
    last_error: Exception | None = None
    contexts = [None]
    # fallback context that skips certificate verification (for environments without cert bundles)
    contexts.append(ssl._create_unverified_context())  # type: ignore[arg-type]

    for ctx in contexts:
        try:
            with urllib.request.urlopen(source_url, context=ctx) as response:
                for index, raw_line in enumerate(response, start=1):
                    line = raw_line.decode("utf-8").strip()
                    if not line:
                        continue
                    item = json.loads(line)
                    question_id = item.get("question_id") or f"q{index}"
                    raw_answer = item.get("answer")
                    full_answer = ""
                    if isinstance(raw_answer, str):
                        full_answer = raw_answer.strip()
                    elif raw_answer is not None:
                        full_answer = str(raw_answer).strip()

                    if full_answer:
                        if "####" in full_answer:
                            answer_value = full_answer.rsplit("####", 1)[-1].strip()
                        else:
                            answer_value = full_answer.splitlines()[-1].strip()
                    else:
                        answer_value = ""

                    normalized_value = answer_value.replace(",", "")
                    dataset.append(
                        {
                            "id": question_id,
                            "position": index,
                            "question": item["question"].strip(),
                            "answer": full_answer,
                            "answerValue": answer_value,
                            "answerNumeric": extract_numeric(normalized_value),
                        }
                    )
            # successfully processed; exit loop
            break
        except urllib.error.URLError as exc:  # pragma: no cover - network error logging
            last_error = exc
            dataset.clear()
            if ctx is None:
                print(f"Warning: SSL verification failed while fetching dataset ({exc}); retrying without verification.")
            continue

    if not dataset:
        raise RuntimeError(f"Failed to fetch GSM8K dataset: {last_error}") from last_error
    return dataset


class ThreadingHTTPServer(ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


class StaticHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == DATASET_ROUTE:
            self._serve_dataset()
            return
        super().do_GET()

    def log_message(self, format: str, *args) -> None:
        # Cleaner console output
        print(self.address_string(), "-", format % args)

    def send_head(self):
        path = self.translate_path(self.path)
        if Path(path).is_dir():
            index = Path(path) / "index.html"
            if index.exists():
                self.path = os.path.relpath(index, PUBLIC_DIR)
                return super().send_head()
            # prevent directory listings; fall back to SPA
            return self._serve_fallback()

        if os.path.exists(path):
            return super().send_head()

        return self._serve_fallback()

    def _serve_fallback(self):
        if not FALLBACK_FILE.exists():
            self.send_error(404, "File not found")
            return None

        self.send_response(200)
        self.send_header("Content-type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(FALLBACK_FILE.stat().st_size))
        self.end_headers()
        return FALLBACK_FILE.open("rb")

    def _serve_dataset(self) -> None:
        try:
            dataset_path = ensure_dataset_file()
        except RuntimeError as exc:
            self.send_error(500, str(exc))
            return

        try:
            with dataset_path.open("rb") as handle:
                data = handle.read()
        except OSError as exc:
            self.send_error(500, f"Unable to read dataset: {exc}")
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the Math Quest app locally.")
    parser.add_argument("-p", "--port", type=int, default=3000, help="Port to listen on (default: 3000)")
    return parser.parse_args()


def main() -> None:
    if not PUBLIC_DIR.exists():
        raise SystemExit(f"Public directory not found: {PUBLIC_DIR}")

    try:
        ensure_dataset_file()
    except RuntimeError as exc:
        print(f"Warning: {exc}")

    args = parse_args()
    server_address = ("", args.port)

    # instantiate server so we can reference it from signal handlers
    httpd = ThreadingHTTPServer(server_address, StaticHandler)

    def _shutdown_handler(signum, frame):
        # Called in signal handler context; delegate to a thread so we
        # avoid doing heavy work inside the handler.
        print(f"Received signal {signum}; shutting down server...")
        try:
            threading.Thread(target=httpd.shutdown, daemon=True).start()
        except Exception as exc:  # pragma: no cover - best-effort logging
            print(f"Error while trying to shutdown server: {exc}")

    # register handlers for clean shutdown on SIGINT/SIGTERM
    signal.signal(signal.SIGINT, _shutdown_handler)
    signal.signal(signal.SIGTERM, _shutdown_handler)

    host, port = httpd.server_address
    print(f"Serving Math Quest at http://{host or 'localhost'}:{port}")
    print("Press Ctrl+C to stop.")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        # KeyboardInterrupt may still arrive; try to shut down cleanly
        print("\nKeyboard interrupt received; shutting down...")
        try:
            httpd.shutdown()
        except Exception:
            pass
    finally:
        try:
            httpd.server_close()
        except Exception:
            pass


if __name__ == "__main__":
    main()

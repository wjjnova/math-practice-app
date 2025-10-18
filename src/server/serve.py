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
import random
import threading
import urllib.parse
import re
from pathlib import Path
from socketserver import ThreadingMixIn
from fractions import Fraction

SERVER_ROOT = Path(__file__).resolve().parent
SRC_ROOT = SERVER_ROOT.parent
PROJECT_ROOT = SRC_ROOT.parent
PUBLIC_DIR = SRC_ROOT / "client"
FALLBACK_FILE = PUBLIC_DIR / "index.html"
DATASET_PATH = PROJECT_ROOT / "data" / "gsm8k_train.jsonl"

_DATASET_CACHE: list[dict] | None = None
_DATASET_MAP: dict[str, dict] = {}
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


def load_dataset() -> list[dict]:
    global _DATASET_CACHE, _DATASET_MAP
    with _DATASET_LOCK:
        if _DATASET_CACHE is not None:
            return _DATASET_CACHE
        if not DATASET_PATH.exists():
            raise FileNotFoundError(f"GSM8K data not found: {DATASET_PATH}")

        dataset: list[dict] = []
        with DATASET_PATH.open("r", encoding="utf-8") as handle:
            for index, line in enumerate(handle, start=1):
                line = line.strip()
                if not line:
                    continue
                item = json.loads(line)
                question_id = item.get("question_id") or f"q{index}"
                answer = item.get("answer", "")
                answer_value = answer.split("####")[-1].strip() if "####" in answer else answer.strip()
                normalized_answer = answer_value.replace(",", "")
                dataset.append(
                    {
                        "id": question_id,
                        "position": index,
                        "question": item["question"].strip(),
                        "answer": normalized_answer,
                        "answerNumeric": extract_numeric(normalized_answer),
                    }
                )

        _DATASET_CACHE = dataset
        _DATASET_MAP = {entry["id"]: entry for entry in dataset}
        return dataset


def get_question_by_id(question_id: str) -> dict | None:
    dataset = load_dataset()
    if not _DATASET_MAP:
        # ensure map is built if cache was reset
        for entry in dataset:
            _DATASET_MAP.setdefault(entry["id"], entry)
    return _DATASET_MAP.get(question_id)


class ThreadingHTTPServer(ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


class StaticHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith("/api/"):
            self._handle_api(parsed)
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

    # API helpers ---------------------------------------------------------
    def _handle_api(self, parsed: urllib.parse.ParseResult) -> None:
        try:
            if parsed.path == "/api/questions":
                self._handle_questions(parsed.query)
            elif parsed.path == "/api/questions/all":
                self._handle_questions_all()
            elif parsed.path == "/api/questions/random":
                self._handle_question_random()
            elif parsed.path.startswith("/api/questions/"):
                question_id = parsed.path.rsplit("/", 1)[-1]
                self._handle_question_detail(question_id)
            else:
                self.send_error(404, "Unknown API endpoint")
        except FileNotFoundError as exc:
            self._write_json({"error": str(exc)}, status=500)
        except Exception as exc:  # noqa: BLE001 - log unexpected errors
            self.send_error(500, f"Server error: {exc}")

    def _handle_questions(self, query: str) -> None:
        params = urllib.parse.parse_qs(query or "")
        page_raw = params.get("page", ["1"])[0]
        page_size_raw = params.get("page_size", ["12"])[0]
        try:
            page = int(page_raw or 1)
        except ValueError:
            page = 1
        try:
            page_size = int(page_size_raw or 12)
        except ValueError:
            page_size = 12
        page = max(1, page)
        page_size = max(1, min(50, page_size))

        dataset = load_dataset()
        total = len(dataset)
        total_pages = (total + page_size - 1) // page_size if total else 0

        if total_pages == 0:
            payload = {"page": 0, "pageSize": page_size, "total": 0, "totalPages": 0, "items": []}
            self._write_json(payload)
            return

        page = min(page, total_pages)
        start = (page - 1) * page_size
        items = dataset[start : start + page_size]
        payload = {
            "page": page,
            "pageSize": page_size,
            "total": total,
            "totalPages": total_pages,
            "items": [
                {"id": entry["id"], "position": entry["position"], "question": entry["question"]} for entry in items
            ],
        }
        self._write_json(payload)

    def _handle_questions_all(self) -> None:
        dataset = load_dataset()
        self._write_json(dataset)

    def _handle_question_random(self) -> None:
        dataset = load_dataset()
        if not dataset:
            self._write_json({"error": "No questions available"}, status=404)
            return
        self._write_json(random.choice(dataset))

    def _handle_question_detail(self, question_id: str) -> None:
        question = get_question_by_id(question_id)
        if question is None:
            self._write_json({"error": "Question not found"}, status=404)
            return
        self._write_json(question)

    def _write_json(self, payload: object, status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the Math Quest app locally.")
    parser.add_argument("-p", "--port", type=int, default=3000, help="Port to listen on (default: 3000)")
    return parser.parse_args()


def main() -> None:
    if not PUBLIC_DIR.exists():
        raise SystemExit(f"Public directory not found: {PUBLIC_DIR}")

    args = parse_args()
    server_address = ("", args.port)

    with ThreadingHTTPServer(server_address, StaticHandler) as httpd:
        host, port = httpd.server_address
        print(f"Serving Math Quest at http://{host or 'localhost'}:{port}")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down...")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Download the GSM8K training dataset if it is not already present locally.

Usage:
    python3 src/scripts/fetch_gsm8k.py              # download only if missing
    python3 src/scripts/fetch_gsm8k.py --force      # re-download even if file exists
"""

from __future__ import annotations

import argparse
import sys
import urllib.error
import urllib.request
from pathlib import Path

DEFAULT_URL = "https://raw.githubusercontent.com/openai/grade-school-math/master/grade_school_math/data/train.jsonl"
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEST_PATH = PROJECT_ROOT / "data" / "gsm8k_train.jsonl"


def download(url: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url) as response, destination.open("wb") as handle:
        chunk_size = 1024 * 64
        while True:
            chunk = response.read(chunk_size)
            if not chunk:
                break
            handle.write(chunk)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch the GSM8K training dataset.")
    parser.add_argument("--url", default=DEFAULT_URL, help="Source URL for the dataset JSONL file.")
    parser.add_argument("--force", action="store_true", help="Re-download even if the file already exists.")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)

    if DEST_PATH.exists() and not args.force:
        print(f"{DEST_PATH} already exists; skipping download. Use --force to overwrite.")
        return 0

    print(f"Downloading GSM8K dataset from {args.url}")
    try:
        download(args.url, DEST_PATH)
    except urllib.error.URLError as error:
        print(f"Download failed: {error}", file=sys.stderr)
        return 1

    print(f"Saved dataset to {DEST_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

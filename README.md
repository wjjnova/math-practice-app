# Math Quest

A self-contained browser app that serves grade school math word problems drawn from the GSM8K dataset. The experience focuses on short practice bursts: your learner sees a single question at a time, submits a numeric answer (or taps from multiple-choice suggestions), and gets instant feedback with fun celebration effects. Missed problems automatically return for review until they are mastered.

## Features

- Full GSM8K training set hosted locally through the bundled Python server.
- Browse the entire problem bank via a paginated sidebar and jump directly to any question.
- Smart rotation between new questions and items that still need practice.
- Answer input accepts numbers or fractions and offers auto-generated multiple-choice options when possible.
- Progress tracker with streaks, best streak, and per-question history stored in `localStorage`.
- Colorful confetti plus a cheerful chime on correct answers to keep motivation high.

## Quick Start

1. Start the bundled dev server (serves the static site and exposes the GSM8K dataset API). The repository includes a convenience script:
  ```bash
  # preferred: start the app and open your browser
  ./start.sh 3000

  # or run the server directly
  python3 src/server/serve.py --port 3000
  ```
2. If you used `./start.sh`, your browser should open automatically to `http://localhost:3000`.
3. Use the "Browse Questions" panel to pick any problem, or stay in practice mode for the adaptive flow.

Your progress (attempts, streaks, and which questions still need review) saves automatically in the browser. Clear `localStorage` for a fresh start.

## Repo Layout

```
src/
  client/
    index.html        # Main entry point
    styles.css        # UI styling
    app.js            # Core application logic
  server/serve.py     # Local development server and dataset API
  scripts/fetch_gsm8k.py  # One-time dataset downloader (skips if file exists)
data/
  gsm8k_train.jsonl   # Raw dataset snapshot from the official repo
```

## Updating the Dataset

If a newer GSM8K dump becomes available, replace `data/gsm8k_train.jsonl` and rerun:

```bash
python3 src/scripts/fetch_gsm8k.py --force
```

> ⚠️ The app never re-downloads the GSM8K dataset automatically. Once `data/gsm8k_train.jsonl` is in place, the server reads from that file and caches it. If the file already exists, you can skip any fetch steps.

## Next Ideas

- Add gentle hints or worked solutions after multiple incorrect tries.
- Group questions by topic or difficulty to create custom practice tracks.
- Expose a parent dashboard summarizing session stats across devices.

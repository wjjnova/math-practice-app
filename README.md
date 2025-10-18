# Math Quest

A self-contained browser app that serves grade school math word problems drawn from the GSM8K dataset. The experience focuses on short practice bursts: your learner sees a single question at a time, submits a numeric answer (or taps from multiple-choice suggestions), and gets instant feedback with fun celebration effects. Missed problems automatically return for review until they are mastered.

Access the hosted build at https://wjjnova.github.io/math-practice-app/src/client/index.html

## Features

- Full GSM8K training set packaged as a static JavaScript module (with an optional Python dev server that keeps the file up to date).
- Browse the entire problem bank via a paginated sidebar and jump directly to any question.
- Smart rotation between new questions and items that still need practice.
- Answer input accepts numbers or fractions and offers auto-generated multiple-choice options when possible.
- Progress tracker with streaks, best streak, and per-question history stored in `localStorage`.
- Colorful confetti plus a cheerful chime on correct answers to keep motivation high.

## Quick Start

1. Start the bundled dev server (serves the static site and prepares the GSM8K dataset module if needed). The repository includes a convenience script:
  ```bash
  # preferred: start the app and open your browser
  ./start.sh 3000

  # or run the server directly
  python3 src/server/serve.py --port 3000
  ```
2. If you used `./start.sh`, your browser should open automatically to `http://localhost:3000`.
3. Use the "Browse Questions" panel to pick any problem, or stay in practice mode for the adaptive flow.

> The first run may take a moment while the dataset is downloaded and written to `src/client/data/questions_gsm8k.js`.

Your progress (attempts, streaks, and which questions still need review) saves automatically in the browser. Clear `localStorage` for a fresh start.

## Repo Layout

```
src/
  client/
    index.html        # Main entry point
    styles.css        # UI styling
    app.js            # Core application logic
    data/
      questions_gsm8k.js    # Pre-built GSM8K dataset exported as an ES module
  server/serve.py     # Local development server that also bootstraps the dataset file
```

## Preparing for Static Hosting (GitHub Pages)

The browser expects `data/questions_gsm8k.js` relative to `index.html`, which maps to `src/client/data/questions_gsm8k.js` in the repository. If the file is missing or outdated, run the dev server once and it will download and regenerate the dataset automatically:

```bash
python3 src/server/serve.py --port 3000
```

After the first run, stop the server, commit the updated `src/client/data/questions_gsm8k.js`, push to GitHub, and enable Pages (branch: `main`, folder: `/root`). GitHub Pages will serve both `index.html` and `data/questions_gsm8k.js`, so no backend is required.

## Updating the Dataset

If a newer GSM8K dump becomes available, either delete `src/client/data/questions_gsm8k.js` and rerun the dev server to rebuild it, or update the source URL inside `serve.py` and run:

```bash
python3 src/server/serve.py --port 3000
```

Once the file regenerates, stop the server and commit the refreshed module.

> ⚠️ The app never fetches GSM8K automatically at runtime. Make sure to commit the refreshed `src/client/data/questions_gsm8k.js` so static hosting stays in sync.

## Next Ideas

- Add gentle hints or worked solutions after multiple incorrect tries.
- Group questions by topic or difficulty to create custom practice tracks.
- Expose a parent dashboard summarizing session stats across devices.

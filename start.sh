#!/usr/bin/env bash
# start.sh — simple startup script for the Math Quest (GSM8K) app
# Usage: ./start.sh [port]

set -euo pipefail

PORT=${1:-3000}
PYTHON=python3
PIDFILE=".serve.pid"

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"

echo "Starting Math Quest  GSM8K on http://localhost:$PORT"

# Ensure we don't accidentally start multiple servers; remove stale pidfile if process no longer exists
if [ -f "$PIDFILE" ]; then
  OLD_PID=$(cat "$PIDFILE" 2>/dev/null || true)
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" >/dev/null 2>&1; then
    echo "Server already running (PID: $OLD_PID). Use ./stop.sh to stop it first." >&2
    exit 1
  else
    rm -f "$PIDFILE"
  fi
fi

# Run the static server in background
"$PYTHON" src/server/serve.py --port "$PORT" &
SERVER_PID=$!
echo "$SERVER_PID" > "$PIDFILE"

# Ensure pidfile is removed on exit
_cleanup() {
  rm -f "$PIDFILE" || true
}
trap _cleanup EXIT

# If the script receives SIGINT/SIGTERM, forward to the server
_forward() {
  sig="$1"
  if [ -n "$SERVER_PID" ]; then
    kill -s "$sig" "$SERVER_PID" 2>/dev/null || true
  fi
}
trap '(_forward SIGINT)' INT
trap '(_forward SIGTERM)' TERM

# Give server a moment to start
sleep 0.6

# Open default browser (macOS)
if command -v open >/dev/null 2>&1; then
  open "http://localhost:$PORT"
else
  echo "Visit http://localhost:$PORT in your browser"
fi

# Wait on the server process and forward signals
wait $SERVER_PID

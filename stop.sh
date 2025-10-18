#!/usr/bin/env bash
# stop.sh — convenience script to stop any background serve.py instances
# Usage: ./stop.sh

set -euo pipefail

FORCE=0
if [ "${1:-}" = "--force" ]; then
  FORCE=1
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"

PIDFILE=".serve.pid"

echo "Stopping Math Quest server..."

# If pidfile exists, prefer using it
if [ -f "$PIDFILE" ]; then
  PID=$(cat "$PIDFILE" 2>/dev/null || true)
  if [ -n "$PID" ] && kill -0 "$PID" >/dev/null 2>&1; then
    if [ "$FORCE" -eq 1 ]; then
      echo "Force killing PID $PID"
      kill -9 "$PID" || true
    else
      echo "Sending SIGTERM to PID $PID"
      kill "$PID" || true
    fi
    rm -f "$PIDFILE" || true
    echo "Done."
    exit 0
  else
    echo "Stale pidfile found but process not running. Removing pidfile."
    rm -f "$PIDFILE" || true
  fi
fi

echo "No pidfile present; falling back to pattern match."

if command -v pkill >/dev/null 2>&1; then
  if [ "$FORCE" -eq 1 ]; then
    pkill -9 -f "src/server/serve.py" || true
    echo "Sent SIGKILL to matching processes."
  else
    pkill -f "src/server/serve.py" || true
    echo "Sent SIGTERM to matching processes (if any)."
  fi
else
  echo "pkill not available. Falling back to lsof+kill."
  if command -v lsof >/dev/null 2>&1; then
    PIDS=$(lsof -t -iTCP:3000 -sTCP:LISTEN || true)
    if [ -n "$PIDS" ]; then
      if [ "$FORCE" -eq 1 ]; then
        kill -9 $PIDS || true
      else
        kill $PIDS || true
      fi
      echo "Sent signals to PIDs: $PIDS"
    else
      echo "No processes found listening on port 3000."
    fi
  else
    echo "Neither pkill nor lsof available. Cannot locate serve processes." >&2
    exit 1
  fi
fi

# give processes a moment to terminate
sleep 0.3

if pgrep -f "src/server/serve.py" >/dev/null 2>&1; then
  echo "Some serve.py processes may still be running:" 
  pgrep -af "src/server/serve.py" || true
  if [ "$FORCE" -ne 1 ]; then
    echo "You can force kill remaining processes with: ./stop.sh --force"
  fi
else
  echo "No serve.py processes detected."
fi

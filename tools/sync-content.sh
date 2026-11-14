#!/usr/bin/env bash
# Copies the built content from the four Android app repos into this site.
#
# Run it after rebuilding content in one of those repos:
#
#   tools/sync-content.sh [PATH_TO_FOLDER_HOLDING_THE_REPOS]
#
# The folder defaults to this repo's parent, where the repos sit side by side:
#   vibe-jap-writing, vibe-srs-jap-conjugating, vibe-jap-reading, vibe-jap-listening
set -euo pipefail

here="$(cd "$(dirname "$0")/.." && pwd)"
src="${1:-$(dirname "$here")}"

copy() {
  local from="$1" to="$2"
  if [ ! -e "$from" ]; then
    echo "missing: $from" >&2
    exit 1
  fi
  mkdir -p "$(dirname "$to")"
  cp "$from" "$to"
}

copy "$src/vibe-jap-writing/assets/content.json" "$here/writing/data/content.json"
copy "$src/vibe-jap-writing/assets/strokes.json" "$here/writing/data/strokes.json"
copy "$src/vibe-srs-jap-conjugating/assets/content.json" "$here/conjugation/data/content.json"
copy "$src/vibe-jap-reading/assets/content.json" "$here/reading/data/content.json"
copy "$src/vibe-jap-listening/assets/content.json" "$here/listening/data/content.json"

mkdir -p "$here/listening/audio"
rm -f "$here/listening/audio/"*.ogg
cp "$src/vibe-jap-listening/assets/audio/"*.ogg "$here/listening/audio/"

echo "Content synced from $src"

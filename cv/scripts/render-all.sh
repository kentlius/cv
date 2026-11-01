#!/usr/bin/env bash
# Render every RenderCV file in the cv/ directory and verify the PDFs exist.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
shopt -s nullglob

cv_files=(*_CV*.yaml)
if [ ${#cv_files[@]} -eq 0 ]; then
  echo "No RenderCV file found!" >&2
  exit 1
fi

for cv_file in "${cv_files[@]}"; do
  marker="$(mktemp)"
  touch -d '2 seconds ago' "$marker"
  uv run rendercv render "$cv_file"

  fresh_pdf="$(find rendercv_output -type f -name '*.pdf' -newer "$marker" -print -quit)"
  rm -f "$marker"
  if [ -z "$fresh_pdf" ]; then
    echo "No PDF newer than the render start for $cv_file" >&2
    exit 1
  fi
  echo "Rendered $cv_file -> $fresh_pdf"
done

#!/bin/sh
# Converts Pokémon artwork and icons from PNG to WebP (one-off, or after adding new artwork).
#   sh tools/convert-images.sh [--keep]
# Uses `cwebp` (apt install webp / brew install webp) if available, otherwise ImageMagick.
# Artwork is encoded lossy (q80, alpha kept), the small icons losslessly.
# PNGs are deleted after a successful conversion unless --keep is given.
set -eu

DIR="$(cd "$(dirname "$0")/../www/assets/pokemon" && pwd)"
KEEP="${1:-}"

if command -v cwebp >/dev/null 2>&1; then
  lossy()    { cwebp -quiet -q 80 -alpha_q 90 -m 6 "$1" -o "$2"; }
  lossless() { cwebp -quiet -lossless -z 9 "$1" -o "$2"; }
elif command -v magick >/dev/null 2>&1 || command -v convert >/dev/null 2>&1; then
  IM="$(command -v magick || command -v convert)"
  lossy()    { "$IM" "$1" -quality 80 -define webp:alpha-quality=90 -define webp:method=6 "$2"; }
  lossless() { "$IM" "$1" -define webp:lossless=true -define webp:method=6 "$2"; }
else
  echo "Neither cwebp nor ImageMagick found. Install one of them (e.g. apt install webp)." >&2
  exit 1
fi

FAILED=""

convert_dir() {
  dir="$1"; mode="$2"; count=0
  for png in "$dir"/*.png; do
    [ -e "$png" ] || continue
    webp="${png%.png}.webp"
    if "$mode" "$png" "$webp" 2>/dev/null && [ -s "$webp" ]; then
      [ "$KEEP" = "--keep" ] || rm "$png"
      count=$((count + 1))
    else
      rm -f "$webp"
      FAILED="$FAILED $png"
    fi
  done
  echo "$dir: converted $count files"
}

before=$(du -sk "$DIR" | cut -f1)
convert_dir "$DIR" lossy
convert_dir "$DIR/icons" lossless
after=$(du -sk "$DIR" | cut -f1)
echo "assets/pokemon: ${before} KB -> ${after} KB"

if [ -n "$FAILED" ]; then
  echo "Could not convert (corrupt source?), PNG kept:$FAILED" >&2
  exit 2
fi

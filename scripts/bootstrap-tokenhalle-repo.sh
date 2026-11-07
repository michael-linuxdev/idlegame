#!/usr/bin/env bash
# One-time: create/push the thin michael-linuxdev/tokenhalle Pages repo
# from deploy/tokenhalle-repo/ in this checkout.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/deploy/tokenhalle-repo"
OWNER_REPO="${TOKENHALLE_REPO:-michael-linuxdev/tokenhalle}"
WORKDIR="${TMPDIR:-/tmp}/tokenhalle-pages-bootstrap-$$"

if [[ ! -d "$SRC/.github/workflows" ]]; then
  echo "missing $SRC/.github/workflows" >&2
  exit 1
fi

if ! gh api "repos/$OWNER_REPO" >/dev/null 2>&1; then
  echo "Creating public repo $OWNER_REPO ..."
  gh repo create "$OWNER_REPO" --public \
    --description "Tokenhalle (arcade) — Pages for tokenhalle.micana.de; builds from michael-linuxdev/idlegame" \
    --disable-issues --disable-wiki
fi

rm -rf "$WORKDIR"
mkdir -p "$WORKDIR"
cp -a "$SRC"/. "$WORKDIR"/
cd "$WORKDIR"
git init -b main
git add .
git -c user.email="pages-bot@users.noreply.github.com" \
    -c user.name="Tokenhalle Pages Bootstrap" \
    commit -m "Tokenhalle Pages mirror (builds arcade from idlegame)"
git remote add origin "https://github.com/${OWNER_REPO}.git"
git push -u origin main

echo
echo "Pushed $OWNER_REPO. Enable Settings → Pages → Source = GitHub Actions if needed."
echo "DNS: CNAME tokenhalle → michael-linuxdev.github.io"
echo "Live (after DNS + first workflow): https://tokenhalle.micana.de"

#!/usr/bin/env python3
"""Generate Gartenerbe PWA icons (192/512/180/maskable) + store icon + favicon.svg.

Seit der Grafik-Überarbeitung entsteht das Icon aus den echten Bausteinen
des Spiels: Gemüsebeet Stufe 5 vor Omas Laube mit Blumen, gerendert per
Playwright aus ?artsheet=icon (src/dev/IconScene.tsx, scripts/art/
render-icon.mjs). Dieses Skript rechnet daraus alle Größen (Lanczos).
favicon.svg bleibt eine vereinfachte Zeichnung — bei 16–32 px wäre das
Beet nur noch ein Fleck.

Usage: npm run build && python3 scripts/generate-pwa-icons.py
"""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public"
STORE = ROOT / "docs" / "store"


def render_masters(tmp: Path) -> tuple[Image.Image, Image.Image]:
    """Render the 1024 px masters (normal + maskable) from the real art."""
    subprocess.run(["node", str(ROOT / "scripts" / "art" / "render-icon.mjs"), str(tmp)], check=True, cwd=ROOT)
    return Image.open(tmp / "icon-master.png").convert("RGBA"), Image.open(tmp / "icon-maskable-master.png").convert("RGBA")


def save_set(out_dir: Path, icon: Image.Image, maskable: Image.Image) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    specs = [
        ("pwa-192.png", 192, False),
        ("pwa-512.png", 512, False),
        ("apple-touch-icon.png", 180, False),
        ("pwa-maskable-512.png", 512, True),
    ]
    for name, size, mask in specs:
        path = out_dir / name
        (maskable if mask else icon).resize((size, size), Image.Resampling.LANCZOS).save(path, "PNG", optimize=True)
        print(f"wrote {path} ({path.stat().st_size} bytes)")
    STORE.mkdir(parents=True, exist_ok=True)
    store = STORE / "app-icon-1024.png"
    icon.resize((1024, 1024), Image.Resampling.LANCZOS).convert("RGB").save(store, "PNG", optimize=True)
    print(f"wrote {store}")


FAVICON = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#def0d6"/><stop offset="1" stop-color="#c4e4b2"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#s)"/>
  <circle cx="48" cy="14" r="7" fill="#f5c542"/>
  <ellipse cx="32" cy="68" rx="46" ry="26" fill="#7cba5c"/>
  <path d="M7 30 L16 23 L25 30 Z" fill="#c4553f" stroke="#6e2f22" stroke-width="1.2" stroke-linejoin="round"/>
  <rect x="9" y="30" width="14" height="11" fill="#d9a56c" stroke="#3d2f1f" stroke-width="1.2"/>
  <rect x="14.5" y="34" width="3.5" height="7" fill="#7d9f5a"/>
  <path d="M38.5 50 L38 38 L39 27" stroke="#3f7a30" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M38 34 Q30 26 22 25 Q28 34 38 34 Z" fill="#5f9e45" stroke="#3f7a30" stroke-width="1.2"/>
  <path d="M39 29 Q47 18 57 17 Q51 29 39 29 Z" fill="#8fcf5f" stroke="#3f7a30" stroke-width="1.2"/>
  <ellipse cx="39" cy="51" rx="15" ry="6.5" fill="#7a4d30" stroke="#5b3721" stroke-width="1.2"/>
</svg>
"""


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        icon, maskable = render_masters(Path(tmp))
        save_set(OUT, icon, maskable)
    (OUT / "favicon.svg").write_text(FAVICON)
    print("wrote favicon.svg")


if __name__ == "__main__":
    main()

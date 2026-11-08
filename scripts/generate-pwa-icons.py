#!/usr/bin/env python3
"""Generate Gartenerbe PWA icons (192/512/180/maskable) + favicon.svg into public/.

Motif: a young sprout rising from a soil mound in front of Omas red-roofed
Laube, under a warm sun — readable down to 32px.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public"

SKY_TOP = (222, 240, 214)
SKY_BOTTOM = (196, 228, 178)
GRASS = (124, 186, 92)
GRASS_D = (95, 158, 69)
SOIL = (122, 77, 48)
SOIL_D = (91, 55, 33)
LEAF = (95, 158, 69)
LEAF_L = (143, 207, 95)
STEM = (63, 122, 48)
ROOF = (196, 85, 63)
ROOF_D = (110, 47, 34)
WALL = (217, 165, 108)
SUN = (245, 197, 66)
OUTLINE = (61, 47, 31)


def vgradient(size: int, top: tuple, bottom: tuple) -> Image.Image:
    img = Image.new("RGBA", (size, size))
    d = ImageDraw.Draw(img)
    for y in range(size):
        t = y / max(1, size - 1)
        c = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)) + (255,)
        d.line([(0, y), (size, y)], fill=c)
    return img


def leaf(d, P, base, tip, bulge, fill, edge, w):
    """Pointed leaf between base and tip (design-space coords)."""
    (bx, by), (tx, ty) = base, tip
    dx, dy = tx - bx, ty - by
    ln = math.hypot(dx, dy) or 1
    nx, ny = -dy / ln, dx / ln
    side_a, side_b = [], []
    for i in range(21):
        t = i / 20
        off = math.sin(math.pi * t) * bulge
        x, y = bx + dx * t, by + dy * t
        side_a.append(P(x + nx * off, y + ny * off))
        side_b.append(P(x - nx * off, y - ny * off))
    pts = side_a + side_b[::-1]
    d.polygon(pts, fill=fill)
    d.line(pts + [pts[0]], fill=edge, width=w, joint="curve")
    d.line([P(bx, by), P(bx + dx * 0.8, by + dy * 0.8)], fill=edge, width=max(2, w // 2))


def draw_icon(size: int, *, maskable: bool) -> Image.Image:
    s = size / 512
    img = vgradient(size, SKY_TOP, SKY_BOTTOM)
    d = ImageDraw.Draw(img)
    # maskable icons keep the motif inside the 80% safe zone
    k = 0.8 if maskable else 1.0
    cx = size / 2

    def P(x: float, y: float) -> tuple[float, float]:
        return (cx + (x - 256) * s * k, size / 2 + (y - 256) * s * k)

    def box(x0, y0, x1, y1):
        a, b = P(x0, y0), P(x1, y1)
        return [a[0], a[1], b[0], b[1]]

    w = max(2, int(10 * s * k))
    # sun
    d.ellipse(box(330, 60, 440, 170), fill=SUN)
    # grass hill
    d.ellipse([-size * 0.3, P(0, 330)[1], size * 1.3, size * 1.6], fill=GRASS)
    d.ellipse([-size * 0.2, P(0, 384)[1], size * 1.2, size * 1.7], fill=GRASS_D)
    # Omas Laube (behind, left)
    d.rectangle(box(62, 232, 192, 334), fill=WALL, outline=OUTLINE, width=w)
    d.polygon([P(44, 238), P(127, 170), P(210, 238)], fill=ROOF)
    d.line([P(44, 238), P(127, 170), P(210, 238), P(44, 238)], fill=ROOF_D, width=w, joint="curve")
    d.rectangle(box(110, 270, 144, 334), fill=(125, 159, 90), outline=OUTLINE, width=max(1, w // 2))
    d.rectangle(box(76, 254, 100, 278), fill=(207, 233, 242), outline=(255, 255, 255), width=max(1, w // 2))
    # stem first, the mound covers its base
    d.line([P(308, 400), P(302, 300), P(312, 216)], fill=STEM, width=int(22 * s * k), joint="curve")
    # leaves
    leaf(d, P, (302, 270), (176, 198), 36, LEAF, STEM, w)
    leaf(d, P, (312, 226), (456, 136), 42, LEAF_L, STEM, w)
    # soil mound
    d.ellipse(box(190, 362, 430, 458), fill=SOIL, outline=SOIL_D, width=w)
    d.ellipse(box(236, 378, 300, 398), fill=(150, 100, 66))
    return img


def render(size: int, *, maskable: bool, scale: int = 4) -> Image.Image:
    """Draw large, then Lanczos-downsample for crisp anti-aliased edges."""
    big = draw_icon(size * scale, maskable=maskable).convert("RGBA")
    return big.resize((size, size), Image.Resampling.LANCZOS)


def save_set(out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    specs = [
        ("pwa-192.png", 192, False),
        ("pwa-512.png", 512, False),
        ("apple-touch-icon.png", 180, False),
        ("pwa-maskable-512.png", 512, True),
    ]
    for name, size, maskable in specs:
        path = out_dir / name
        render(size, maskable=maskable).save(path, "PNG", optimize=True)
        print(f"wrote {path} ({path.stat().st_size} bytes)")


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
    save_set(OUT)
    (OUT / "favicon.svg").write_text(FAVICON)
    print("wrote favicon.svg")


if __name__ == "__main__":
    main()

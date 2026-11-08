#!/usr/bin/env python3
"""Generate Gartenerbe PWA icons (192/512/180/maskable) + favicon into public/.

Interim art carried over from the prototype; the garden icon follows in the polish PR.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public"

# Brand tokens (match src/theme/tokens.css)
FARM_BG = (232, 240, 228, 255)  # #e8f0e4
FARM_DEEP = (220, 232, 214, 255)  # #dce8d6
FARM_LEAF = (47, 154, 72, 255)  # #2f9a48
FARM_LEAF_HOT = (72, 184, 94, 255)  # #48b85e
FARM_LEAF_DIM = (31, 110, 50, 255)  # #1f6e32
FARM_GLASS = (220, 236, 200, 230)
FARM_GLASS_EDGE = (61, 139, 79, 255)  # #3d8b4f
FARM_EARTH = (107, 143, 94, 255)  # #6b8f5e
FARM_AMBER = (232, 160, 80, 255)  # #e8a050
FARM_SKY = (200, 220, 210, 255)


def lerp(a: tuple, b: tuple, t: float) -> tuple:
    return tuple(int(round(x + (y - x) * t)) for x, y in zip(a, b))


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    box: tuple[float, float, float, float],
    radius: float,
    fill=None,
    outline=None,
    width: int = 1,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def paint_vertical_gradient(
    img: Image.Image,
    top: tuple,
    bottom: tuple,
) -> None:
    w, h = img.size
    px = img.load()
    for y in range(h):
        c = lerp(top, bottom, y / max(h - 1, 1))
        for x in range(w):
            px[x, y] = c


def soft_vignette(img: Image.Image, strength: float = 0.12) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    # light corner wash only — keep icons bright
    for i in range(8):
        a = int(18 * strength * (1 - i / 8))
        inset = int(w * 0.02 * i)
        d.ellipse(
            [inset - w * 0.15, inset - h * 0.15, w - inset + w * 0.15, h - inset + h * 0.15],
            outline=(255, 255, 255, a),
            width=max(2, w // 80),
        )
    return Image.alpha_composite(img, overlay)


def draw_leaf(
    draw: ImageDraw.ImageDraw,
    cx: float,
    cy: float,
    s: float,
    flip: bool = False,
) -> None:
    dx = -1 if flip else 1
    pts = [
        (cx, cy - 10 * s),
        (cx + 9 * s * dx, cy - 2 * s),
        (cx + 3 * s * dx, cy + 10 * s),
        (cx - 2 * s * dx, cy + 2 * s),
    ]
    draw.polygon(pts, fill=FARM_LEAF_HOT)
    draw.line(
        [(cx, cy - 8 * s), (cx + 1 * s * dx, cy + 6 * s)],
        fill=FARM_LEAF_DIM,
        width=max(1, int(1.5 * s)),
    )


def draw_turmfarm(size: int, *, maskable: bool) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    paint_vertical_gradient(img, FARM_BG, FARM_DEEP)
    draw = ImageDraw.Draw(img)

    # Safe / content scale: maskable keeps logo in ~80% diameter
    pad = 0.18 if maskable else 0.10
    margin = size * pad
    content = size - 2 * margin
    cx = size / 2

    # Soft sky disk
    sky_r = content * 0.48
    draw.ellipse(
        [cx - sky_r, margin + content * 0.02, cx + sky_r, margin + content * 0.78],
        fill=FARM_SKY,
    )

    # Rooftop base / yard
    base_y = margin + content * 0.82
    draw.ellipse(
        [cx - content * 0.38, base_y - content * 0.04, cx + content * 0.38, base_y + content * 0.08],
        fill=(165, 196, 150, 255),
    )
    draw.rounded_rectangle(
        [cx - content * 0.28, base_y - content * 0.02, cx + content * 0.28, base_y + content * 0.06],
        radius=content * 0.02,
        fill=FARM_EARTH,
    )

    # Glass tower body
    tw = content * 0.28
    th = content * 0.62
    tx0 = cx - tw / 2
    ty0 = margin + content * 0.12
    tx1 = cx + tw / 2
    ty1 = ty0 + th

    # Tower shadow/depth
    draw.rounded_rectangle(
        [tx0 + content * 0.02, ty0 + content * 0.02, tx1 + content * 0.02, ty1],
        radius=content * 0.04,
        fill=(107, 143, 94, 90),
    )
    draw.rounded_rectangle(
        [tx0, ty0, tx1, ty1],
        radius=content * 0.045,
        fill=(245, 250, 240, 255),
        outline=FARM_GLASS_EDGE,
        width=max(2, size // 64),
    )

    # Inner glass pane
    inset = content * 0.035
    draw.rounded_rectangle(
        [tx0 + inset, ty0 + inset, tx1 - inset, ty1 - inset * 0.6],
        radius=content * 0.03,
        fill=FARM_GLASS,
        outline=(90, 150, 100, 180),
        width=max(1, size // 96),
    )

    # Floor bands + plants
    floors = 4
    band_h = (th - inset * 2.2) / floors
    for i in range(floors):
        y = ty0 + inset + i * band_h + band_h * 0.55
        # shelf
        draw.ellipse(
            [cx - tw * 0.55, y - band_h * 0.12, cx + tw * 0.55, y + band_h * 0.18],
            fill=(197, 217, 184, 255),
            outline=FARM_GLASS_EDGE,
            width=max(1, size // 128),
        )
        leaf_s = content / 220
        draw_leaf(draw, cx - tw * 0.28, y - band_h * 0.05, leaf_s * 1.1)
        draw_leaf(draw, cx, y - band_h * 0.12, leaf_s * 1.35)
        draw_leaf(draw, cx + tw * 0.28, y - band_h * 0.05, leaf_s * 1.1, flip=True)
        # tiny grow LEDs
        led_r = max(1.5, size * 0.008)
        draw.ellipse(
            [cx - tw * 0.42 - led_r, y - led_r, cx - tw * 0.42 + led_r, y + led_r],
            fill=FARM_AMBER,
        )
        draw.ellipse(
            [cx + tw * 0.42 - led_r, y - led_r, cx + tw * 0.42 + led_r, y + led_r],
            fill=(126, 200, 255, 255),
        )

    # Cap / antenna leaf
    cap_r = content * 0.045
    draw.ellipse(
        [cx - cap_r, ty0 - cap_r * 1.2, cx + cap_r, ty0 + cap_r * 0.8],
        fill=FARM_LEAF,
        outline=FARM_LEAF_DIM,
        width=max(1, size // 128),
    )
    draw_leaf(draw, cx - content * 0.06, ty0 - content * 0.02, content / 240, flip=True)
    draw_leaf(draw, cx + content * 0.06, ty0 - content * 0.02, content / 240)

    # Highlight streak on glass
    hl = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    hld = ImageDraw.Draw(hl)
    hld.polygon(
        [
            (tx0 + content * 0.04, ty0 + content * 0.05),
            (tx0 + content * 0.12, ty0 + content * 0.05),
            (tx0 + content * 0.08, ty1 - content * 0.08),
            (tx0 + content * 0.03, ty1 - content * 0.08),
        ],
        fill=(255, 255, 255, 70),
    )
    img = Image.alpha_composite(img, hl)
    return soft_vignette(img, 0.08)


def render(drawer, size: int, *, maskable: bool, scale: int = 4) -> Image.Image:
    """Draw at higher res then Lanczos-downsample for crisp anti-aliased edges."""
    big = drawer(size * scale, maskable=maskable).convert("RGBA")
    return big.resize((size, size), Image.Resampling.LANCZOS)


def save_set(drawer, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    specs = [
        ("pwa-192.png", 192, False),
        ("pwa-512.png", 512, False),
        ("apple-touch-icon.png", 180, False),
        ("pwa-maskable-512.png", 512, True),
    ]
    for name, size, maskable in specs:
        icon = render(drawer, size, maskable=maskable)
        path = out_dir / name
        icon.save(path, "PNG", optimize=True)
        print(f"wrote {path} ({path.stat().st_size} bytes)")


def write_favicons() -> None:
    farm_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#e8f0e4"/>
  <ellipse cx="32" cy="54" rx="18" ry="4" fill="#a5c496"/>
  <rect x="24" y="10" width="16" height="42" rx="3" fill="#f5faf0" stroke="#3d8b4f" stroke-width="1.6"/>
  <rect x="27" y="13" width="10" height="36" rx="2" fill="#dcecc8" stroke="#3d8b4f" stroke-width="0.9" opacity="0.95"/>
  <ellipse cx="32" cy="20" rx="11" ry="3.2" fill="#c5d9b8" stroke="#3d8b4f" stroke-width="0.8"/>
  <ellipse cx="32" cy="30" rx="11" ry="3.2" fill="#c5d9b8" stroke="#3d8b4f" stroke-width="0.8"/>
  <ellipse cx="32" cy="40" rx="11" ry="3.2" fill="#c5d9b8" stroke="#3d8b4f" stroke-width="0.8"/>
  <path d="M26 20c2-4 6-4 6 0" fill="#48b85e"/>
  <path d="M32 18c2-4 6-4 6 0" fill="#2f9a48"/>
  <path d="M26 30c2-4 6-4 6 0" fill="#48b85e"/>
  <path d="M32 28c2-4 6-4 6 0" fill="#2f9a48"/>
  <path d="M26 40c2-4 6-4 6 0" fill="#48b85e"/>
  <path d="M32 38c2-4 6-4 6 0" fill="#2f9a48"/>
  <circle cx="32" cy="9" r="2.4" fill="#2f9a48"/>
  <rect x="20" y="50" width="24" height="4" rx="1.2" fill="#6b8f5e"/>
</svg>
"""
    (OUT / "favicon.svg").write_text(farm_svg)
    print("wrote favicons")


def main() -> None:
    save_set(draw_turmfarm, OUT)
    write_favicons()


if __name__ == "__main__":
    main()

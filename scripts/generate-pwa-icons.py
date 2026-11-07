#!/usr/bin/env python3
"""Generate TurmFarm + Tokenhalle PWA icons (192/512/180/maskable)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT_FARM = ROOT / "public" / "icons" / "farm"
OUT_ARCADE = ROOT / "public" / "icons" / "arcade"
MEDIA = Path("/cursor/stores/bc-01a1b6d5-c7fe-742e-ba4e-203fb3e6c395/media")

# Brand tokens (match themes/*/tokens.css)
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

ARCADE_BG = (230, 238, 248, 255)  # #e6eef8
ARCADE_DEEP = (214, 226, 240, 255)  # #d6e2f0
ARCADE_CYAN = (10, 156, 186, 255)  # #0a9cba
ARCADE_CYAN_PALE = (94, 207, 224, 255)  # #5ecfe0
ARCADE_MAGENTA = (217, 24, 114, 255)  # #d91872
ARCADE_MAGENTA_HOT = (242, 77, 154, 255)  # #f24d9a
ARCADE_GOLD = (201, 162, 39, 255)  # #c9a227
ARCADE_GOLD_PALE = (232, 200, 74, 255)  # #e8c84a
ARCADE_HULL = (208, 222, 236, 255)
ARCADE_HULL_EDGE = (74, 106, 136, 255)  # #4a6a88
ARCADE_SCREEN = (13, 26, 40, 255)
ARCADE_INK = (26, 36, 56, 255)


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


def draw_tokenhalle(size: int, *, maskable: bool) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    paint_vertical_gradient(img, ARCADE_BG, ARCADE_DEEP)
    draw = ImageDraw.Draw(img)

    pad = 0.18 if maskable else 0.10
    margin = size * pad
    content = size - 2 * margin
    cx = size / 2

    # Soft cyan pad glow under cabinet
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gx0 = cx - content * 0.42
    gy0 = margin + content * 0.55
    gx1 = cx + content * 0.42
    gy1 = margin + content * 0.95
    gd.ellipse([gx0, gy0, gx1, gy1], fill=(*ARCADE_CYAN_PALE[:3], 90))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=max(2, size // 40)))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Cabinet body (classic upright)
    top = margin + content * 0.08
    bottom = margin + content * 0.88
    mid_w_top = content * 0.34
    mid_w_bot = content * 0.40
    # Trapezoid-ish via polygon
    hull = [
        (cx - mid_w_top, top + content * 0.08),
        (cx + mid_w_top, top + content * 0.08),
        (cx + mid_w_bot, bottom),
        (cx - mid_w_bot, bottom),
    ]
    # Marquee dome
    dome = [
        (cx - mid_w_top * 0.95, top + content * 0.10),
        (cx - mid_w_top * 0.7, top + content * 0.02),
        (cx, top),
        (cx + mid_w_top * 0.7, top + content * 0.02),
        (cx + mid_w_top * 0.95, top + content * 0.10),
    ]
    draw.polygon(dome + [(cx + mid_w_top, top + content * 0.12), (cx - mid_w_top, top + content * 0.12)], fill=(248, 251, 254, 255))
    draw.polygon(hull, fill=ARCADE_HULL, outline=ARCADE_HULL_EDGE)
    # Re-stroke hull for clarity
    draw.line(hull + [hull[0]], fill=ARCADE_HULL_EDGE, width=max(2, size // 64))

    # Magenta neon marquee tube
    neon_y = top + content * 0.11
    draw.arc(
        [cx - mid_w_top * 0.92, top + content * 0.01, cx + mid_w_top * 0.92, neon_y + content * 0.06],
        start=200,
        end=340,
        fill=ARCADE_MAGENTA,
        width=max(3, size // 48),
    )
    # Cyan underglow on marquee
    draw.arc(
        [cx - mid_w_top * 0.85, top + content * 0.03, cx + mid_w_top * 0.85, neon_y + content * 0.08],
        start=200,
        end=340,
        fill=ARCADE_CYAN,
        width=max(2, size // 72),
    )

    # Screen
    sx0 = cx - content * 0.22
    sy0 = top + content * 0.18
    sx1 = cx + content * 0.22
    sy1 = top + content * 0.42
    rounded_rect(draw, (sx0, sy0, sx1, sy1), content * 0.02, fill=ARCADE_SCREEN)
    # Screen glow / scan
    rounded_rect(
        draw,
        (sx0 + content * 0.02, sy0 + content * 0.02, sx1 - content * 0.02, sy1 - content * 0.02),
        content * 0.015,
        fill=(10, 156, 186, 160),
    )
    # Token glyph on screen — bold circle coin
    coin_r = content * 0.07
    coin_cx, coin_cy = cx, (sy0 + sy1) / 2
    draw.ellipse(
        [coin_cx - coin_r, coin_cy - coin_r, coin_cx + coin_r, coin_cy + coin_r],
        fill=ARCADE_GOLD_PALE,
        outline=ARCADE_GOLD,
        width=max(2, size // 80),
    )
    draw.ellipse(
        [
            coin_cx - coin_r * 0.62,
            coin_cy - coin_r * 0.62,
            coin_cx + coin_r * 0.62,
            coin_cy + coin_r * 0.62,
        ],
        outline=ARCADE_MAGENTA,
        width=max(2, size // 90),
    )
    # "T" mark
    tw = max(2, size // 64)
    draw.line(
        [(coin_cx - coin_r * 0.32, coin_cy - coin_r * 0.28), (coin_cx + coin_r * 0.32, coin_cy - coin_r * 0.28)],
        fill=ARCADE_INK,
        width=tw,
    )
    draw.line(
        [(coin_cx, coin_cy - coin_r * 0.28), (coin_cx, coin_cy + coin_r * 0.34)],
        fill=ARCADE_INK,
        width=tw,
    )

    # Control panel
    py0 = top + content * 0.48
    py1 = top + content * 0.62
    rounded_rect(
        draw,
        (cx - content * 0.24, py0, cx + content * 0.24, py1),
        content * 0.02,
        fill=(232, 240, 248, 255),
        outline=ARCADE_HULL_EDGE,
        width=max(1, size // 96),
    )
    btn_r = content * 0.035
    draw.ellipse(
        [cx - content * 0.14 - btn_r, (py0 + py1) / 2 - btn_r, cx - content * 0.14 + btn_r, (py0 + py1) / 2 + btn_r],
        fill=ARCADE_MAGENTA,
    )
    # Joystick
    jx, jy = cx, (py0 + py1) / 2
    draw.ellipse([jx - btn_r * 1.15, jy - btn_r * 1.15, jx + btn_r * 1.15, jy + btn_r * 1.15], fill=(194, 210, 228, 255), outline=ARCADE_HULL_EDGE, width=max(1, size // 128))
    draw.ellipse([jx - btn_r * 0.55, jy - btn_r * 1.55, jx + btn_r * 0.55, jy - btn_r * 0.35], fill=ARCADE_CYAN)
    draw.ellipse(
        [cx + content * 0.14 - btn_r, (py0 + py1) / 2 - btn_r, cx + content * 0.14 + btn_r, (py0 + py1) / 2 + btn_r],
        fill=ARCADE_CYAN,
    )

    # Coin slot / gold bar at base
    by0 = bottom - content * 0.08
    rounded_rect(
        draw,
        (cx - content * 0.32, by0, cx + content * 0.32, bottom),
        content * 0.015,
        fill=(122, 148, 174, 255),
        outline=ARCADE_HULL_EDGE,
        width=max(1, size // 96),
    )
    rounded_rect(
        draw,
        (cx - content * 0.08, by0 + content * 0.02, cx + content * 0.08, bottom - content * 0.02),
        content * 0.01,
        fill=ARCADE_GOLD,
    )

    # Side token coin badge (readable at small size)
    badge_r = content * 0.11
    bx = cx + content * 0.32
    by = top + content * 0.36
    # slight shadow
    draw.ellipse(
        [bx - badge_r + 2, by - badge_r + 3, bx + badge_r + 2, by + badge_r + 3],
        fill=(26, 36, 56, 40),
    )
    draw.ellipse(
        [bx - badge_r, by - badge_r, bx + badge_r, by + badge_r],
        fill=ARCADE_GOLD_PALE,
        outline=ARCADE_GOLD,
        width=max(2, size // 64),
    )
    draw.ellipse(
        [bx - badge_r * 0.7, by - badge_r * 0.7, bx + badge_r * 0.7, by + badge_r * 0.7],
        outline=ARCADE_CYAN,
        width=max(2, size // 80),
    )

    return soft_vignette(img, 0.1)


def render(drawer, size: int, *, maskable: bool, scale: int = 4) -> Image.Image:
    """Draw at higher res then Lanczos-downsample for crisp anti-aliased edges."""
    big = drawer(size * scale, maskable=maskable).convert("RGBA")
    return big.resize((size, size), Image.Resampling.LANCZOS)


def save_set(drawer, out_dir: Path, prefix_media: str) -> None:
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

    # Media store copies (512 any-purpose)
    MEDIA.mkdir(parents=True, exist_ok=True)
    media_path = MEDIA / prefix_media
    render(drawer, 512, maskable=False).save(media_path, "PNG", optimize=True)
    print(f"wrote {media_path}")


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
    arcade_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#e6eef8"/>
  <ellipse cx="32" cy="56" rx="18" ry="4" fill="#5ecfe0" opacity="0.45"/>
  <path d="M22 50 L19 22 Q19 12 32 9 Q45 12 45 22 L42 50 Z" fill="#d0deec" stroke="#4a6a88" stroke-width="1.5"/>
  <path d="M21 22 Q21 13 32 11 Q43 13 43 22" fill="none" stroke="#d91872" stroke-width="2.2"/>
  <rect x="23" y="18" width="18" height="14" rx="1.5" fill="#0d1a28"/>
  <rect x="24.5" y="19.5" width="15" height="11" rx="1" fill="#0a9cba" opacity="0.75"/>
  <circle cx="32" cy="25" r="4.2" fill="#e8c84a" stroke="#c9a227" stroke-width="1"/>
  <path d="M29.5 23.2h5M32 23.2v5.2" stroke="#1a2438" stroke-width="1.4" stroke-linecap="round"/>
  <rect x="24" y="36" width="16" height="6" rx="1.2" fill="#e8f0f8" stroke="#5a7a98" stroke-width="0.8"/>
  <circle cx="27.5" cy="39" r="1.6" fill="#d91872"/>
  <circle cx="32" cy="39" r="2.1" fill="#c2d2e4" stroke="#4a6a88" stroke-width="0.7"/>
  <circle cx="36.5" cy="39" r="1.6" fill="#0a9cba"/>
  <rect x="21" y="48" width="22" height="3.5" rx="1" fill="#7a94ae"/>
  <rect x="28" y="48.6" width="8" height="2" rx="0.6" fill="#c9a227"/>
  <circle cx="48" cy="30" r="7" fill="#e8c84a" stroke="#c9a227" stroke-width="1.3"/>
  <circle cx="48" cy="30" r="4.6" fill="none" stroke="#0a9cba" stroke-width="1.2"/>
</svg>
"""
    (ROOT / "public" / "icons" / "farm" / "favicon.svg").write_text(farm_svg)
    (ROOT / "public" / "icons" / "arcade" / "favicon.svg").write_text(arcade_svg)
    # Default public favicon = farm (TurmFarm live)
    (ROOT / "public" / "favicon.svg").write_text(farm_svg)
    print("wrote favicons")


def main() -> None:
    # Bind names for opaque-bg heuristic (unused but kept clear)
    draw_turmfarm.__name__ = "draw_turmfarm"
    draw_tokenhalle.__name__ = "draw_tokenhalle"
    save_set(draw_turmfarm, OUT_FARM, "icon-turmfarm-512.png")
    save_set(draw_tokenhalle, OUT_ARCADE, "icon-tokenhalle-512.png")
    write_favicons()

    # Legacy root aliases → farm (default Pages deploy)
    for name in ("pwa-192.png", "pwa-512.png"):
        src = OUT_FARM / name
        dst = ROOT / "public" / name
        dst.write_bytes(src.read_bytes())
        print(f"alias {dst}")


if __name__ == "__main__":
    main()

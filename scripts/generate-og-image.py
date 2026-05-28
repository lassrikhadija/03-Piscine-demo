#!/usr/bin/env python3
"""
generate-og-image.py
Génère images/optimized/og-image.jpg (1200×630) pour Open Graph.
Background : hero.jpg  +  dégradé sombre  +  typographie brandée
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import struct, os

# ── Chemins ──────────────────────────────────────────────────────────────────
BASE   = Path(__file__).resolve().parent.parent
HERO   = BASE / "images" / "optimized" / "hero.jpg"
OUT    = BASE / "images" / "optimized" / "og-image.jpg"
FONTS  = Path("C:/Windows/Fonts")

OG_W, OG_H = 1200, 630

# ── Couleurs brand ────────────────────────────────────────────────────────────
DEEP_BLUE = (10, 37, 64)       # #0A2540
CYAN      = (0, 194, 209)      # #00C2D1
COPPER    = (200, 149, 109)    # #C8956D
WHITE     = (255, 255, 255)
WHITE70   = (255, 255, 255, 178)

# ── Charger la police (fallback chaîne) ──────────────────────────────────────
def load_font(size, bold=False):
    candidates = []
    if bold:
        candidates = [
            FONTS / "framd.ttf",     # Franklin Gothic Demi
            FONTS / "arialbd.ttf",
            FONTS / "calibrib.ttf",
            FONTS / "georgia.ttf",
        ]
    else:
        candidates = [
            FONTS / "arial.ttf",
            FONTS / "calibri.ttf",
            FONTS / "segoeui.ttf",
            FONTS / "tahoma.ttf",
        ]
    for p in candidates:
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()

# ── Construction de l'image ───────────────────────────────────────────────────
def generate():
    # 1. Background : recadrer hero.jpg en 1200×630
    hero = Image.open(HERO).convert("RGB")
    hw, hh = hero.size
    # ratio cible
    target_ratio = OG_W / OG_H
    src_ratio    = hw / hh

    if src_ratio > target_ratio:
        # Trop large → crop horizontal centré
        new_w = int(hh * target_ratio)
        left  = (hw - new_w) // 2
        hero  = hero.crop((left, 0, left + new_w, hh))
    else:
        # Trop haut → crop vertical, garde le haut (piscine)
        new_h = int(hw / target_ratio)
        hero  = hero.crop((0, 0, hw, new_h))

    hero = hero.resize((OG_W, OG_H), Image.LANCZOS)

    # Légère désaturation pour que le texte ressorte
    from PIL import ImageEnhance
    hero = ImageEnhance.Color(hero).enhance(0.75)
    hero = ImageEnhance.Brightness(hero).enhance(0.65)

    canvas = hero.copy()
    draw   = ImageDraw.Draw(canvas, "RGBA")

    # 2. Dégradé sombre gauche → droite (RGBA layer)
    grad = Image.new("RGBA", (OG_W, OG_H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grad)
    for x in range(OG_W):
        # opacité 0→75 % sur 55 % de la largeur, puis stable
        ratio = min(x / (OG_W * 0.55), 1.0)
        alpha = int(190 * (1 - ratio) + 80 * ratio)
        gdraw.line([(x, 0), (x, OG_H)], fill=(10, 20, 40, alpha))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), grad)

    # 3. Bande cyan en bas (12 px)
    draw2 = ImageDraw.Draw(canvas)
    draw2.rectangle([(0, OG_H - 12), (OG_W, OG_H)], fill=(*CYAN, 255))

    # 4. Filet cuivré vertical (côté gauche)
    draw2.rectangle([(54, 60), (57, OG_H - 60)], fill=(*COPPER, 210))

    # 5. Textes
    font_title   = load_font(88, bold=True)
    font_tagline = load_font(30, bold=False)
    font_credit  = load_font(22, bold=False)
    font_badge   = load_font(18, bold=False)

    pad_l = 80  # padding gauche après filet

    # Titre principal "AQUA ÉLITE"
    draw2.text((pad_l, 130), "AQUA ÉLITE",
               font=font_title, fill=WHITE)

    # Séparateur cuivré sous le titre
    tw = draw2.textlength("AQUA ÉLITE", font=font_title) if hasattr(draw2, 'textlength') else 500
    draw2.rectangle([(pad_l, 240), (pad_l + min(tw, 540), 244)], fill=(*COPPER, 230))

    # Tagline
    draw2.text((pad_l, 262),
               "Piscines & spas de prestige",
               font=font_tagline, fill=(*WHITE, 230))
    draw2.text((pad_l, 302),
               "Montréal — Laval — Rive-Sud",
               font=font_tagline, fill=(*CYAN, 230))

    # Badge Nextiweb en bas gauche
    draw2.text((pad_l, OG_H - 52),
               "Démo · nextiweb.ca",
               font=font_credit, fill=(*COPPER, 200))

    # Icône piscine (unicode) coin bas-droit
    draw2.text((OG_W - 80, OG_H - 55),
               "🏊",
               font=load_font(30), fill=(*WHITE, 180))

    # 6. Convertir en RGB + sauvegarder
    final = canvas.convert("RGB")
    final.save(str(OUT), "JPEG", quality=90, optimize=True)
    size_kb = OUT.stat().st_size // 1024
    print(f"[OK]  og-image.jpg  ->  {OG_W}x{OG_H}  --  {size_kb} Ko  ->  {OUT}")

if __name__ == "__main__":
    generate()

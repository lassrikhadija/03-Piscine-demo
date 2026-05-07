"""
Aqua Elite - Nettoyage etoile IA + optimisation images
Pour chaque PNG dans /images/ :
  1) Retire l'etoile IA (coin bas-droit) via clone stamp depuis une zone voisine
  2) Genere WebP + JPG aux dimensions cibles
  3) Sauvegarde dans /images/optimized/
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent.parent
SRC = ROOT / "images"
OUT = SRC / "optimized"
OUT.mkdir(exist_ok=True)

# Mapping image -> (nom de sortie, largeur max, hauteur max)
# Categorisation :
#   HERO   : 1
#   CREUSEES : 2, 3, 4
#   LUXE   : 1 (reutilise via hero.webp), 12, 13
#   SPAS   : 5, 9, 10
#   HIVER  : 6, 11, 14
#   (8 non utilise - doublon de 11 sans drapeau)
TARGETS = {
    "1.png":  ("hero",         2400, 1350),  # Hero infinity edge sunset (= luxe-1)
    "2.png":  ("creusee-1",    1400, 1050),  # Creusee moderne deck composite
    "3.png":  ("creusee-2",    1400, 1050),  # Creusee classique deck bois
    "4.png":  ("creusee-3",    1400, 1050),  # Creusee luxe travertin pergola
    "12.png": ("luxe-2",       1400, 1050),  # Villa Mediterranee debordement
    "13.png": ("luxe-3",       1400, 1050),  # Villa luxe vue mer bateaux
    "5.png":  ("spa-1",        1400, 1050),  # Spa pierre nuit foret vapeur
    "9.png":  ("spa-2",        1400, 1050),  # Spa chalet pierre montagne crepuscule
    "10.png": ("spa-3",        1400, 1050),  # Spa moderne illumine soir
    "6.png":  ("hiver-1",      1400, 1050),  # Hivernage automne deck bois
    "11.png": ("hiver-2",      1400, 1050),  # Hivernage hiver luxe drapeau
    "14.png": ("hiver-3",      1400, 1050),  # Hivernage piscine couverte bleue
}

def remove_ai_star(img: Image.Image) -> Image.Image:
    """
    Retire l'etoile IA dans le coin bas-droit en clonant un patch
    pris au-dessus (decalage vertical) sur la meme colonne.
    """
    img = img.convert("RGB")
    w, h = img.size

    patch_w = int(w * 0.10)
    patch_h = int(h * 0.13)
    margin = int(w * 0.005)

    target_x = w - patch_w - margin
    target_y = h - patch_h - margin
    src_y = max(0, target_y - int(patch_h * 1.5))

    patch = img.crop((target_x, src_y, target_x + patch_w, src_y + patch_h))

    # Feathering : masque avec degrade
    mask = Image.new("L", patch.size, 0)
    pixels = mask.load()
    fw, fh = patch.size
    feather = max(8, fw // 8)
    for y in range(fh):
        for x in range(fw):
            d = min(x, y, fw - 1 - x, fh - 1 - y)
            alpha = min(255, int(255 * d / feather)) if d < feather else 255
            pixels[x, y] = alpha

    img.paste(patch, (target_x, target_y), mask)
    return img

def fit_size(img: Image.Image, max_w: int, max_h: int) -> Image.Image:
    w, h = img.size
    ratio = min(max_w / w, max_h / h, 1.0)
    if ratio < 1.0:
        new_size = (int(w * ratio), int(h * ratio))
        img = img.resize(new_size, Image.LANCZOS)
    return img

def process_one(src_path: Path, out_name: str, max_w: int, max_h: int):
    print(f"  -> {src_path.name} ({src_path.stat().st_size // 1024} Ko)")
    img = Image.open(src_path)
    img = remove_ai_star(img)
    img = fit_size(img, max_w, max_h)

    webp = OUT / f"{out_name}.webp"
    jpg  = OUT / f"{out_name}.jpg"

    img.save(webp, "WEBP", quality=82, method=6)
    img.save(jpg,  "JPEG", quality=85, optimize=True, progressive=True)

    print(f"     {webp.name}: {webp.stat().st_size // 1024} Ko / {jpg.name}: {jpg.stat().st_size // 1024} Ko")

def main():
    print("Nettoyage + optimisation des images Aqua Elite")
    print("=" * 60)
    for src_name, (out_name, mw, mh) in TARGETS.items():
        src = SRC / src_name
        if not src.exists():
            print(f"  !! manquant : {src_name}")
            continue
        process_one(src, out_name, mw, mh)
    print("=" * 60)
    print(f"OK -> {OUT}")

if __name__ == "__main__":
    main()

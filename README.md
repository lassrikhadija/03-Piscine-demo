# Aqua Élite — démo Nextiweb

Site démo (one-page bilingue FR/EN) pour le portfolio de [Nextiweb.ca](https://nextiweb.ca).
Secteur : pisciniste haut de gamme, Montréal.

## Stack
- HTML5 + CSS pur + JS vanilla (zéro dépendance, parfait Hostinger)
- Polices Google : Fraunces (display) + Inter (body)
- Images : WebP+JPG via `<picture>`, lazy loading, dimensions explicites

## Structure
```
03-Piscine-demo/
├── index.html              FR (par défaut)
├── en/index.html           EN
├── assets/
│   ├── css/styles.css
│   └── js/script.js
├── images/
│   ├── 1.png … 6.png       Originaux (ignorés par git)
│   └── optimized/          WebP + JPG servis au site
├── scripts/
│   └── clean-and-optimize.py   Retire l'étoile IA + optimise
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── README.md
```

## Charte
- Bleu profond `#0A2540`
- Cyan aqua `#00C2D1`
- Cuivre luxe `#C8956D`
- Blanc cassé `#F8FBFD`

## SEO
- Schema.org : `LocalBusiness`, `Service`, `FAQPage`
- Open Graph + Twitter Cards
- `hreflang` FR-CA / EN-CA / x-default
- `sitemap.xml` + `robots.txt`
- Canonical, alt text, ARIA, skip-link

## Lancer en local
Ouvrir `index.html` dans un navigateur (aucun build).
Pour servir avec un mini-serveur :
```bash
python -m http.server 8000
```

## Régénérer les images
Si tu remplaces les PNG dans `images/`, relance :
```bash
python scripts/clean-and-optimize.py
```
Le script retire l'étoile IA (clone-stamp dans le coin bas-droit) et exporte WebP + JPG dans `images/optimized/`.

## Déploiement Hostinger
Cible : `construction-renovation.nextiwebstudio.ca` (sous-domaine).
Uploader tout le dossier sauf `images/*.png` (originaux) et `scripts/`.

---

Démo conçue par [Nextiweb.ca](https://nextiweb.ca) — fondatrice **Khadija Aït Lassri**

- LinkedIn entreprise : <https://www.linkedin.com/company/25819184/>
- LinkedIn personnel : <https://www.linkedin.com/in/khadija-ait-lassri/>

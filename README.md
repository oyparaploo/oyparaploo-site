# Oyparaploo Website

Hugo-powered site deployed on Cloudflare Pages.

## How to add a new exhibition

1. Create a new file in `content/exhibitions/` — name it with hyphens:
   `content/exhibitions/my-new-exhibition.md`

2. Copy this template and fill it in:

```yaml
---
title: "Your Exhibition Title"
label: "Exhibition"
dates: "Month Year – Ongoing"
status: "Now in progress"
location: "Oyparaploo, Minneapolis"
admission: "Free to read online"
hero_image: "exhibitions/your-hero.jpg"

credits:
  - "First credit line."
  - "Second credit line."
---

Your description paragraphs go here. Use *italics* and **bold** as needed.

Second paragraph.
```

3. Upload the hero image to R2 at `exhibitions/your-hero.jpg`
4. Push to GitHub — Cloudflare builds and deploys automatically

The page will appear at `oyparaploo.com/exhibitions/my-new-exhibition/`

## Optional sections

Add any of these to the front matter to enable extra sections:

**Voices** (people/characters involved):
```yaml
voices:
  - name: "Person Name"
    role: "Their Role"
    desc: "Description of their contribution."
    primary: true  # optional, highlights this voice
```

**Inside the Work** (methodology/technique cards):
```yaml
inside:
  - label: "Category"
    title: "Card Title"
    text: "Description of this aspect."
```

**Press Quotes**:
```yaml
press:
  - quote: "What they said about the work."
    source: "Publication Name"
```

**Related Works** (slider of connected pieces):
```yaml
related:
  - title: "Related Work Title"
    meta: "Date · Type"
    image: "exhibitions/related-image.jpg"
```

**Publication/Catalog**:
```yaml
publication:
  title: "Publication Title"
  description: "Description of the publication."
  image: "good-grounds/catalog.jpg"
```

## Image URLs

All images are served from `https://images.oyparaploo.com/`.
Upload to R2 bucket `oyparaploo-images`, organized in folders:
- `exhibitions/` — exhibition hero images and thumbnails
- `good-grounds/` — Good Grounds specific images
- `archive/` — archive images
- `practice/` — practice/methodology images

## Site structure

```
content/
  _index.md              → Homepage (oyparaploo.com)
  exhibitions/
    _index.md            → Exhibition listing (oyparaploo.com/exhibitions)
    good-grounds.md      → Individual exhibition page
    staying-alive.md     → Another exhibition
    your-new-show.md     → Add more here

layouts/
  index.html             → Homepage template (Sora/Kunstmuseum style)
  exhibitions/
    list.html            → Exhibition listing template (Outfit/Met style)
    single.html          → Individual exhibition template (Outfit/Met detail)
  _default/
    single.html          → Fallback for other pages
    list.html            → Fallback for other sections
```

## Deployment

Connected to Cloudflare Pages via GitHub.
Build command: `hugo`
Build output directory: `public`
Hugo version: 0.142.0 (set in Cloudflare Pages environment variables)

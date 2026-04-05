# Pixel Phone Launcher Plan

## Goal

- Build a phone-home-screen style hub for all web tools
- Keep a consistent retro 8-bit visual language
- Make app additions simple through one config file

## Information Architecture

- Home = phone desktop
- Areas: status bar, title card, app grid, dock
- Each app tile contains: icon, name, subtitle, link

## Initial App List

- TwitterWithBaiduTranslator -> `../TwitterWithBaiduTranslator/`
- BreatheBall -> `../BreatheBall/`
- XGPBox -> `../xgp-box/`
- Daily -> `../daily/`
- Podcast -> `../podcast-segment-workflow/`

## Visual Rules (V1)

- Theme: bright sky + cozy retro platformer palette
- Fonts: `Press Start 2P` + `Silkscreen`
- Pixel feel checklist:
  - fixed spacing rhythm (4px / 8px)
  - sharp corners and hard borders
  - block gradients with visible step texture
  - `steps()`-style motion over smooth easing

## Icon Pack Options

1. Pixelarticons (recommended)
- Link: https://github.com/halfmage/pixelarticons
- License: MIT
- Best for: clean, consistent icon style in web UI

2. Pixel Icon Library (HackerNoon)
- Link: https://github.com/hackernoon/pixel-icon-library
- License detail: https://pixeliconlibrary.com/license
- Note: free tier requires attribution (CC BY 4.0)

3. Kenney UI Pack (UI parts, not only icons)
- Link: https://kenney.nl/assets/ui-pack
- License: CC0
- Best for: panel, button, and frame decoration

## Phases

### Phase 1 (done)

- Created project structure and static prototype
- Connected the first 5 app entries

### Phase 2 (in progress, core complete)

- Finalized icon strategy with local Pixelarticons SVG files
- Added real icon mapping for each current app
- Implemented hold-to-edit mode + desktop drag + mobile UP/DOWN
- Implemented localStorage order persistence

### Phase 3

- Multi-page app groups (Tools / Content / Fun)
- Quick app search
- Theme switch presets (day/night)

## Decision Notes

- Fast launch path:
  - Keep Pixelarticons + current build
- More game-like path:
  - Layer Kenney pixel UI frames over status bar and cards

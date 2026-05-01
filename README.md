# Xiaoxiong Apps

A pixel-style phone launcher for Xiaoxiong's web tools.

## Connected Apps

- TwitterWithBaiduTranslator
- 22Girl (`twotwo-girl-danmaku-adventure`)
- BreatheBall
- XGPBox (`xgp-box`)
- Daily (`daily`)
- Podcast (`podcast-segment-workflow`)
- Learning by List (`anki-learning-by-list`)

## Local Preview

```bash
python3 -m http.server 5080
```

Open: `http://localhost:5080`

## Deploy (xiaoxiong.app)

```bash
./deploy.sh
```

Default deploy target:

- `DOMAIN=xiaoxiong.app`
- `VPS_HOST=your-vps-host`
- `REMOTE_SITE_DIR=/var/www/xiaoxiong-apps/site`

Optional overrides:

```bash
DOMAIN=example.com VPS_HOST=1.2.3.4 ./deploy.sh
```

## Interactions

- Tap an app: open the tool
- Hold an app: enter edit mode
- In edit mode:
  - Desktop: drag cards to reorder
  - Mobile: use `UP / DOWN`
- `DONE`: leave edit mode
- `RESET`: restore default order

The order is saved in `localStorage`.

## App Configuration

Edit [`apps.config.js`](./apps.config.js) and update `window.PIXEL_APPS`:

- `id`: unique ID (used for saved order)
- `name`: display name
- `note`: subtitle
- `href`: target link
- `iconSrc`: icon file path
- `fallback`: fallback text if icon fails
- `intro`: short project intro shown from the badge tooltip
- `badge`: corner badge style (`question` / `coin` / `mushroom`)

## License

See [`docs/ICON_LICENSE.md`](./docs/ICON_LICENSE.md) for icon attribution.

## Plan

See [`docs/PLAN.md`](./docs/PLAN.md).

#!/bin/bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VPS_HOST="${VPS_HOST:-}"
VPS_USER="${VPS_USER:-root}"
DOMAIN="${DOMAIN:-xiaoxiong.app}"
REMOTE_SITE_DIR="${REMOTE_SITE_DIR:-}"
CERT_NAME="${CERT_NAME:-${DOMAIN}}"

require_env() {
  local name="$1"
  local value="$2"
  if [ -z "${value}" ]; then
    echo "Missing required environment variable: ${name}" >&2
    exit 1
  fi
}

require_env "VPS_HOST" "${VPS_HOST}"
require_env "REMOTE_SITE_DIR" "${REMOTE_SITE_DIR}"

STAGE_DIR="$(mktemp -d)"
trap 'rm -rf "${STAGE_DIR}"' EXIT

echo "Preparing static site files..."
rsync -av --delete \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='docs' \
  "${PROJECT_DIR}/" "${STAGE_DIR}/"

echo "Uploading files to ${VPS_USER}@${VPS_HOST}:${REMOTE_SITE_DIR} ..."
ssh "${VPS_USER}@${VPS_HOST}" "mkdir -p '${REMOTE_SITE_DIR}'"
rsync -avz --delete "${STAGE_DIR}/" "${VPS_USER}@${VPS_HOST}:${REMOTE_SITE_DIR}/"

NGINX_CONF="${STAGE_DIR}/${DOMAIN}.conf"
cat > "${NGINX_CONF}" <<CONF
server {
    listen 80;
    server_name ${DOMAIN};
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name ${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${CERT_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${CERT_NAME}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root ${REMOTE_SITE_DIR};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \\.(css|js|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf)$ {
        expires 7d;
        add_header Cache-Control public;
    }
}
CONF

echo "Updating nginx conf /etc/nginx/conf.d/${DOMAIN}.conf ..."
scp "${NGINX_CONF}" "${VPS_USER}@${VPS_HOST}:/etc/nginx/conf.d/${DOMAIN}.conf"

ssh "${VPS_USER}@${VPS_HOST}" "set -e
LEGACY_SITE=\"/etc/nginx/sites-enabled/${DOMAIN}\"
if [ -e \"\${LEGACY_SITE}\" ]; then
  LEGACY_BACKUP=\"/etc/nginx/sites-available/${DOMAIN}.legacy-\$(date +%Y%m%d%H%M%S)\"
  mv \"\${LEGACY_SITE}\" \"\${LEGACY_BACKUP}\"
fi
nginx -t
systemctl reload nginx"

echo "Done. Site deployed to: https://${DOMAIN}/"

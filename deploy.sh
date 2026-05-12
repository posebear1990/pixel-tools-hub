#!/bin/bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${PROJECT_DIR}/.env"
ENV_EXAMPLE_FILE="${PROJECT_DIR}/.env.example"
VPS_HOST="${VPS_HOST:-}"
VPS_USER="${VPS_USER:-root}"
DOMAIN="${DOMAIN:-xiaoxiong.app}"
REMOTE_SITE_DIR="${REMOTE_SITE_DIR:-}"
CERT_NAME="${CERT_NAME:-${DOMAIN}}"
CANONICAL_DOMAIN="${DOMAIN#www.}"
WWW_DOMAIN="www.${CANONICAL_DOMAIN}"

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

if [[ ! -f "${ENV_FILE}" ]]; then
  cp "${ENV_EXAMPLE_FILE}" "${ENV_FILE}"
  echo "Created ${ENV_FILE} from .env.example. Please set token and retry." >&2
  exit 1
fi

set -a
source "${ENV_FILE}"
set +a

CF_TOKEN="${CLOUDFLARE_WEB_ANALYTICS_TOKEN:-}"
if [[ -z "${CF_TOKEN}" || "${CF_TOKEN}" == "REPLACE_WITH_CF_WEB_ANALYTICS_TOKEN" ]]; then
  echo "Please set CLOUDFLARE_WEB_ANALYTICS_TOKEN in ${ENV_FILE} before deploy." >&2
  exit 1
fi

STAGE_DIR="$(mktemp -d)"
trap 'rm -rf "${STAGE_DIR}"' EXIT

echo "Preparing static site files..."
rsync -av --delete \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='docs' \
  --exclude='.env' \
  --exclude='.env.example' \
  "${PROJECT_DIR}/" "${STAGE_DIR}/"

# Inject Cloudflare analytics token into the staged artifact.
perl -0777 -i -pe "s/REPLACE_WITH_CF_WEB_ANALYTICS_TOKEN/${CF_TOKEN}/g" "${STAGE_DIR}/index.html"

echo "Uploading files to ${VPS_USER}@${VPS_HOST}:${REMOTE_SITE_DIR} ..."
ssh "${VPS_USER}@${VPS_HOST}" "mkdir -p '${REMOTE_SITE_DIR}'"
rsync -avz --delete "${STAGE_DIR}/" "${VPS_USER}@${VPS_HOST}:${REMOTE_SITE_DIR}/"

NGINX_CONF="${STAGE_DIR}/${DOMAIN}.conf"
cat > "${NGINX_CONF}" <<CONF
server {
    listen 80;
    server_name ${CANONICAL_DOMAIN} ${WWW_DOMAIN};
    return 301 https://${CANONICAL_DOMAIN}\$request_uri;
}

server {
    listen 443 ssl;
    server_name ${WWW_DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${CERT_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${CERT_NAME}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://${CANONICAL_DOMAIN}\$request_uri;
}

server {
    listen 443 ssl;
    server_name ${CANONICAL_DOMAIN};

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

echo "Done. Site deployed to: https://${CANONICAL_DOMAIN}/"

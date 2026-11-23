#!/usr/bin/env bash
# Deploy frontend MySMK ke server via DOCKER, tanpa GitHub:
#   laptop: lint -> kirim kode sumber (rsync) -> server: docker compose up -d --build
#
# Pemakaian (dari folder react-mysmk-fe):
#   DEPLOY_HOST=smkmadinatulquran.sch.id DEPLOY_USER=rehan DEPLOY_PATH=/home/rehan/react-mysmk-fe ./scripts/deploy.sh
# atau simpan nilainya di scripts/deploy.env (tidak di-commit), lalu cukup: ./scripts/deploy.sh
#
# Catatan:
#  - .env di SERVER tidak ditimpa: isinya alamat API produksi (REACT_APP_API_URL=https://...).
#    .env di laptop (localhost) tidak ikut dikirim.
#  - Image dibangun di server dari Dockerfile + docker-compose.yml di folder ini.
set -euo pipefail

cd "$(dirname "$0")/.."
[ -f scripts/deploy.env ] && . scripts/deploy.env

: "${DEPLOY_HOST:?isi DEPLOY_HOST (mis. smkmadinatulquran.sch.id)}"
: "${DEPLOY_USER:?isi DEPLOY_USER (user SSH di server)}"
: "${DEPLOY_PATH:?isi DEPLOY_PATH (folder proyek frontend di server, mis. /home/rehan/react-mysmk-fe)}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"

# pengaman: rsync --delete tidak boleh diarahkan ke folder sistem / home langsung
case "${DEPLOY_PATH%/}" in
  ""|/|/home|/home/*[!/]*/|/var|/var/www|/root|/etc*|/usr*|/bin*|/opt|/srv)
    echo "DEPLOY_PATH '$DEPLOY_PATH' tidak aman" >&2; exit 1;;
esac
[ "$(basename "${DEPLOY_PATH%/}")" = "$DEPLOY_USER" ] && { echo "DEPLOY_PATH tidak boleh folder home user" >&2; exit 1; }

SSH="ssh -p $DEPLOY_PORT"
REMOTE="$DEPLOY_USER@$DEPLOY_HOST"
SHA="$(git rev-parse HEAD 2>/dev/null || echo local)"

echo "==> 1/4 Lint di laptop"
npx eslint src --ext .js,.jsx --max-warnings=0

echo "==> 2/4 Cek server"
$SSH "$REMOTE" "mkdir -p '$DEPLOY_PATH' && docker compose version >/dev/null" \
  || { echo "Docker Compose tidak tersedia di server / user tidak boleh menjalankan docker" >&2; exit 1; }
if ! $SSH "$REMOTE" "test -f '$DEPLOY_PATH/.env'"; then
  echo "File $DEPLOY_PATH/.env belum ada di server." >&2
  echo "Buat dulu di server berisi alamat produksi, contoh:" >&2
  echo "  REACT_APP_API_URL=https://api.mysmk.smkmadinatulquran.sch.id/" >&2
  exit 1
fi

echo "==> 3/4 Kirim kode ke $REMOTE:$DEPLOY_PATH"
rsync -az --delete -e "$SSH" \
  --exclude node_modules --exclude build --exclude .git --exclude .github \
  --exclude .env --exclude '.env.*' --exclude scripts/deploy.env --exclude .DS_Store \
  ./ "$REMOTE:${DEPLOY_PATH%/}/"

echo "==> 4/4 Build & jalankan container di server"
$SSH "$REMOTE" "cd '$DEPLOY_PATH' && GITHUB_SHA='$SHA' docker compose up -d --build --remove-orphans && docker image prune -f >/dev/null && docker compose ps"

echo
echo "Selesai. Pengguna yang sedang membuka aplikasi akan melihat banner 'Versi baru tersedia'."

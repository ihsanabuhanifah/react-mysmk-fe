# ---------- Tahap 1: build React ----------
FROM node:18-bookworm-slim AS build
WORKDIR /app

# commit yang di-build (ditampilkan sebagai "Versi 1.0.0 (abc1234)" di aplikasi)
ARG GITHUB_SHA=local
ENV GITHUB_SHA=$GITHUB_SHA \
    CI=false

COPY package*.json ./
RUN npm ci

COPY . .
# REACT_APP_* dibaca dari .env saat build (nilainya memang publik di bundle JS).
# .env hanya ada di tahap build ini; image akhir hanya berisi file statis.
RUN test -f .env || (echo "ERROR: file .env tidak ada di folder frontend" && exit 1)
RUN npm run build

# ---------- Tahap 2: sajikan dengan Apache ----------
FROM httpd:2.4-alpine

# Aktifkan modul yang dipakai public/.htaccess dan izinkan .htaccess di folder web
RUN sed -i \
      -e 's/^#\(LoadModule rewrite_module\)/\1/' \
      -e 's/^#\(LoadModule headers_module\)/\1/' \
      -e 's/^#\(LoadModule deflate_module\)/\1/' \
      -e 's/^#\(LoadModule filter_module\)/\1/' \
      -e 's/^#ServerName .*/ServerName localhost/' \
      /usr/local/apache2/conf/httpd.conf \
 && printf '\n<Directory "/usr/local/apache2/htdocs">\n    AllowOverride All\n    Options -Indexes\n    Require all granted\n</Directory>\n' \
      >> /usr/local/apache2/conf/httpd.conf \
 && rm -rf /usr/local/apache2/htdocs/*

# Termasuk file tersembunyi (.htaccess)
COPY --from=build /app/build/ /usr/local/apache2/htdocs/

EXPOSE 80

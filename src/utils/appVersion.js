/* global __APP_VERSION__, __BUILD_ID__ */
// Versi aplikasi (dari package.json) + ID build, disisipkan saat build oleh craco.config.js.
// Naikkan versi dengan: npm version patch|minor|major --no-git-tag-version

export const APP_VERSION = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev";
export const BUILD_ID = typeof __BUILD_ID__ !== "undefined" ? __BUILD_ID__ : null;

/** Kode build singkat, mis. "a1b2c3d" (commit) atau "lokal". */
export const BUILD_LABEL = (() => {
  if (!BUILD_ID) return "dev";
  const [sha] = BUILD_ID.split("-");
  return sha === "local" ? "lokal" : sha;
})();

/** Teks siap tampil: "Versi 1.0.0 (a1b2c3d)" */
export const VERSION_TEXT = `Versi ${APP_VERSION} (${BUILD_LABEL})`;

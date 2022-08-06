export function encodeURlFormat(nama) {
  if (nama === undefined) {
    return "";
  }
  if (nama === null) {
    return "";
  }
  return encodeURIComponent(nama);
}

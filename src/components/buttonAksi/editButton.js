/* eslint-disable no-unused-vars */
import { Button } from "semantic-ui-react";

/**
 * Tombol aksi tabel yang seragam di seluruh aplikasi:
 * tombol kecil, bergaris (basic), ikon berwarna, dengan tooltip.
 *
 * Contoh: <AksiButton icon="history" color="grey" title="Riwayat" onClick={...} />
 * (prop `size` lama diabaikan agar ukuran selalu konsisten)
 */
export function AksiButton({ onClick, disabled, icon, color, title, className }) {
  return (
    <Button
      type="button"
      size="mini"
      basic
      icon={icon}
      color={color}
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={className}
    />
  );
}

export function EditButton({ onClick, disabled, title = "Edit", className }) {
  return <AksiButton {...{ onClick, disabled, title, className }} icon="edit" color="teal" />;
}

export function CopyButton({ onClick, disabled, title = "Salin", className }) {
  return <AksiButton {...{ onClick, disabled, title, className }} icon="copy" color="teal" />;
}

export function AddButton({ onClick, disabled, title = "Tambah", className }) {
  return <AksiButton {...{ onClick, disabled, title, className }} icon="add" color="teal" />;
}

export function DeleteButton({ onClick, disabled, title = "Hapus", className }) {
  return <AksiButton {...{ onClick, disabled, title, className }} icon="trash alternate" color="red" />;
}

export function ViewButton({ onClick, disabled, title = "Lihat", className }) {
  return <AksiButton {...{ onClick, disabled, title, className }} icon="eye" color="blue" />;
}

export function BackButton({ onClick, disabled, title = "Kembali", className }) {
  return <AksiButton {...{ onClick, disabled, title, className }} icon="arrow left" color="blue" />;
}

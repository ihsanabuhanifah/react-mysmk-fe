import React from "react";
import { Table } from "semantic-ui-react";
import { MdInbox } from "react-icons/md";

const SKELETON_ROWS = 5;
const WIDTHS = ["70%", "90%", "55%", "80%", "65%"];

export function TableLoading({
  children,
  isLoading,
  data,
  count,
  messageEmpty,
}) {
  const cols = Math.max(Number(count) || 1, 1);

  if (isLoading) {
    return (
      <React.Fragment>
        {Array.from({ length: SKELETON_ROWS }).map((_, r) => (
          <Table.Row key={`skeleton-${r}`}>
            {Array.from({ length: cols }).map((__, c) => (
              <Table.Cell key={c}>
                <div
                  className="tbl-skeleton"
                  style={{ width: WIDTHS[(r + c) % WIDTHS.length] }}
                />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </React.Fragment>
    );
  }

  // Tampilkan "kosong" hanya bila data benar-benar array kosong.
  // Jika data tidak dikirim (undefined), tetap render children seperti perilaku lama.
  if (Array.isArray(data) && data.length === 0) {
    return (
      <Table.Row>
        <Table.Cell colSpan={cols} textAlign="center">
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
            <MdInbox className="h-10 w-10" />
            <span className="text-sm font-medium text-gray-500">
              {messageEmpty || "Belum ada data"}
            </span>
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
}

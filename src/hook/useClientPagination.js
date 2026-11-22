import React from "react";

/**
 * Paginasi di sisi browser untuk data yang dikirim utuh oleh API (tanpa limit/offset).
 * Dipakai bersama <PaginationTable />:
 *
 *   const pg = useClientPagination(data?.data);
 *   pg.items.map(...)  // baris halaman aktif
 *   <PaginationTable {...pg.paginationProps} />
 *
 * nomor(i) -> nomor urut global baris ke-i pada halaman aktif.
 */
export default function useClientPagination(list, initialPageSize = 10) {
  const all = React.useMemo(() => (Array.isArray(list) ? list : []), [list]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const totalPages = Math.max(Math.ceil(all.length / pageSize), 1);

  // Bila data berkurang (mis. setelah hapus/filter), jangan tertinggal di halaman kosong
  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const items = React.useMemo(
    () => all.slice((page - 1) * pageSize, page * pageSize),
    [all, page, pageSize]
  );

  return {
    items,
    page,
    pageSize,
    setPage,
    setPageSize,
    total: all.length,
    nomor: (i) => (page - 1) * pageSize + i + 1,
    paginationProps: {
      page,
      pageSize,
      setPage,
      setPageSize,
      totalPages: all.length,
    },
  };
}

import { Select, Pagination, Icon } from "semantic-ui-react";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 250, 1000].map((v) => ({
  key: v,
  value: v,
  text: `${v} / halaman`,
}));

export default function PaginationTable({
  page,
  pageSize,
  setPage,
  setPageSize,
  totalPages, // sebenarnya total data (angka) atau array hasil group count
  count,
}) {
  let total = 0;
  if (Array.isArray(totalPages)) {
    totalPages.forEach((item) => {
      total += Number(item?.count) || 0;
    });
  } else {
    total = Number(totalPages ?? count) || 0;
  }

  const size = Number(pageSize) || 10;
  const current = Number(page) || 1;
  const pages = Math.max(Math.ceil(total / size), 1);
  const from = total === 0 ? 0 : (current - 1) * size + 1;
  const to = Math.min(current * size, total);

  return (
    <div className="mt-3 flex flex-col gap-3 py-2 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <Select
          compact
          value={size}
          options={PAGE_SIZE_OPTIONS}
          onChange={(e, value) => {
            setPageSize(value.value);
            setPage?.(1);
          }}
        />
        <span>
          Menampilkan <b className="text-gray-800">{from}–{to}</b> dari{" "}
          <b className="text-gray-800">{total}</b> data
        </span>
      </div>
      <div className="overflow-x-auto">
        <Pagination
          size="small"
          activePage={current}
          onPageChange={(e, value) => {
            setPage(value.activePage);
          }}
          ellipsisItem={null}
          firstItem={{ content: <Icon name="angle double left" />, icon: true }}
          lastItem={{ content: <Icon name="angle double right" />, icon: true }}
          prevItem={{ content: <Icon name="angle left" />, icon: true }}
          nextItem={{ content: <Icon name="angle right" />, icon: true }}
          totalPages={pages}
        />
      </div>
    </div>
  );
}

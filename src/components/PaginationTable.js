
import { Select, Pagination, Icon } from "semantic-ui-react";
export default function PaginationTable({
  page,
  pageSize,
  setPage,
  setPageSize,
  totalPages,
  count
}) {
  let total = 0;

  if (typeof totalPages === "object") {
    totalPages?.map((item) => {
      total = total + item.count;
    });
  } else {
    total = totalPages;
  }
  return (
    <div className="grid w-full grid-cols-1 items-center justify-between gap-5 overflow-x-auto py-2 md:flex lg:flex lg:overflow-visible xl:flex xl:overflow-visible 2xl:overflow-visible">
      <div className="flex items-center space-x-2">
        <Select
          onChange={(e, value) => {
            setPageSize(value.value);
          }}
          compact
          value={pageSize}
          placeholder="Select Page"
          options={[
            { key: 1, value: 10, text: 10  },
            { key: 2, value: 25, text: 25 },
            { key: 3, value: 50, text: 50 },
            { key: 4, value: 100, text: 100 },
            { key: 5, value: 250, text: 250 },
            { key: 6, value: 1000, text: 1000 },
          ]}
        />

        <p>
          Menampilkan {count < pageSize ? count : pageSize} dari {count} data
        </p>
      </div>
      <div className="">
        <Pagination
          compact
          onPageChange={(e, value) => {
            setPage(value.activePage);
          }}
          defaultActivePage={page}
          ellipsisItem={null}
          firstItem={{
            content: <Icon name="angle double left" />,
            icon: true,
          }} 
          lastItem={{
            content: <Icon name="angle double right" />,
            icon: true,
          }}
          prevItem={{ content: <Icon name="angle left" />, icon: true }}
          nextItem={{ content: <Icon name="angle right" />, icon: true }}
          totalPages={Math.ceil(total / pageSize)}
        />
      </div>
    </div>
  );
}

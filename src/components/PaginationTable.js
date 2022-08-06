import { Select, Pagination, Icon } from "semantic-ui-react";
export default function PaginationTable({
  page,
  pageSize,
  setPage,
  setPageSize,
  totalPages,
}) {
  return (
    <div className="xl:flex lg:flex grid grid-cols-1 gap-5 items-center justify-between  w-full overflow-x-auto py-2  ">
      <div className="">
        <Select
          onChange={(e, value) => {
            console.log(value);
            setPageSize(value.value);
          }}
          compact
          value={pageSize}
          placeholder="Select Page"
          options={[
            { key: 1, value: 10, text: 10 },
            { key: 2, value: 25, text: 25 },
            { key: 3, value: 50, text: 50 },
            { key: 4, value: 100, text: 100 },
            { key: 5, value: 250, text: 250 },
            { key: 6, value: 1000, text: 1000 },
          ]}
        />
      </div>
      <div className="">
        <Pagination
        compact
          onPageChange={(e, value) => {
            console.log(value);

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
          totalPages={Math.ceil(totalPages / pageSize)}
        />
      </div>
    </div>
  );
}

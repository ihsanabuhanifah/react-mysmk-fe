import React from "react";
import { Dropdown, Pagination as SemanticPagination } from "semantic-ui-react";

const Pagination = ({ handlePageSize, handlePage, pagination, page, pageSize }) => {
  function getPage(totalItems, currentPage, pageSize) {
    currentPage = currentPage;

    pageSize = pageSize;

    let totalPages = Math.ceil(totalItems / pageSize);

    let startPage, endPage;
    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    const pages = Array.from({ length: endPage + 1 - startPage }, (_, i) => startPage + i);

    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      pages: pages,
    };
  }

  let pages = getPage(
    pagination?.total || 0,
    pagination?.page || 1,
    pagination?.pageSize || 10
  );

  const pageOptions = [
    { key: 1, value: 1, text: "1" },
    { key: 5, value: 5, text: "5" },
    { key: 10, value: 10, text: "10" },
    { key: 25, value: 25, text: "25" },
    { key: 50, value: 50, text: "50" },
    { key: 100, value: 100, text: "100" },
  ];

  return (
    <div className="flex items-center justify-between mt-6">
      <div>
        <Dropdown
          placeholder="Page Size"
          selection
          options={pageOptions}
          value={pageSize}
          onChange={(e, { value }) =>{
            console.log(e)
            console.log(e.target.value)
            console.log(value)
            handlePageSize(value)
          }}
        />
        <p className="pt-2">dari {pagination?.total} data</p>
      </div>

      <div>
        <SemanticPagination
          activePage={page}
          totalPages={pages.totalPages}
          onPageChange={(e, { activePage }) => {
            console.log(activePage)
            handlePage(activePage)
          }}
        />
      </div>
    </div>
  );
};

export default Pagination;
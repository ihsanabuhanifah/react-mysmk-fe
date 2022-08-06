import React from "react";

export default function usePage() {
  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);

  return { page, pageSize, setPage, setPageSize };
}

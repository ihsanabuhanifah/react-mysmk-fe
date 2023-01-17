import React from "react";

export default function usePage() {
  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [keyword, setKeyword] = React.useState("")

  return { page, pageSize, setPage, setPageSize, keyword, setKeyword };
}

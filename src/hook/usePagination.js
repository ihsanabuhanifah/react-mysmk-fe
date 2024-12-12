import { useEffect, useState } from "react";

export const usePagination = (defaultParams) => {
  let [params, setParams] = useState(defaultParams);
  let [keyword, setKeyword] = useState("");
  let [filterParams, setFilterParams] = useState(defaultParams);

  const handleFilter = () => {
    setFilterParams({ ...params, page: 1 });
    setParams((prev) => {
      return {
        ...prev,
        page: 1,
      };
    });
  };

  const handleKeyword = (keyword) => {
    setFilterParams({ ...params, keyword: keyword, page: 1 });
  };

  const handleSearch = (e) => {
    setKeyword(e.target.value);
  };
  useEffect(() => {
    const interval = setTimeout(() => {
      handleKeyword(keyword);
    }, 500);

    return () => clearTimeout(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const handleClear = () => {
    setFilterParams(defaultParams);
    setParams(defaultParams);
  };

  const handlePageSize = (e) => {
    console.log(e, "ddada");
    // console.log()
    setParams((params) => ({ ...params, pageSize: e, page: 1 }));
    setFilterParams((params) => ({
      ...params,
      pageSize: e,
      page: 1,
    }));
  };

  const handlePage = (page) => {
    setParams((params) => ({ ...params, page: page }));
    setFilterParams((params) => ({ ...params, page: page }));
  };

  const handlePayload = (nama, value) => {
    setParams((pay) => {
      return {
        ...pay,
        [nama]: value,
      };
    });
  };

  return {
    params,
    keyword,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handleSearch,
    handlePayload,
  };
};

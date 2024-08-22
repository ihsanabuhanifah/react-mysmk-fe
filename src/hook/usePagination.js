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
  const handleTagFilter = (tag) => {
    setFilterParams({ ...params, page: 1, tagId: tag });
    setParams((prev) => {
      return {
        ...prev,
        page: 1,
        tagId: tag,
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
    console.log(e, "ddada")
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
  };
};

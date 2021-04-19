import React from "react";

import "antd/dist/antd.css";
import { Pagination } from "antd";

function PaginationBar({
  isLoading,
  movies,
  totalResults,
  currentPage,
  onChangePage,
}) {
  if (!isLoading && movies.length <= 19) {
    return null;
  }
  return (
    <div className="position-center">
      <Pagination
        size="small"
        total={totalResults}
        pageSize={20}
        pageSizeOptions={[20]}
        onChange={onChangePage}
        current={currentPage}
      />
    </div>
  );
}

export default PaginationBar;

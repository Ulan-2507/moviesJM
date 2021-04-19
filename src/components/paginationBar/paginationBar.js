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
  if (!isLoading && movies.length >= 20) {
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
  return null;
}

export default PaginationBar;

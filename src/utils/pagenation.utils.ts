export const getPagination = (
  page: number,
  limit: number,
  totalCount: number
) => {
  const totalPage = Math.ceil(totalCount / limit);
  return {
    total: totalCount,
    totalPage,
    currentPage: page,
    previousPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPage ? page + 1 : null,
    hasNextPage: page < totalPage ? true : false,
  };
};

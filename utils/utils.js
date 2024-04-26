export const paginate = (totalCount, page = 1, pageSize = 10) => {
	const totalPages = Math.ceil(totalCount / pageSize);
	const nextPage = page < totalPages ? page + 1 : null;
	const prevPage = page > 1 ? page - 1 : null;

	return {
      totalCount,
      page,
		totalPages,
      nextPage,
      prevPage
	};
};

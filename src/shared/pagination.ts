export interface PaginationType {
  page: number;
  limit: number;
  totalItems: number;
  totalPage?: number;
  baseURL: string;
  prev?: string;
  next?: string;
}

const Pagination = (page = 1, limit = 10, totalItems = 0, baseURL = '') => {
  const totalPage = Math.ceil(totalItems / limit) || 1;

  const pagination: PaginationType = {
    page: page,
    limit: limit,
    totalPage,
    totalItems,
    baseURL
  };

  if (page > 1) {
    pagination.prev = `/${baseURL}/${page - 1}`;
  }
  if (page < totalPage) {
    pagination.next = `/${baseURL}/${page + 1}`;
  }

  return pagination
}

export {Pagination}
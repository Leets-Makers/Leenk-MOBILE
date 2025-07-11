export interface Pageable {
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  hasNext: boolean;
  empty: boolean;
}

export interface PageableResponse<T> {
  data: T[];
  pageable: Pageable;
}

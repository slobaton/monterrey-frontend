export class PaginatedResponse<TEntity> {
  constructor(
    public data: Array<TEntity>,
    public meta: PaginatedResponseMetadata
  ) { }
}

type PaginatedResponseMetadata = {
  current_page: number,
  from: number,
  last_page: number,
  per_page: number,
  to: number,
  total: number
}

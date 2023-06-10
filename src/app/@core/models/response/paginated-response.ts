export class PaginatedResponse<TEntity> {
  constructor(
    public data: Array<TEntity>,
    public totalCount: number,
    public pages: number,
    public currentPage: number
  ) { }
}

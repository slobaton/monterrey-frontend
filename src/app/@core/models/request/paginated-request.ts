export class PaginatedRequest {
  constructor(
    public filter: string,
    public page: number,
    public pageSize: number,
    public sort: string,
    public sortOrder: string
  ) { }
}

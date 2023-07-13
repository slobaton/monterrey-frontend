export class BaseResponse<TEntity> {
  constructor(
    public data: TEntity,
    public status: string
  ) { }
}

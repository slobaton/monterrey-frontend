import { PaginatedRequest } from "../../models/request/paginated-request";
import { PaginatedResponse } from "../../models/response/paginated-response";

export interface IFetchPaginatedData<TEntity> {
  fetchPaginatedResource(request: PaginatedRequest): Promise<PaginatedResponse<TEntity>>
}

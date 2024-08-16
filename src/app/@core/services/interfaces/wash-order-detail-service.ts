import { WashOrderDetailCreateRequest } from "../../models/request/wash-order-detail-create-request";
import { WashOrderDetailUpdateRequest } from "../../models/request/wash-order-detail-update-request";
import { WashOrderDetail } from "../../models/wash-order";

export interface IWashOrderDetailService {
  create(request: WashOrderDetailCreateRequest): Promise<WashOrderDetail>
  update(id: string, request: WashOrderDetailUpdateRequest): Promise<WashOrderDetail>
  deleteById(id: string): Promise<void>;
}

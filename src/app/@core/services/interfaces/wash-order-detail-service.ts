import { WashOrderDetailCreateRequest } from "../../models/request/wash-order-detail-create-request";
import { WashOrderDetail } from "../../models/wash-order";

export interface IWashOrderDetailService {
  create(request: WashOrderDetailCreateRequest): Promise<WashOrderDetail>
  deleteById(id: string): Promise<void>;
}

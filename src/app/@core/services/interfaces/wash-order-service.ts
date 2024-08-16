import { WashOrderCreateRequest } from "../../models/request/wash-order-create-request";
import { WashOrderUpdateRequest } from "../../models/request/wash-order-update-request";
import { WashOrder } from "../../models/wash-order";

export interface IWashOrderService {
  create(request: WashOrderCreateRequest): Promise<WashOrder>
  update(request: WashOrderUpdateRequest, id: string): Promise<WashOrder>
  deleteById(id: string): Promise<void>
  getById(id: string): Promise<WashOrder>
  approveById(id: string): Promise<WashOrder>
}

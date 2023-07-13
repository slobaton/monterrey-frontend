import { WashOrderCreateRequest } from "../../models/request/wash-order-create-request";
import { WashOrder } from "../../models/wash-order";

export interface IWashOrderService {
  create(request: WashOrderCreateRequest): Promise<WashOrder>
}

import { OrderStatus } from "../enums/order-status.enum";
import { Client } from "./client";
import { ClothSize } from "./cloth-size";
import { ClothType } from "./cloth-type";
import { Effect } from "./effect";
import { WashType } from "./wash-type";

export class WashOrder {
  constructor(
    public id: string,
    public client_id: string,
    public wash_type_id: number,
    public code: number,
    public date: string,
    public total_quantity: number,
    public total_price: number,
    public status: OrderStatus,
    public deliver_date: string,
    public deliver_quantity: number,
    public observations: string,
    public is_special_price: boolean,
    public created_at: string,
    public updated_at: string,
    public details: Array<WashOrderDetail>,
    public client: Client,
    public wash_type: WashType
  ) { }

  public getStatusFriendlyName(): string {
    return WashOrder.getStatusFriendlyName(this.status);
  }

  public static getStatusFriendlyName(status: OrderStatus): string {
    let statusLabel = 'Nuevo';

    switch (status) {
      case OrderStatus.CREATED: statusLabel = 'Creado';
        break;
      case OrderStatus.APPROVED: statusLabel = 'Aprobado';
        break;
      case OrderStatus.DELIVERED: statusLabel = 'Entregado';
        break;
    }

    return statusLabel;
  }
}

export class WashOrderDetail {
  constructor(
    public id: string,
    public wash_order_id: string,
    public cloth_type_id: number,
    public cloth_size_id: number,
    public effects: Array<Effect>,
    public wash_price: number,
    public effect_price: number,
    public is_focalizado_active: boolean,
    public focalizado_price: number,
    public is_nevado_active: boolean,
    public nevado_price: number,
    public num_buttonholes: number,
    public buttonholes_price: number,
    public cloth_type: ClothType,
    public cloth_size: ClothSize,
    public unit_price: number,
    public quantity: number,
    public subtotal_price: number,
    public observations?: string,
  ) { }
}

export class WashOrderDetailEffect {
  constructor(
    public id: number,
    public wash_order_detail_id: string,
    public effect_id: number,
    public price: number,
  ) { }
}

export class GeneralCountReport {
  constructor(
    public clients: GenericCountReport,
    public orders: OrderGeneralCountReport,
    public effects: GenericCountReport,
    public wash_types: GenericCountReport
  ) { }
}

class GenericCountReport {
  constructor(
    public active: number,
    public inactive: number
  ) { }
}

class OrderGeneralCountReport {
  constructor(
    public count: number,
    public revenue: number
  ) { }
}

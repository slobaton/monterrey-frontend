export class ParameterValue {
  constructor(
    public id: number,
    public name: string,
    public value: number,
    public description: string,
    public is_active: boolean,
    public created_at: string,
    public updated_at: string,
    public parameter_value: ParameterValueDetail
  ) { }
}

export class ParameterValueDetail {
  constructor(
    public client_id: string,
    public system_parameter_id: number,
    public id: number,
    public value: number
  ) { }
}

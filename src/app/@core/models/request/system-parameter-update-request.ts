export class SystemParameterUpdateRequest {
  constructor(
    public name: string,
    public description: string,
    public value: number
  ) { }
}

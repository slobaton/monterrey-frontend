export class EffectUpsertRequest {
    constructor(
      public name: string,
      public description?: string,
      public price?: number,
      public is_active?: boolean,
      public id?: string,
    ) { }
  }

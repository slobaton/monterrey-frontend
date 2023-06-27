export class Effect {
    constructor(
      public id: string,
      public name: string,
      public price: number,
      public description: string,
      public is_active: boolean,
      public created_at: string,
      public updated_at: string
    ) { }
  }

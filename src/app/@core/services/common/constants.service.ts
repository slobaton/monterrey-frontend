import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  public get dayNames(): string[] {
    return ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  }

  public get dayNamesShort(): string[] {
    return ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'];
  }

  public get dayNamesMin(): string[] {
    return ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  }

  public get monthNames(): string[] {
    return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  }

  public get mothNamesShort(): string[] {
    return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  }
}

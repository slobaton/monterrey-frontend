import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public readonly currentTimeZone: string = 'America/La_Paz';

  constructor() { }

  public getCurrentDate(): Date {
    const date = DateTime.now().setZone(this.currentTimeZone);

    return date.toJSDate();
  }

  public getDateFromString(dateString: string): Date {
    const date = DateTime.fromISO(dateString, { zone: this.currentTimeZone })

    return date.toJSDate();
  }

  public getOnlyDateString(date: Date): string {
    const currentDate = DateTime.fromJSDate(date, { zone: this.currentTimeZone });

    return currentDate.toISODate() ?? '';
  }
}

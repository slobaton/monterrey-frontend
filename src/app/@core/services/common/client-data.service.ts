import { Injectable } from '@angular/core';
import {Client} from "../../models/client";

@Injectable({
  providedIn: 'root'
})
export class ClientDataService {

  private data: Client | undefined;

  setData(data: Client) {
    this.data = data;
  }

  getData() {
    return this.data;
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {

  products = [
    {
      code: '001',
      name: 'product1',
      price: 25,
      quantity: 10
    },
    {
      code: '002',
      name: 'product2',
      price: 35,
      quantity: 5
    },
    {
      code: '003',
      name: 'product3',
      price: 15,
      quantity: 2
    },
    {
      code: '004',
      name: 'product4',
      price: 55,
      quantity: 0
    },
  ];

}

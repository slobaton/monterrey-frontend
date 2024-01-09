import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavigationService } from 'src/app/@core/services/common/navigation.service';

@Component({
  selector: 'app-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['./page-card.component.scss']
})
export class PageCardComponent {

  @Input() title: string = '';

  menuItems: MenuItem[] = [
    {
      label: 'Volver',
      icon: 'pi pi-arrow-left',
      command: () => this._navigationService.back()
    }
  ];

  constructor(private _navigationService: NavigationService) { }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  @Input() id: string = '';
  @Input() title?: string;
  @Input() message?: string;
  @Input() icon: string = 'pi pi-exclamation-triangle'
}

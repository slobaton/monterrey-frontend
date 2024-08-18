import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { DataTableConfiguration } from 'src/app/@core/types/data-table-definition';
import { IFetchPaginatedData } from 'src/app/@core/services/interfaces/fetch-paginated-data';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-input-search',
  templateUrl: './form-input-search.component.html',
  styleUrls: ['./form-input-search.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class FormInputSearchComponent<TEntity> implements OnInit {
  @Input() form!: FormGroup;
  @Input() id: string = '';
  @Input() controlName: string = '';
  @Input() placeholder: string = '';

  @Input() title: string = 'Seleccionar...';
  @Input() tableConfig!: DataTableConfiguration;
  @Input() service!: IFetchPaginatedData<TEntity>;

  @Input() selectionProp: string = '';
  @Input() selectedLabelFn?: (selectedValue: any) => string;

  @Input() hasCustomAction?: boolean = false;
  @Input() customActionIcon?: string;
  @Output() onClickCustomAction: EventEmitter<void> = new EventEmitter<void>();

  @Input() onSelect: EventEmitter<any> = new EventEmitter<any>();

  @Input() confirmExistingReplace: boolean = false;
  @Input() confirmMessage: string = '';
  @Input() replacedMessage: string = '';

  selectedLabel: string = '';

  overlayOpened: boolean = false;

  ref: DynamicDialogRef | undefined;

  constructor(
    private _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  public get formControl() {
    return this.form.get(this.controlName);
  }

  public get hasValue() {
    return this.formControl?.valid ?? false;
  }

  public get getCustomActionIcon() {
    const icon = this.customActionIcon ?? 'pi-plus'

    return `pi ${icon}`;
  }

  ngOnInit(): void {
    this.onSelect.subscribe((selectedValue) => this.onSelectValue(selectedValue));
  }

  openSearchOverlay(): void {
    if (this.overlayOpened) return;

    this.overlayOpened = true;

    const dialogProps = {
      header: this.title,
      data: {
        service: this.service,
        tableConfig: this.tableConfig,
        onSelectEvent: this.onSelect
      }
    };

    this.ref = this._dialogService.open(SearchOverlayComponent, dialogProps);

    this.ref.onClose.subscribe((selected) => {
      this.overlayOpened = false;

      if (!selected && !this.hasValue) {
        this.formControl?.markAsDirty();
        this.formControl?.markAsTouched();
      }
    });
  }

  resetValue(): void {
    this.formControl?.reset();
    this.selectedLabel = '';

    this.formControl?.markAsDirty();
    this.formControl?.markAsTouched();
  }

  executeCustomAction() {
    this.onClickCustomAction.emit();
  }

  private onSelectValue(selectedValue: any): void {
    const defaultProp = 'id';
    const selectionProp = this.selectionProp ?? defaultProp;

    const shouldReplaceValue = !this.formControl?.value || this.formControl?.value === selectedValue[selectionProp];

    if (!this.confirmExistingReplace || shouldReplaceValue) {
      this.setFormInputValue(selectedValue, selectionProp);

      return;
    }

    this._confirmationService.confirm({
      key: 'confirm-replace',
      message: this.confirmMessage ?? 'Se esta cambiando el valor de un registro previamente seleccionado, ¿desea proceder?',
      header: 'Importante',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._messageService.add({
          key: 'confirm-replace',
          severity: 'success',
          summary: 'Valor remplazado con éxito.',
          detail: this.replacedMessage ?? 'El valor ha sido actualizado.'
        });

        this.setFormInputValue(selectedValue, selectionProp);
      },
      reject: () => {
        this._messageService.add({
          key: 'confirm-replace',
          severity: 'warn',
          summary: 'Operación cancelada.',
          detail: 'La acción fue revertida con éxito.'
        });
      }
    })
  }

  private setFormInputValue(selectedValue: any, selectionProp: string): void {
    this.formControl?.setValue(selectedValue[selectionProp]);
    this.selectedLabel = this.selectedLabelFn?.call(this, selectedValue) ?? selectedValue[selectionProp];
  }
}

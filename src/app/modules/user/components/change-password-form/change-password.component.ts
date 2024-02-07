import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { UserService } from 'src/app/@core/services/rest/user.service';
import { passwordMatchValidator } from 'src/app/shared/validators/password-match-validator';
import { AuthService } from "src/app/@core/services/rest/auth.service";
import { ErrorHandlerService } from 'src/app/@core/services/common/error-handler.service';
import { UserUpdatePassword } from "src/app/@core/models/request/user-update-password-request";
import { Router } from '@angular/router';

@Component({
  selector: 'app-upsert-user',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  updatePasswordForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private _userService: UserService,
    private _router: Router,
    private errorHandlerService: ErrorHandlerService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private _authService: AuthService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.updatePasswordForm = new FormGroup({
      current_password: new FormControl<string>('', [Validators.required]),
      new_password: new FormControl<string>( '', [Validators.required]),
      new_password_confirmation: new FormControl<string>( '', [Validators.required]),
    }, { validators: passwordMatchValidator('new_password', 'new_password_confirmation') });
  }

  onSubmitForm(passwordInformation: UserUpdatePassword): void {
    this.formProcessEvent.emit(true);

    this._userService.updatePassword(passwordInformation)
      .then((userUpdated) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualización realizada',
          detail: 'Contraseña actualizada con éxito'
        });
        this.ref.close(userUpdated);
        this._authService.logout()
          .then(() => {
            this._router.navigateByUrl('/auth/login');
          });
      })
      .catch(error => this.errorHandlerService.handleError(error, this.updatePasswordForm))
      .finally(() => this.formProcessEvent.emit(false));
  }
}

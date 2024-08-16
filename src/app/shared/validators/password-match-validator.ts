import { AbstractControl, ValidatorFn } from '@angular/forms';

// Factory function for the validator
export function passwordMatchValidator(field: string = 'password', confirmationField = 'password_confirmation'): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get(field)?.value; // Usando el parámetro 'field'
    const confirmPassword = control.get(confirmationField)?.value;

    //  Checking if the fields are equal
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  };
}

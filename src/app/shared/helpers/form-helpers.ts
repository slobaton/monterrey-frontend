import { ValidatorFn, AbstractControl } from '@angular/forms';

// Custom validation function to check if the password fields match
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('password_confirmation')?.value;

  // Checking if the fields are equal
  return password === confirmPassword ? null : { 'passwordMismatch': true };
};

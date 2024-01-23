import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minSelectedCheckboxes(min: number = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selected: number = control.value
      .map((v: boolean): number => (v ? 1 : 0))
      .reduce((prev: number, next: number) => prev + next, 0);

    return selected >= min ? null : { required: true };
  };
}

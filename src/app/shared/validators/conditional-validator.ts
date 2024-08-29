import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function conditionalValidator(
  predicate: () => boolean,
  validator: ValidatorFn
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }

    if (predicate()) {
      return validator(control);
    }

    return null;
  };
}

export function conditionalValidators(
  predicate: () => boolean,
  validators: ValidatorFn[]
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }

    if (predicate()) {
      const errors = validators
        .map(validator => validator(control))
        .reduce((acc, error) => {
          return error ? { ...acc, ...error } : acc;
        }, {});

      return errors && Object.keys(errors).length ? errors : null;
    }

    return null;
  };
}

import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validator that checks if the control's date value is in the past.
 *
 * @param {AbstractControl} control - The form control to validate
 * @returns {ValidationErrors | null} - Validation error if the date is not in the past, otherwise null
 */
export function pastDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateValue = value instanceof Date ? value : new Date(value as string | number);

  if (dateValue >= today) {
    return { pastDate: true };
  }

  return null;
}

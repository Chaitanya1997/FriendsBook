import { Directive, Input } from '@angular/core';
import { FormGroup, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[matchPasswords]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchValidatorDirective, multi: true }]
})

export class PasswordMatchValidatorDirective implements Validator {

  // Input name and selector name must be equal
  @Input('matchPasswords') MatchPassword: string[] = [];

  constructor() { }

  validate(formGroup: FormGroup): any {
    return this.matchPassword(this.MatchPassword[0], this.MatchPassword[1])(formGroup);
  }

  matchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
      return;
    }

  }

}


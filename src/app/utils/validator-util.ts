import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export default class ValidatorUtil {

  static matchPasswords(formGroup: FormGroup) {
    let password = formGroup.get('password').value;
    let confirmPassword = formGroup.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true } 
  }
}

export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.touched && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.touched && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
import { FormGroup } from '@angular/forms';

export default class ValidatorUtil {

  static matchPasswords(formGroup: FormGroup) {
    let password = formGroup.get('password').value;
    let confirmPassword = formGroup.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true } 
  }
}
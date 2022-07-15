import { AbstractControl, ValidatorFn } from '@angular/forms';


export  class CustomValidation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }
      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }

  static restrictZeroValue(controlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      if (control?.value =='0') {
        controls.get(controlName)?.setErrors({ response: true });
        return { response: true };
      } else {
        return null;
      }
    };
  }
}
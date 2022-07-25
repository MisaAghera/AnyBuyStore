import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserForRegistrationModel } from '../shared/models/user-for-registration-model.model';
import { UntypedFormControl, AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CustomValidation } from "../shared/providers/custom-validators";
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: UntypedFormGroup = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    gender: new UntypedFormControl(''),
    age: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
    confirmPassword: new UntypedFormControl(''),
    phoneNumber: new UntypedFormControl('')
  });

  submitted = false;
  constructor(private authService: AuthenticationService, private formBuilder: UntypedFormBuilder,private router:Router) { }

  ngOnInit(): void {
   

    this.registerForm = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        age: [''],
        gender: [''],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern("[0-9 ]{10}")
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [CustomValidation.match('password', 'confirmPassword')]
      }
    );

  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }


  registerUser = (registerFormValue: any) => {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    const formValues = { ...registerFormValue };
    var userForRegister: InModel = new InModel();
    userForRegister.In.username = formValues.username;
    userForRegister.In.password = formValues.password;
    userForRegister.In.confirmPassword = formValues.confirmPassword;
    userForRegister.In.email = formValues.email;
    userForRegister.In.phoneNumber = formValues.phoneNumber;

    if(formValues.age!='')
    userForRegister.In.age = formValues.age;
    if(formValues.gender!='' &&formValues.gender!=null )
      userForRegister.In.gender = formValues.gender;
    this.authService.registerUser(userForRegister)
      .subscribe({
        next: (_) => {alert("registered successfully"); this.router.navigate(["/login"])},
        error: (err: HttpErrorResponse) => console.log(err.error.errors)
      })
  }
  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }

}
class InModel {
  In: UserForRegistrationModel = new UserForRegistrationModel();
}



import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordChangeModel } from '../shared/models/password-change-model';
import { CustomValidation } from '../shared/providers/custom-validators';
import { AuthenticationService } from '../shared/services/authentication.service';
@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  submitted = false;
  returnUrl: string | undefined;

  ChangePasswordForm: FormGroup = new FormGroup({
    currentPassword: new FormControl(""),
    newPassword: new FormControl(""),
    confirmPassword: new FormControl('')
  });

  errorMessage: string = '';
  showError: boolean | undefined;

  constructor(private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.ChangePasswordForm = this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [CustomValidation.match('newPassword', 'confirmPassword')]
      }
    );
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ChangePasswordForm.controls;
  }

  onReset(): void {
    this.submitted = false;
    this.ChangePasswordForm.reset();
  }

  chanagePassword = (Value: any) => {
    this.submitted = true;
    if (this.ChangePasswordForm.invalid) {
      return;
    }
    const formValues = { ...Value };

    var PasswordChangeModel: InModel = new InModel();
    PasswordChangeModel.In.oldPassword = formValues.currentPassword;
    PasswordChangeModel.In.newPassword = formValues.newPassword;
    PasswordChangeModel.In.userId = Number(localStorage.getItem("userId"));
    this.authService.changePassword(PasswordChangeModel)
      .subscribe({
        next: (res) => {
          alert("password changed successfully");
        },
        error: (err: HttpErrorResponse) => {
          alert("something went wrong");
          console.log(err.message);
          this.errorMessage = err.message;
          this.showError = true;
        }
      })
  }
}


class InModel {
  In: PasswordChangeModel = new PasswordChangeModel();
}

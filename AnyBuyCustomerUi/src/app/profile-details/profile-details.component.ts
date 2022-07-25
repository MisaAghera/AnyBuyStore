import { Component, OnInit } from '@angular/core';
import { UserModel } from '../shared/models/user-model';
import { UserService } from '../shared/services/user.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UntypedFormControl, AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})

export class ProfileDetailsComponent implements OnInit {
  UserDetials: UserModel = new UserModel;
  hasChange: boolean = false;

  userForm: UntypedFormGroup = new UntypedFormGroup({
    id: new UntypedFormControl(''),
    userName: new UntypedFormControl(''),
    gender: new UntypedFormControl(''),
    age: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    phoneNumber: new UntypedFormControl('')
  });

  submitted = false;
  constructor(public userService: UserService, private router: Router, private authService: AuthenticationService, private formBuilder: UntypedFormBuilder) { }

  getuserDetails(id: number) {
    this.userService.getById(id).subscribe(async result => {
     
      this.UserDetials = result;
      await this.setValuesInForm(result);
      await this.onCreateGroupFormValueChange();
    });
  }

  onCreateGroupFormValueChange(){
    const initialValue = this.userForm.value
    this.userForm.valueChanges.subscribe(value => {
      this.hasChange = Object.keys(initialValue).some(key => this.userForm.value[key] != 
                        initialValue[key])
    });
}

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  updateUser = (updateFormValue: any) => {
    if(this.hasChange==true){
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    const formValues = { ...updateFormValue };
    var user: InModel = new InModel();
    user.In.id = Number(localStorage.getItem('userId'));
    user.In.userName = formValues.userName;
    user.In.email = formValues.email;
    user.In.phoneNumber = formValues.phoneNumber;

    if (formValues.age != '')
      user.In.age = formValues.age;
    if (formValues.gender != '' && formValues.gender != null)
      user.In.gender = formValues.gender;

    this.userService.update(user)
      .subscribe({
        next: (_) => {
          alert("profile updated successfully");
          this.getuserDetails(Number(localStorage.getItem('userId')));
        },
        error: (err: HttpErrorResponse) => {
          document.getElementById("danger-alert")!.style.display = "block";
          document.getElementById("danger-alert")!.innerHTML = " unsuccessfull, please check the details";
        }
      })
    }
  }

  onReset(): void {
    this.submitted = false;
    this.userForm.reset();
  }

  setValuesInForm(res: any) {
    this.userForm.controls["id"].setValue(res.id);
    this.userForm.controls['id'].disable();
    this.userForm.controls["userName"].setValue(res.userName);
    this.userForm.controls["age"].setValue(res.age);
    this.userForm.controls["gender"].setValue(res.gender);
    this.userForm.controls["email"].setValue(res.email);
    this.userForm.controls["phoneNumber"].setValue(res.phoneNumber);
  }

  ngOnInit(): void {
    var userId = Number(localStorage.getItem('userId'));
    this.getuserDetails(userId);
    this.userForm = this.formBuilder.group(
      {
        id:[''],
        userName: ['', [Validators.required]],
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
      },
    );
  }
}

class InModel {
  In: UserModel = new UserModel();
}



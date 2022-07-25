import { Component, OnInit } from '@angular/core';
import { UserModel } from '../shared/models/user-model';
import { UserService } from '../shared/services/user.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserRoleModel } from '../shared/models/user-role-model';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})

export class ProfileDetailsComponent implements OnInit {
  UserDetials: UserModel = new UserModel;
  hasChange: boolean = false;
  userId:number =0;
  userName:string ='';
  UserRoles?: UserRoleModel[];
  userForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    userName: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl(''),
    email: new FormControl(''),
    phoneNumber: new FormControl('')
  });

  submitted = false;
  constructor(public UserService: UserService,
    public route: ActivatedRoute,
    public authservice:AuthenticationService,
    private formBuilder: FormBuilder) { }

    deleteRole(roleId: number) {
    let userId = this.userId!;
    var confirmation = confirm("are you sure you want to delete this role?");
    if (confirmation) {
      this.UserService.deleteUserRole(userId, roleId).subscribe(res => {
        location.reload();
      })
    };
  }
    getRolesByUserId(userId: number) {
      this.UserService.getRolesByUserId(userId).subscribe(async result => {
        this.UserRoles = result;
        this.userId = userId;
      });
    }

  getuserDetails(id: number) {
    this.UserService.getById(id).subscribe( result => {
      this.UserDetials = result;
      this.userName = result.userName;
       this.setValuesInForm(result);
       this.onCreateGroupFormValueChange();
    });
  }

  addRole(role:string){
    let jsonData = {
      In: {
        Role: role,
        UserName : this.userName
      }
    }

    this.authservice.addRole(jsonData).subscribe(
      {next: (_) => {
        this.getRolesByUserId(this.userId);
      },
      error: (err: HttpErrorResponse) => {
        this.getRolesByUserId(this.userId);
      }
      }
    )   
  }
  onCreateGroupFormValueChange(){
    const initialValue = this.userForm.value
    this.userForm.valueChanges.subscribe(value => {
      this.hasChange = Object.keys(initialValue).some(key => this.userForm.value[key] != initialValue[key])
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
      this.UserService.update(user)
      .subscribe({
        next: (res) => {
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
    this.route.paramMap.subscribe(params => {
      var userId = Number(params.get('id'));
      this.userId = userId;
    this.getuserDetails(userId);
    this.getRolesByUserId(userId);
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
  })
  }
  }

class InModel {
  In: UserModel = new UserModel();
}



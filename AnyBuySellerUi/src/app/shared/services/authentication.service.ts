import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthResponseModel } from '../models/auth-response-model.model';
import { of, Observable, Subject, BehaviorSubject } from 'rxjs';
import { GlobalConstants } from '../global-constants.model';
import { UserForAuthenticationModel } from '../models/user-for-authentication-model.model';
import { UserForRegistrationModel } from '../models/user-for-registration-model.model';
import { Router } from '@angular/router';
import { PasswordChangeModel } from '../models/password-change-model';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  formDataLogin: UserForAuthenticationModel = new UserForAuthenticationModel();
  readonly LoginUrl = GlobalConstants.apiURL + 'Authenticate/LoginSeller';
  readonly RegisterUrl = GlobalConstants.apiURL + 'Authenticate/RegisterSeller';
  readonly PasswordChangeUrl = GlobalConstants.apiURL+ 'Authenticate/ChangePassword';
  private authChangeSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public authChanged: Observable<boolean> = this.authChangeSub.asObservable();
  readonly LoginRefreshUrl = GlobalConstants.apiURL + 'Authenticate/Refresh';

  constructor(public router: Router, public http: HttpClient, public fb: FormBuilder) { }

  loginUser(body: InModelAuth): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(this.LoginUrl, body)
  }

  registerUser(body: InModelRegister) {
    return this.http.post(this.RegisterUrl, body);
  }

  checkIfAuthenticated() {
    let token = localStorage.getItem('token')?.toString();
    if (token == '' || token == null) {
      this.sendAuthStateChangeNotification(false);
    }
    else {
      this.sendAuthStateChangeNotification(true);
    }
  }

  changePassword(body:InModelPasswordChange){
      return this.http.post(this.PasswordChangeUrl,body);
  }

  generateRefreshToken() {
    let input = {
      "in": {
        "token": this.GetToken(),
        "refreshtoken": this.GetRefreshToken(),
        "userId": this.GetUserId()
      }
    }
    return this.http.post(this.LoginRefreshUrl, input)

  }

  saveTokens(tokendate: any) {
    localStorage.setItem("token", tokendate.token);
    localStorage.setItem("refreshtoken", tokendate.refreshtoken);
  }
  checkIfAuthenticatedForService() {
    let token = localStorage.getItem('token')?.toString();
    if (token == '' || token == null) {
      return false;
    }
    else {
      return true;
    }
  }
  GetUserId() {
    return localStorage.getItem('userId') || '';
  }
  GetToken() {
    return localStorage.getItem('token') || '';
  }

  GetRefreshToken() {
    return localStorage.getItem('refreshtoken') || '';
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    this.sendAuthStateChangeNotification(false);
  }
  sendAuthStateChangeNotification(isAuthenticated: boolean) {
    this.authChangeSub.next(isAuthenticated);
  }
}


class InModelAuth {
  In: UserForAuthenticationModel = new UserForAuthenticationModel();
}
class InModelRegister {
  In: UserForRegistrationModel = new UserForRegistrationModel();
}

class InModelPasswordChange{
  In:PasswordChangeModel = new PasswordChangeModel();
}
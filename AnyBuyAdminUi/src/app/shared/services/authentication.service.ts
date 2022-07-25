import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthResponseModel } from '../models/auth-response-model.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GlobalConstants } from '../global-constants.model';
import { UserForAuthenticationModel } from '../models/user-for-authentication-model.model';
import { UserForRegistrationModel } from '../models/user-for-registration-model.model';
import { PasswordChangeModel } from '../models/password-change-model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  formDataLogin: UserForAuthenticationModel = new UserForAuthenticationModel();
  readonly LoginUrl = GlobalConstants.apiURL + 'Authenticate/LoginAdmin';
  readonly LoginRefreshUrl = GlobalConstants.apiURL + 'Authenticate/Refresh';
  readonly RegisterAdminUrl = GlobalConstants.apiURL + 'Authenticate/RegisterAdmin';
  readonly RegisterCustomerUrl = GlobalConstants.apiURL + 'Authenticate/RegisterCustomer';
  readonly RegisterSellerUrl = GlobalConstants.apiURL + 'Authenticate/RegisterSeller';
  readonly PasswordChangeUrl = GlobalConstants.apiURL+ 'Authenticate/ChangePassword';
  readonly AddRoleUrl = GlobalConstants.apiURL + 'Authenticate/addRole';

  private authChangeSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public authChanged: Observable<boolean> = this.authChangeSub.asObservable();
  constructor(private http: HttpClient, private fb: FormBuilder) { }

  loginUser(body: InModelAuth): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(this.LoginUrl, body)
  }

  registerSeller(body: InModelRegister) {
    return this.http.post(this.RegisterSellerUrl, body);
  }

  registerAdmin(body: InModelRegister) {
    return this.http.post(this.RegisterAdminUrl, body);
  }

  registerCustomer(body: InModelRegister) {
    return this.http.post(this.RegisterCustomerUrl, body);
  }

  changePassword(body:InModelPasswordChange){
    return this.http.post(this.PasswordChangeUrl,body);
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

  generateRefreshToken() {
    let input = {
      "in":{
        "token": this.GetToken(),
        "refreshtoken": this.GetRefreshToken(),
        "userId" :this.GetUserId()
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
  GetUserId(){
    return localStorage.getItem('userId')||'';
  }
  GetToken() {
    return localStorage.getItem('token') || '';
  }

  GetRefreshToken() {
    return localStorage.getItem('refreshtoken') || '';
  }

 addRole(jsonData:any){
   return this.http.post(this.AddRoleUrl,jsonData);
 }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("refreshtoken");
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

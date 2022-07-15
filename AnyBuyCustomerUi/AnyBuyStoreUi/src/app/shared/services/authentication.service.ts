import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthResponseModel } from '../models/auth-response-model.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GlobalConstants } from '../global-constants.model';
import { UserForAuthenticationModel } from '../models/user-for-authentication-model.model';
import { UserForRegistrationModel } from '../models/user-for-registration-model.model';
import { PasswordChangeModel } from '../models/password-change-model';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { ExternalAuthModel } from '../models/external-auth-model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  readonly LoginUrl = GlobalConstants.apiURL + 'Authenticate/LoginUser';
  readonly RegisterUrl = GlobalConstants.apiURL + 'Authenticate/RegisterCustomer';
  private authChangeSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public authChanged: Observable<boolean> = this.authChangeSub.asObservable();
  readonly LoginRefreshUrl = GlobalConstants.apiURL + 'Authenticate/Refresh';
  readonly PasswordChangeUrl = GlobalConstants.apiURL + 'Authenticate/ChangePassword';
  readonly ExternalLoginUrl = GlobalConstants.apiURL + "Authenticate/ExternalLogin";
  private extAuthChangeSub = new Subject<SocialUser>();
  public extAuthChanged = this.extAuthChangeSub.asObservable();
  public isExternalAuth?: boolean;

  constructor(private http: HttpClient,
     private externalAuthService: SocialAuthService) {
    this.externalAuthService.authState.subscribe((user) => {
      this.externalLogin();
      this.extAuthChangeSub.next(user);
      this.isExternalAuth = true;
    })
  }

  externalLogin(){
    this.signInWithGoogle();
    this.extAuthChanged.subscribe( user => {
      debugger
      const externalAuth: ExternalAuthModel = {
        provider: user.provider,
        idToken: user.idToken
      }
      this.validateExternalAuth(externalAuth);
    })
  }

  private validateExternalAuth(externalAuth: ExternalAuthModel) {
    this.externalLoginService(externalAuth)
      .subscribe({
        next: (res) => {
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.userId!.toString());
          localStorage.setItem("userName",res.userName!.toString());
          localStorage.setItem("refreshtoken",res.refreshtoken!);
          this.sendAuthStateChangeNotification(res.isAuthSuccessful);
      },
        error: (err: HttpErrorResponse) => {
           this.signOutExternal();
        }
      });
  }

  public signOutExternal = () => {
    this.externalAuthService.signOut();
  }

  public externalLoginService = (body: ExternalAuthModel) => {
    debugger
    return this.http.post<AuthResponseModel>(this.ExternalLoginUrl, body);
  }

  public signInWithGoogle = () => {
    this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  loginUser(body: InModelAuth): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(this.LoginUrl, body)
  }

  registerUser(body: InModelRegister) {
    return this.http.post(this.RegisterUrl, body);
  }
  changePassword(body: InModelPasswordChange) {
    return this.http.post(this.PasswordChangeUrl, body);
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
    // let currentTime = new Date();
    // let Time = new Date(this.expiration!);
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
class InModelPasswordChange {
  In: PasswordChangeModel = new PasswordChangeModel();
}
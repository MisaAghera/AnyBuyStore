import { Injectable, Injector} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Token } from '@angular/compiler';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private inject:Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {   
    let authService = this.inject.get(AuthenticationService);
    request = this.AddTokenHeader(request,authService.GetToken());   
       
    return next.handle(request).pipe(
      catchError(errordata=>{
        if(errordata.status === 401){
          return this.handleRefreshToken(request,next);
        }
        return throwError(errordata);
      })
    );
  }

  handleRefreshToken(request:HttpRequest<any>,next:HttpHandler){
    let authService = this.inject.get(AuthenticationService);
    return authService.generateRefreshToken().pipe(
      switchMap((data:any)=>{
        authService.saveTokens(data);
        return next.handle(this.AddTokenHeader(request,data.token))
      }

    ),
    catchError(errordata=>{
      authService.logout();
      return throwError(errordata)
    })
    );}

  AddTokenHeader(request:HttpRequest<any>,token:any){
    return request.clone({headers:request.headers.set('Authorization',`Bearer ${token}`)});
  }
}

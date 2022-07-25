import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    return next.handle(request)
        .pipe(
            map(res => {
                return res
            }),
            catchError((error: HttpErrorResponse) => {
                let errorMsg = '';
                if (error.error instanceof ErrorEvent) {
                    console.log('This is client side error');
                    errorMsg = `Error: ${error.error.message}`;
                } else {
                    console.log('This is server side error');
                    errorMsg = `Error Code: ${error.status},  Message: ${error.error.message}`;
                    if(error.status == 500 || error.status ==0){
                        this.router.navigate(['/serverError']);
                    }
                }
                console.log(errorMsg);
                return throwError(errorMsg);
            })
        )
}
}

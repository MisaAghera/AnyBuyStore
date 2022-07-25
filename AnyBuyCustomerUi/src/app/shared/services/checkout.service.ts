import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../global-constants.model';
 
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  readonly url =  GlobalConstants.apiURL + 'Payment/Add';
  constructor(private http: HttpClient) { }
  
  makePayment(stripeToken: any): Observable<any>{
    return this.http.post<any>(this.url,stripeToken)
  }
}
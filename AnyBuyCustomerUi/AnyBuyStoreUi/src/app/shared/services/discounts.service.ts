import { Injectable } from '@angular/core';
import { DiscountModel } from '../models/discount-model.model';
import {HttpClient} from "@angular/common/http";
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {
  readonly GetUrl = GlobalConstants.apiURL+'Discount/GetAll';
  readonly GetByIdUrl = GlobalConstants.apiURL+'Discount/GetById/';
  constructor(private http :HttpClient) { }
  
  getAll(): Observable<Array<DiscountModel>>{
    return this.http.get<Array<DiscountModel>>(this.GetUrl);
  }


  GetById(discountId:number):Observable<DiscountModel>{
    return this.http.get<DiscountModel>(this.GetByIdUrl+discountId);
  }
}


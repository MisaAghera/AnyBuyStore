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
  readonly deleteUrl = GlobalConstants.apiURL+'Discount/Delete/';
  readonly editUrl = GlobalConstants.apiURL+'Discount/Update/';
  readonly AddUrl = GlobalConstants.apiURL + 'Discount/Add';
  constructor(private http :HttpClient) { }
  
  getAll(): Observable<Array<DiscountModel>>{
    return this.http.get<Array<DiscountModel>>(this.GetUrl);
  }


  GetById(discountId:number):Observable<DiscountModel>{
    return this.http.get<DiscountModel>(this.GetByIdUrl+discountId);
  }
  delete(id: number) {
    return this.http.delete(this.deleteUrl + id);
  }

 
  update(body: any) {
    return this.http.put(this.editUrl+body.In.id, body);
  }

  add(body: any) {
    return this.http.post(this.AddUrl, body);
  }

}


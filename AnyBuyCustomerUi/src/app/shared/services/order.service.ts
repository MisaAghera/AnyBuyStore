import { Injectable } from '@angular/core';
import { OrderModel } from '../models/order-model'; 
import {HttpClient} from '@angular/common/http';
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  formData: OrderModel = new OrderModel();

  readonly getByIdUrl = GlobalConstants.apiURL+ 'Order/GetById/';
  readonly AddUrl = GlobalConstants.apiURL+ 'Order/Add';
  readonly updateUrl = GlobalConstants.apiURL + 'Order/Update/';
  readonly deleteUrl = GlobalConstants.apiURL+'Order/Delete/';
  readonly getAllByUserUrl = GlobalConstants.apiURL+'Order/GetAllByUSerId?UserId=';
  constructor(private http :HttpClient) { }

  // getAll() : Observable<Array<OrderModel>>{
  //   return this.http.get<Array<OrderModel>>(this.baseURLGet)
  // }

  getById(OrderId: number): Observable<OrderModel> {
    return this.http.get<OrderModel>(this.getByIdUrl+OrderId) 
  }

  delete(id:number){
    return this.http.delete(this.deleteUrl+id);
  }
  
  update(body :InModelOrder){
    return this.http.put(this.updateUrl+body.In.id,body);
  }

  add(body : InModelOrder): Observable<number>{
    return this.http.post<number>(this.AddUrl , body);
  }

  getByUserId(UserId: number): Observable<Array<OrderModel>> {
    return this.http.get<Array<OrderModel>>(this.getAllByUserUrl+UserId)  
  }
}
class InModelOrder{
  In: OrderModel = new OrderModel();
}

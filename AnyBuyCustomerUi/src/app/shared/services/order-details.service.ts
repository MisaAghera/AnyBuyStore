import { Injectable } from '@angular/core';
import { OrderDetailsModel } from '../models/order-details-model';
import { OrderModel } from '../models/order-model'; 
import {HttpClient} from '@angular/common/http';
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {
  formData: OrderModel = new OrderModel();

  readonly getByOrderIdUrl = GlobalConstants.apiURL+ 'OrderDetails/GetById/';
  readonly AddUrl = GlobalConstants.apiURL+ 'OrderDetails/Add';
  readonly updateUrl = GlobalConstants.apiURL + 'OrderDetails/Update/';
  readonly deleteUrl = GlobalConstants.apiURL+'OrderDetails/Delete/';
  readonly getAllByOrderUrl = GlobalConstants.apiURL+'OrderDetails/GetAllByOrderId?OrderId=';
  readonly getByIdUrl = GlobalConstants.apiURL+'OrderDetails/GetByOrderDetailId/';
 
  constructor(private http :HttpClient) { }

  getById(Id: number): Observable<OrderDetailsModel> {
    return this.http.get<OrderDetailsModel>(this.getByIdUrl+Id) 
  }

  delete(id:number){
    return this.http.delete(this.deleteUrl+id);
  }
  
  update(body :InModelOrderDetails){
    return this.http.put(this.updateUrl,body);
  }

  add(body : InModelOrderDetails) :Observable<number>{
    return this.http.post<number>(this.AddUrl , body);
  }

  getAllByOrderId(orderId: number): Observable<Array<OrderDetailsModel>> {
    return this.http.get<Array<OrderDetailsModel>>(this.getAllByOrderUrl+orderId)  
  }
}
class InModelOrderDetails{
  In: OrderDetailsModel = new OrderDetailsModel();
}

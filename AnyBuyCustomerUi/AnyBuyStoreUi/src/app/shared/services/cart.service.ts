import { Injectable } from '@angular/core';
import { CartModel } from '../models/cart-model.model';
import {HttpClient} from '@angular/common/http';
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class CartService {
  readonly getCartUrl = GlobalConstants.apiURL+'ProductCart/GetAll?UserId=';
  readonly addCartUrl = GlobalConstants.apiURL+'ProductCart/Add';
  readonly deleteCartUrl = GlobalConstants.apiURL+'ProductCart/Delete/';
  readonly deleteCartWithUserIdUrl = GlobalConstants.apiURL+'ProductCart/DeleteFromUserId/';
  readonly updateCartUrl = GlobalConstants.apiURL+'ProductCart/Update/';

  getAllByUserId(userId:number) : Observable<Array<CartModel>>{
    return this.http.get<Array<CartModel>>(this.getCartUrl+userId)
  }
  
  add(body : InModelCart){
    return this.http.post(this.addCartUrl , body);
  }

  delete(id:number){
    return this.http.delete(this.deleteCartUrl+id);
  }

  deleteFromUserId(id:number){
    return this.http.delete(this.deleteCartWithUserIdUrl+id);
  }

  update(body :InModelCart){
    return this.http.put(this.updateCartUrl+body.In.id,body);
  }

  constructor(private http :HttpClient) { }
}

class InModelCart{
  In: CartModel = new CartModel();
}

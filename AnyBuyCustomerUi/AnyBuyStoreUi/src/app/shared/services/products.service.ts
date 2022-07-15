import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product-model.model';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs';
import { ProductQuantity } from '../models/product-quantity';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  formData: ProductModel = new ProductModel();

  readonly baseURLGet = GlobalConstants.apiURL + 'Product/GetAll';
  readonly getBySubIdUrl = GlobalConstants.apiURL + 'Product/GetAllBySubId?SubcategoryId=';
  readonly getByIdUrl = GlobalConstants.apiURL + 'Product/GetById/';
  readonly AddUrl = GlobalConstants.apiURL + 'Product/Add';
  readonly getByUserUrl = GlobalConstants.apiURL + 'Product/GetAllByUSerId?UserId=';
  readonly updateUrl = GlobalConstants.apiURL + 'Product/Update/put';
  readonly deleteUrl = GlobalConstants.apiURL + 'Product/Delete/';
  readonly updateQuantityUrl = GlobalConstants.apiURL + 'Product/UpdateQuantity/put?id=';
  readonly GetAllProductByDiscountIdUrl = GlobalConstants.apiURL+'Discount/GetpProductsById/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Array<ProductModel>> {
    return this.http.get<Array<ProductModel>>(this.baseURLGet)
  }

  getAllBySubcategoryId(SubcategoryId: number): Observable<Array<ProductModel>> {
    return this.http.get<Array<ProductModel>>(this.getBySubIdUrl + SubcategoryId)
  }
  getAllByUserId(UserId: number): Observable<Array<ProductModel>> {
    return this.http.get<Array<ProductModel>>(this.getByUserUrl + UserId)
  }

  getById(ProductId: number): Observable<ProductModel> {
    return this.http.get<ProductModel>(this.getByIdUrl + ProductId)
  }
  GetAllProductByDiscountId(discountId:number): Observable<Array<ProductModel>>{
    return this.http.get<Array<ProductModel>>(this.GetAllProductByDiscountIdUrl+discountId);
  }


  delete(id: number) {
    return this.http.delete(this.deleteUrl + id);
  }

  updateQuantity(body:InUpdateProductmodel ) {
    return this.http.put(this.updateQuantityUrl + body.In.id, body)
  }
}

class InModelProduct {
  In: ProductModel = new ProductModel();
}

class InUpdateProductmodel{
  In:ProductQuantity=new ProductQuantity();
}
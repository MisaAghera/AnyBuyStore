import { Injectable } from '@angular/core';
import { CategoryModel } from '../models/category-model.model';
import {HttpClient} from "@angular/common/http";
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  readonly GetUrl = GlobalConstants.apiURL+'ProductCategory/GetAll';
  readonly deleteUrl = GlobalConstants.apiURL+'ProductCategory/Delete/';
  readonly editUrl = GlobalConstants.apiURL+'ProductCategory/Update/';
  readonly AddUrl = GlobalConstants.apiURL + 'ProductCategory/Add';
  readonly getByIdUrl = GlobalConstants.apiURL + 'ProductCategory/GetById/';
  readonly GetBySubUrl = GlobalConstants.apiURL+'ProductCategory/GetBySubId?SubcategoryId=';

  constructor(private http :HttpClient) { }
  
  getAll(): Observable<Array<CategoryModel>>{
    return this.http.get<Array<CategoryModel>>(this.GetUrl);
  }
  delete(id: number) {
    return this.http.delete(this.deleteUrl + id);
  }

  getById(ProductId: number): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(this.getByIdUrl + ProductId)
  }

  update(body: any) {
    return this.http.put(this.editUrl+body.In.id, body);
  }

  add(body: any) {
    return this.http.post(this.AddUrl, body);
  }
  getBySubCategoryId(subcategoryId:number):Observable<number>{
    return this.http.get<number>(this.GetBySubUrl + subcategoryId);
  }
}

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
  readonly GetBySubUrl = GlobalConstants.apiURL+'ProductCategory/GetBySubId?SubcategoryId=';
  constructor(private http :HttpClient) { }
  
  getAll(): Observable<Array<CategoryModel>>{
    return this.http.get<Array<CategoryModel>>(this.GetUrl);
  }
  getBySubCategoryId(subcategoryId:number):Observable<number>{
    return this.http.get<number>(this.GetBySubUrl + subcategoryId);
  }
}
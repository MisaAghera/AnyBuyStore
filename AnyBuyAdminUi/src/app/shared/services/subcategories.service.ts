import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SubcategoryModel } from '../models/subcategory-model.model';
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {
  readonly getURL = GlobalConstants.apiURL + 'ProductSubcategory/GetAll?CategoryId=';
  readonly GetUrl = GlobalConstants.apiURL+'ProductSubcategory/GetAllSubcategories';
  readonly deleteUrl = GlobalConstants.apiURL+'ProductSubcategory/Delete/';
  readonly editUrl = GlobalConstants.apiURL+'ProductSubcategory/Update/';
  readonly AddUrl = GlobalConstants.apiURL + 'ProductSubcategory/Add';
  readonly getByIdUrl = GlobalConstants.apiURL + 'ProductSubcategory/GetById/';

  constructor(private http :HttpClient) { }
  
  getAllSubcategories(): Observable<Array<SubcategoryModel>>{
    return this.http.get<Array<SubcategoryModel>>(this.GetUrl);
  }

  delete(id: number) {
    return this.http.delete(this.deleteUrl + id);
  }

  getById(ProductId: number): Observable<SubcategoryModel> {
    return this.http.get<SubcategoryModel>(this.getByIdUrl + ProductId)
  }

  update(body: any) {
    return this.http.put(this.editUrl+body.In.id, body);
  }

  add(body: any) {
    return this.http.post(this.AddUrl, body);
  }


  getAll(CategoryId: number): Observable<Array<SubcategoryModel>> {
    return this.http.get<Array<SubcategoryModel>>(this.getURL + CategoryId);
  }

}

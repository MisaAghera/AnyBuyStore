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

  constructor(private http: HttpClient) { }

  getAll(CategoryId: number): Observable<Array<SubcategoryModel>> {
    return this.http.get<Array<SubcategoryModel>>(this.getURL + CategoryId);
  }

}

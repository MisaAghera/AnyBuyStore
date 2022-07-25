import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs';
import { CountryModel } from '../models/country-model.model';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  readonly GetUrl = GlobalConstants.apiURL+'Country/GetCountries';
  readonly deleteUrl = GlobalConstants.apiURL+'Country/DeleteCountry/';
  readonly editUrl = GlobalConstants.apiURL+'Country/UpdateCountry/';
  readonly AddUrl = GlobalConstants.apiURL + 'Country/AddCountry';
  readonly getByIdUrl = GlobalConstants.apiURL + 'Country/GetById/';

  constructor(private http :HttpClient) { }
  
  getAll(): Observable<Array<CountryModel>>{
    return this.http.get<Array<CountryModel>>(this.GetUrl);
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
  getById(ProductId: number): Observable<CountryModel> {
    return this.http.get<CountryModel>(this.getByIdUrl + ProductId)
  }

}

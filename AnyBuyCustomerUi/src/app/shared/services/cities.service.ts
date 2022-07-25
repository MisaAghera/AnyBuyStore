import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs/internal/Observable';
import { CityModel } from '../models/city-model.model';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  readonly getURL = GlobalConstants.apiURL + 'City/GetCitiesFromStateId/';
  readonly GetUrl = GlobalConstants.apiURL+'City/GetCities';
  readonly deleteUrl = GlobalConstants.apiURL+'City/DeleteCity/';
  readonly editUrl = GlobalConstants.apiURL+'City/UpdateCity/';
  readonly AddUrl = GlobalConstants.apiURL + 'City/AddCity';
  readonly getByIdUrl = GlobalConstants.apiURL + 'City/GetById/';

  constructor(private http :HttpClient) { }
  
  getAll(): Observable<Array<CityModel>>{
    return this.http.get<Array<CityModel>>(this.GetUrl);
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


  getAllFromStateId(StateId: number): Observable<Array<CityModel>> {
    return this.http.get<Array<CityModel>>(this.getURL + StateId);
  }

  getById(ProductId: number): Observable<CityModel> {
    return this.http.get<CityModel>(this.getByIdUrl + ProductId)
  }

}

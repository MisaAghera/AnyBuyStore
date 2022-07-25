import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs/internal/Observable';
import { CityModel } from '../models/city-model.model';
import { StateModel } from '../models/state-model.model';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  readonly getURL = GlobalConstants.apiURL + 'State/GetStatesFromCountryId/';
  readonly GetUrl = GlobalConstants.apiURL+'State/GetStates';
  readonly deleteUrl = GlobalConstants.apiURL+'State/DeleteState/';
  readonly editUrl = GlobalConstants.apiURL+'State/UpdateState/';
  readonly AddUrl = GlobalConstants.apiURL + 'State/AddState';
  readonly getByIdUrl = GlobalConstants.apiURL + 'State/GetById/';

  constructor(private http :HttpClient) { }
  
  getAll(): Observable<Array<StateModel>>{
      return this.http.get<Array<StateModel>>(this.GetUrl);
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

  getAllFromCountryId(CountryId: number): Observable<Array<StateModel>> {
    return this.http.get<Array<StateModel>>(this.getURL + CountryId);
  }
  
  getById(ProductId: number): Observable<StateModel> {
    return this.http.get<StateModel>(this.getByIdUrl + ProductId)
  }
}

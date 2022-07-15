import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../global-constants.model';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user-model';
import { UserRoleModel } from '../models/user-role-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly getAllUrl = GlobalConstants.apiURL + 'User/GetAll';
  readonly getByIdUrl = GlobalConstants.apiURL + 'User/GetById/';
  readonly deleteUrl = GlobalConstants.apiURL + 'User/Delete/';
  readonly getUserRolesUrl = GlobalConstants.apiURL + 'User/GetRolesByUserId?UserId=';
  readonly deleteUserRolesUrl = GlobalConstants.apiURL + 'User/DeleteRoles?';
  readonly getUsersByRoleIdUrl = GlobalConstants.apiURL+'User/GetAllByUserRolesId?RoleId=';
  readonly getAllRolesUrl = GlobalConstants.apiURL+'User/GetAllRoles';
  readonly editUrl = GlobalConstants.apiURL+'User/Update/';

  
  constructor(private http: HttpClient) { }

  getAll(): Observable<Array<UserModel>> {
    return this.http.get<Array<UserModel>>(this.getAllUrl)
  }

  getAllRoles(): Observable<Array<UserRoleModel>> {
    return this.http.get<Array<UserRoleModel>>(this.getAllRolesUrl)
  }

  getById(Id: number): Observable<UserModel> {
    return this.http.get<UserModel>(this.getByIdUrl +Id)
  }

  delete(id: number) {
    return this.http.delete(this.deleteUrl + id);
  }

  getRolesByUserId(id:number): Observable<Array<UserRoleModel>> {
    return this.http.get<Array<UserRoleModel>>(this.getUserRolesUrl+id)
  }

  getUsersByRoleId(id:number): Observable<Array<UserModel>> {
    return this.http.get<Array<UserModel>>(this.getUsersByRoleIdUrl+id)
  }

  deleteUserRole(userId: number,roleId: number) {
    return this.http.delete(this.deleteUserRolesUrl +`userId=${userId}&roleId=${roleId}`);
  }

  update(body: any) {
    return this.http.put(this.editUrl+body.In.id, body);
  }
}

class InUsermodel{
  In:UserModel=new UserModel();
}
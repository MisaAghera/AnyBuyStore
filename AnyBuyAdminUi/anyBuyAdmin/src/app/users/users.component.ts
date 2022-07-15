import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { UserModel } from '../shared/models/user-model';
import { UserRoleModel } from '../shared/models/user-role-model';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  UserList?: UserModel[];
  UserDetails?: UserModel;
  UserRoles?: UserRoleModel[];
  userId?: number;
  AllRoles?: UserRoleModel[];

  filterTerm?: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];

  constructor(public UserService: UserService) { }

  getUsers(): void {
    this.UserService.getAll().subscribe(result => {
      this.UserList = result;
    });
  }

  getCurrentUsers(): void {
    this.UserList = this.UserList;
  }

  onClickFilterByRole(id: number) {
    this.UserService.getUsersByRoleId(id).subscribe(result => {
      this.UserList = result;
    });
  }

  getAllRoles(): void {
    this.UserService.getAllRoles().subscribe(result => {
      this.AllRoles = result;
    });

  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCurrentUsers();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCurrentUsers();
  }


  async onDeleteUser(Id: number) {
    var confirmation = confirm("are you sure you want to delete this role?");
    if (confirmation) {
      await this.UserService.delete(Id).subscribe(res => {
        location.reload();
      }
      )
    };
  }


  getUserDetails(userId: number) {
    this.UserService.getById(userId).subscribe(async result => {
      this.UserDetails = result;
    });
  }

  getRolesByUserId(userId: number) {
    this.UserService.getRolesByUserId(userId).subscribe(async result => {
      this.UserRoles = result;
      this.userId = userId;
    });
  }

  deleteRole(roleId: number) {
    let userId = this.userId!;
    var confirmation = confirm("are you sure you want to delete this user?");
    if (confirmation) {
      this.UserService.deleteUserRole(userId, roleId).subscribe(res => {
        location.reload();
      })
    };
  }

  ngOnInit(): void {
    this.getUsers();
    this.getAllRoles();
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

import * as $ from 'jquery';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = 'AnyBuyStore';
  userName?: string;
  isUserAuthenticated: boolean = false;
  userId :number = Number(localStorage.getItem("userId"));

  logout() {
    this.authService.logout();
    this.authService.checkIfAuthenticated();
    this.isUserAuthenticated = false;
    this.router.navigate(["/"]);
    this.userName = localStorage.getItem("userName") ? localStorage.getItem("userName")?.toString() : '';
  }

  async assignAuthentication(res: boolean) {
    this.isUserAuthenticated = res;
  }

  constructor(private authService: AuthenticationService,private router: Router) { }

  ngOnInit() {
    this.authService.checkIfAuthenticated();
    this.authService.authChanged
      .subscribe(async res => {
        await this.assignAuthentication(res);
        this.userName = localStorage.getItem("userName") ? localStorage.getItem("userName")?.toString() : '';
      })

    //Toggle Click Function
   $("#menu-toggle").click((e) => {
     e.preventDefault();
     $("#wrapper").toggleClass("toggled");
   });
 }

}

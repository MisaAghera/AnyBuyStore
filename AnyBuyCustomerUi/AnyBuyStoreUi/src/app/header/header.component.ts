import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isUserAuthenticated: boolean = false;
  constructor(private authService: AuthenticationService,private router: Router) { }
  userName?: string;

async assignAuthentication(res: boolean) {
    this.isUserAuthenticated = res;
  }

  logout() {
    this.authService.logout();
    this.authService.checkIfAuthenticated();
    this.isUserAuthenticated = false;
    this.router.navigate(["/"]);
    this.userName = localStorage.getItem("userName") ? localStorage.getItem("userName")?.toString() : '';
  }

  ngOnInit(): void {
    this.authService.checkIfAuthenticated();
    this.authService.authChanged
      .subscribe(async res => {
        await this.assignAuthentication(res);
        this.userName = localStorage.getItem("userName") ? localStorage.getItem("userName")?.toString() : '';
      })
  }

}



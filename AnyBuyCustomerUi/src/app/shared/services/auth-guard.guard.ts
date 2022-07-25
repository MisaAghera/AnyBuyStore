import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private service:AuthenticationService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  
    if(this.service.checkIfAuthenticatedForService()==true)
    {
      // logged in so return true
      return true;
    }
    
    // not logged in so redirect to login page with the return url and return false
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
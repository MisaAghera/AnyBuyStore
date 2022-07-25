import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { SubcategoriesComponent } from './subcategories/subcategories.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './shared/services/auth-guard.guard';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { CountriesComponent } from './countries/countries.component';
import { CitiesComponent } from './cities/cities.component';
import { StatesComponent } from './states/states.component';
import { AddProductComponent } from './add-product/add-product.component';
const routes: Routes = [
  { path:"users", component:UsersComponent, canActivate: [AuthGuard] },
  { path:"products", component:ProductsComponent , canActivate: [AuthGuard]},
  { path:"categories", component:CategoriesComponent, canActivate: [AuthGuard] },
  { path:"subcategories", component:SubcategoriesComponent, canActivate: [AuthGuard] },
  { path:"discounts", component:DiscountsComponent , canActivate: [AuthGuard]},
  { path:"orders", component:OrdersComponent, canActivate: [AuthGuard] },
  { path:"profile/:id", component:ProfileDetailsComponent , canActivate: [AuthGuard]},
  { path:"country", component:CountriesComponent , canActivate: [AuthGuard]},
  { path:"city", component:CitiesComponent , canActivate: [AuthGuard]},
  { path:"state", component:StatesComponent , canActivate: [AuthGuard]},
  { path:"login", component:LoginComponent },
  { path:"signup", component:SignupComponent },
  { path:"product/addEdit/:id", component:AddProductComponent , canActivate: [AuthGuard] },
  { path:"passwordChange", component:PasswordChangeComponent , canActivate: [AuthGuard]},
  { path: '', redirectTo: '/users', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  
})
export class AppRoutingModule { }

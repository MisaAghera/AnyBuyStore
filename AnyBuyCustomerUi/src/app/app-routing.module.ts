import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsingleComponent } from './productsingle/productsingle.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { SubcategoriesComponent } from './subcategories/subcategories.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { ProductsComponent } from './products/products.component';
import { AllUserOrdersComponent } from './all-user-orders/all-user-orders.component';
import { ThankYouPageComponent } from './thank-you-page/thank-you-page.component';
import { AuthGuard } from './shared/services/auth-guard.guard';
import { PasswordChangeModel } from './shared/models/password-change-model';
import { PasswordChangeComponent } from './password-change/password-change.component';

const routes: Routes = [
  { path:"signup", component:SignupComponent },
  { path:"login", component:LoginComponent },
  { path:"order/:id", component:OrdersComponent, canActivate: [AuthGuard] },
  { path:"product/:id", component:ProductsingleComponent },
  { path:"cart", component:CartComponent , canActivate: [AuthGuard]},
  { path:"home", component:HomeComponent },
  { path: 'subcategory/:id', component: SubcategoriesComponent },
  { path:"profile-details", component:ProfileDetailsComponent, canActivate: [AuthGuard] },
  { path:"edit-address", component:EditAddressComponent , canActivate: [AuthGuard]},
  { path:"products", component:ProductsComponent },
  {path:"orders",component:AllUserOrdersComponent, canActivate: [AuthGuard]},
  {path:"thankyou",component:ThankYouPageComponent, canActivate: [AuthGuard]},
  {path:"passwordChange",component:PasswordChangeComponent, canActivate: [AuthGuard]},

  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

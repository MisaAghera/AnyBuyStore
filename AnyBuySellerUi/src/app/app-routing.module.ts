import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductsComponent } from './products/products.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductsingleComponent } from './productsingle/productsingle.component';
import { AuthGuard } from './shared/services/auth-guard.guard';
import { OrdersComponent } from './orders/orders.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ServerErrorComponent } from './server-error/server-error.component';
const routes: Routes = [
  { path:"product/addEdit/:id", component:AddProductComponent , canActivate: [AuthGuard] },
  { path:"login", component:LoginComponent },
  { path:"signup", component:SignupComponent },
  { path:"products", component:ProductsComponent, canActivate: [AuthGuard]  },
  {path: "product-card",component:ProductCardComponent, canActivate: [AuthGuard] },
  { path:"product/:id", component:ProductsingleComponent , canActivate: [AuthGuard] },
  { path:"orders", component:OrdersComponent, canActivate: [AuthGuard] },
  { path:"profile", component:ProfileDetailsComponent , canActivate: [AuthGuard]},
  { path:"passwordChange", component:PasswordChangeComponent , canActivate: [AuthGuard]},
  { path:"serverError", component:ServerErrorComponent },

  { path: '', redirectTo: '/products', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

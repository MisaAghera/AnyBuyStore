import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UsersComponent } from './users/users.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { SubcategoriesComponent } from './subcategories/subcategories.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ErrorCatchingInterceptor } from './shared/interceptors/error-catching.interceptor';
import { AuthGuard } from './shared/services/auth-guard.guard';
import { AuthInterceptorInterceptor } from './shared/interceptors/auth-interceptor.interceptor';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { CitiesComponent } from './cities/cities.component';
import { StatesComponent } from './states/states.component';
import { CountriesComponent } from './countries/countries.component';
import { AddProductComponent } from './add-product/add-product.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UsersComponent,
    ProductsComponent,
    CategoriesComponent,
    SubcategoriesComponent,
    DiscountsComponent,
    OrdersComponent,
    ProfileDetailsComponent,
    LoginComponent,
    SignupComponent,
    PasswordChangeComponent,
    ServerErrorComponent,
    CitiesComponent,
    StatesComponent,
    CountriesComponent,
    AddProductComponent,

  ],
  
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

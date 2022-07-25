import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../shared/services/products.service';
import { ProductModel } from '../shared/models/product-model.model';
import { CartModel } from '../shared/models/cart-model.model';
import { CartService } from '../shared/services/cart.service';
import { DiscountsService } from '../shared/services/discounts.service';
import { DiscountModel } from '../shared/models/discount-model.model';
import { AuthenticationService } from '../shared/services/authentication.service';
import { AbstractControl, FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../shared/global-constants.model';
 
@Component({
  selector: 'app-productsingle',
  templateUrl: './productsingle.component.html',
  styleUrls: ['./productsingle.component.css']
})
export class ProductsingleComponent implements OnInit {
  ProductDetails: ProductModel = new ProductModel();
  DiscountDetails: DiscountModel = new DiscountModel();
  actualProductPrice: number =0;
  submitted: boolean = false;
  cartForm: UntypedFormGroup = new UntypedFormGroup({
      quantity: new UntypedFormControl(''),
  });

  constructor(public route : ActivatedRoute,
     public ProductService : ProductService,
     public CartService : CartService,
    public authService: AuthenticationService,
    public DiscountsService: DiscountsService,
    public router:Router
    ) { }

  async getById(id: number): Promise<void> {
   await  this.ProductService.getById(id).subscribe(async result => {
      this.ProductDetails = result;
      await this.getDiscountFunction(result);
      await this.actualPriceFunction(result,this.DiscountDetails);
      
    });
  }
  createImgPath(serverpath: string) {
    return GlobalConstants.apiURL + serverpath;
  }
 async getDiscountFunction(result: ProductModel) {
     await this.DiscountsService.GetById(result.discountId!).subscribe(
      res => {
        this.DiscountDetails = res;

      }
    );
  }

  async actualPriceFunction(result:ProductModel,productDiscount:DiscountModel):  Promise<void>{
   this.actualProductPrice= Number(result.price)+Number(productDiscount.value);
  }

  async onAddToCart(formValues: any){
    this.submitted = true;
    if (this.cartForm.invalid) {
      return;
    }
    const formValue = { ...formValues };

    var productDetail: InModel = new InModel();
    productDetail.In.quantity = formValue.quantity;
    productDetail.In.productId = this.ProductDetails.id;
    productDetail.In.userId = Number(localStorage.getItem('userId'));
    productDetail.In.isAvailable = true;

    this.CartService.add(productDetail).subscribe({
      next: (_) => {
        document.getElementById("success-alert")!.style.display = "block";
        document.getElementById("danger-alert")!.style.display = "none";
        document.getElementById("success-alert")!.innerHTML = "added successfully";
        this.router.navigate(['/cart']);
      },
      error: (err: HttpErrorResponse) =>  {
         document.getElementById("danger-alert")!.style.display = "block";
      document.getElementById("danger-alert")!.innerHTML = "something went wrong,please try to login";
      this.router.navigate(["/login"])}

    })
  }
  ngOnInit(): void {
 
    this.route.paramMap.subscribe(params => {
      var id = Number(params.get('id'));
      this.getById(id);
    });
  }
}

class InModel {
  In: CartModel = new CartModel();
}
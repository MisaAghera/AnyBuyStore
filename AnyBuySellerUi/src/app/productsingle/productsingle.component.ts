import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../shared/services/products.service';
import { ProductModel } from '../shared/models/product-model.model';
import { AuthenticationService } from '../shared/services/authentication.service';
import { DiscountModel } from '../shared/models/discount-model.model';
import { DiscountsService } from '../shared/services/discounts.service';
import { GlobalConstants } from '../shared/global-constants.model';
import { OrderDetailsService } from '../shared/services/order-details.service';
@Component({
  selector: 'app-productsingle',
  templateUrl: './productsingle.component.html',
  styleUrls: ['./productsingle.component.css']
})
export class ProductsingleComponent implements OnInit {
  ProductDetails: ProductModel = new ProductModel();
  DiscountDetails: DiscountModel = new DiscountModel();
  public isUserAuthenticated: boolean = false;
  public isValidProductOwner: boolean = false;
  userId = Number(localStorage.getItem('userId'));
  netProfit:number=0;

  constructor(public authService: AuthenticationService,
    public route: ActivatedRoute,
    public ProductService: ProductService,
    public DiscountService: DiscountsService,
    private router: Router,
    public OrderDetailsService:OrderDetailsService) { }

  async getById(id: number): Promise<void> {
    await this.ProductService.getById(id).subscribe(async result => {
      this.ProductDetails = result;
      await this.getDiscountFunction(result);
      await this.IsValidOwner(result);
      await this.GetNetProfitOfProduct(id);
    });
  }

  async GetNetProfitOfProduct(id:number){
    await this.OrderDetailsService.GetTotalProfitByProductId(this.userId,id).subscribe(res=>{
        this.netProfit = res;
    })

  }
  
  async getDiscountFunction(result: ProductModel) {
    await this.DiscountService.GetById(result.discountId!).subscribe(
      res => {
        this.DiscountDetails = res;
      }
    );
  }

  async onDeleteProduct(productId: number) {
    await this.ProductService.delete(productId).subscribe(
      res => {
        alert("deleted successfully");
        this.router.navigate(['/products']);
      }
    )
  }

  async IsValidOwner(result: ProductModel) {
    var userId = Number(localStorage.getItem("userId"));
    this.isValidProductOwner = result.userId == userId ? true : false;

  }
  
  createImgPath(serverpath: string) {
    return GlobalConstants.apiURL + serverpath;
  }
  
  ngOnInit(): void {

    this.authService.authChanged
      .subscribe(res => {
        this.isUserAuthenticated = res;
      })

    this.route.paramMap.subscribe(params => {
      var id = Number(params.get('id'));
      this.getById(id);
    });
  }
}

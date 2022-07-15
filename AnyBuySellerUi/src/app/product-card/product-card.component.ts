import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/products.service'; 
import { ProductModel } from '../shared/models/product-model.model'; 
import { DiscountModel } from '../shared/models/discount-model.model';
import { DiscountsService } from '../shared/services/discounts.service';
import {GlobalConstants} from '../shared/global-constants.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() Product? :ProductModel;
  DiscountDetails: DiscountModel = new DiscountModel();

  constructor(public service:ProductService,
    public DiscountsService:DiscountsService) { }

  

    async getDiscountFunction(DiscountId:number|undefined) {
      await this.DiscountsService.GetById(DiscountId!).subscribe(
        res => {
          this.DiscountDetails = res;
        }
      );
    }
    
    createImgPath(serverpath: string) {
      return GlobalConstants.apiURL + serverpath;
    }

  ngOnInit(): void {
    this.Product;
    this.getDiscountFunction(this.Product!.discountId);
  }
 
}



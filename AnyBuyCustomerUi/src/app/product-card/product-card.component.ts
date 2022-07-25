import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/products.service'; 
import { ProductModel } from '../shared/models/product-model.model'; 
import { DiscountsService } from '../shared/services/discounts.service';
import { DiscountModel } from '../shared/models/discount-model.model';
import {GlobalConstants} from '../shared/global-constants.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  DiscountDetails: DiscountModel = new DiscountModel();

  @Input() Product? :ProductModel;

  createImgPath(serverpath: string) {
    return GlobalConstants.apiURL + serverpath;
  }
  constructor(public service:ProductService, public DiscountsService:DiscountsService) { }
  
  ngOnInit(): void {
    this.Product;
  }
 
}



import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../shared/services/products.service';
import { ProductModel } from '../shared/models/product-model.model';
import { CategoriesService } from '../shared/services/categories.service';
import { SubcategoriesService } from '../shared/services/subcategories.service';
import { CategoryModel } from '../shared/models/category-model.model';
import { SubcategoryModel } from '../shared/models/subcategory-model.model';
import { DiscountModel } from '../shared/models/discount-model.model';
import { DiscountsService } from '../shared/services/discounts.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  selectedCategory: CategoryModel = new CategoryModel();
  Categorylist?: CategoryModel[];
  SubcategoryList?: SubcategoryModel[];
  ProductList?: ProductModel[];
  filterTerm?: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 8;
  tableSizes: any = [3, 6, 9, 12];
  DiscountDetails: DiscountModel = new DiscountModel();
  DiscountList?:DiscountModel[];
 
  constructor(public DiscountsService: DiscountsService,public service: ProductService, public CategoriesService: CategoriesService, public SubcategoriesService: SubcategoriesService) { }

  getProducts(): void {
    this.service.getAll().subscribe(result => {
      this.ProductList = result;
    });
  }
  

  getProductsBysubcategory(subcategoryId: number): void {
    this.service.getAllBySubcategoryId(subcategoryId).subscribe(result => {
      this.ProductList = result;
    });
  }

  getProductsByDiscount(discountId: number){
    this.service.GetAllProductByDiscountId(discountId).subscribe(result => {
      this.ProductList = result;
    });
}
async getDiscountFunction() {
  await this.DiscountsService.getAll().subscribe(
    res => {
      this.DiscountList = res;
    }
  );
}
  OnClickPriceHighToLow(): void {
    this.ProductList = this.ProductList?.sort((a, b) => b.price - a.price);
  }

  OnClickPriceLowToHigh(): void {
    this.ProductList = this.ProductList?.sort((a, b) => a.price - b.price);
  }

  OnClickAscendingName(): void {
    this.ProductList = this.ProductList?.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  }

  OnClicDescendingName(): void {
    this.ProductList = this.ProductList?.sort((a, b) => a.name > b.name ? -1 : a.name < b.name ? 1 : 0);
  }

  getCategories(): void {
    this.CategoriesService.getAll().subscribe(result => {
      this.Categorylist = result;
    });
  }

  getCurrentProducts(): void {
    this.ProductList = this.ProductList;
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCurrentProducts();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCurrentProducts();
  }

  onSelectSubcategory(CategoryId: number): void {
    this.SubcategoriesService.getAll(CategoryId).subscribe(result => {
      this.SubcategoryList = result;
    });
  }

  ngOnInit() {
    this.getCategories();
    this.getProducts();
    this.getDiscountFunction();

  }

}

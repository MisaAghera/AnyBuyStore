import { Component, OnInit } from '@angular/core';
import { SubcategoryModel } from '../shared/models/subcategory-model.model';
import { CategoryModel } from '../shared/models/category-model.model'; 
import { CategoriesService } from '../shared/services/categories.service';
import { SubcategoriesService } from '../shared/services/subcategories.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public CategoryService: CategoriesService, public SubcategoryService: SubcategoriesService) { }
  CategoryId?: number;
  SubcategoryId: number = 0;
  Categorylist? : CategoryModel[];
  SubcategoryList?: SubcategoryModel[];

  getCategories(): void {
    this.CategoryService.getAll().subscribe(result =>{
      this.Categorylist = result;
    });
  }


  getSubategories(CategoryId: number): void {
    this.SubcategoryService.getAll(CategoryId).subscribe(result => {
      this.SubcategoryList = result;
    });
  }

  getSubcategoryId(SubcategoryId: number) {
    this.SubcategoryId = SubcategoryId;
  }

  //  getProducts(SubcategoryId: number): void{
  //     this.ProductService.getAllBySubcategoryId(SubcategoryId);
  //   }
  
  ngOnInit(): void {
    this.getCategories();

  }


  //Slider settings
  slideConfig = { "slidesToShow": 1, "slidesToScroll": 1 };
}
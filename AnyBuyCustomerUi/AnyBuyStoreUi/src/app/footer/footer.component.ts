import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../shared/models/category-model.model';
import { CategoriesService } from '../shared/services/categories.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  Categorylist?:CategoryModel[];

  constructor(public CategoryService:CategoriesService) { }

  
  getCategories(): void {
    this.CategoryService.getAll().subscribe(result =>{
      this.Categorylist = result;
    });
  }
  ngOnInit(): void {
    this.getCategories();
  }

}

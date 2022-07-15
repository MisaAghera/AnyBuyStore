import { Component, OnInit ,Input} from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { CategoryModel } from '../shared/models/category-model.model';
import {  Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {
  CategoryId?:number;
  @Input() category :CategoryModel = new CategoryModel();
  @Output() IdEvent = new EventEmitter<number>();

  constructor(public service:CategoriesService) { }

  sendSubcategoryId(CategoryId: number): void{
    this.IdEvent.emit(CategoryId);
  }

  ngOnInit(): void {
    this.category
  }

}

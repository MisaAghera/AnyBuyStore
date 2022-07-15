import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { SubcategoryModel } from '../shared/models/subcategory-model.model';
import { SubcategoriesService } from '../shared/services/subcategories.service';
@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css']
})
export class SubcategoriesComponent implements OnInit {
  @Input() subcategory :SubcategoryModel = new SubcategoryModel();
  @Output() SubcategoryIdEvent = new EventEmitter<number>();

  constructor(public service:SubcategoriesService) { }

  ngOnInit(): void {
    this.subcategory
  }

  sendSubCategoryId(SubCategoryId: number): void{
    this.SubcategoryIdEvent.emit(SubCategoryId);
  }

}




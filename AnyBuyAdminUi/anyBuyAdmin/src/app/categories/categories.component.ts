import { Component, OnInit, Input } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { SubcategoriesService } from '../shared/services/subcategories.service';
import { CategoryModel } from '../shared/models/category-model.model';
import { SubcategoryModel } from '../shared/models/subcategory-model.model';
import { GlobalConstants } from '../shared/global-constants.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  selectedCategory: CategoryModel = new CategoryModel();
  Categorylist?: CategoryModel[];
  SubcategoryList?: SubcategoryModel[];

  newCategoryForm: FormGroup = new FormGroup({
    categoryId: new FormControl(''),
    categoryName: new FormControl(''),
  });
  submitted: boolean = false;

  filterTerm?: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 8;
  tableSizes: any = [3, 6, 9, 12];

  constructor(public CategoriesService: CategoriesService,
    public SubcategoriesService: SubcategoriesService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

    get f(): { [key: string]: AbstractControl } {
      return this.newCategoryForm.controls;
    }
  
  getcategories(): void {
    this.CategoriesService.getAll().subscribe(result => {
      this.Categorylist = result;
    });
  }


  async onDeleteCategory(Id: number) {
    var confirmation = confirm("are you sure you want to delete this category?");
    if (confirmation) {
      await this.CategoriesService.delete(Id).subscribe(res => {
        location.reload();
      }
      )
    };
  }

  addValidaiton(){
    this.newCategoryForm = this.formBuilder.group({
      categoryId:[''],
      categoryName:['',[Validators.required]]
    });
  }

  async onEditCategory(categoryId: any) {
    await this.newCategoryForm.reset();
    await this.addValidaiton();
    await this.CategoriesService.getById(categoryId).subscribe(
      async res => {
        await this.setValuesInForm(res);
      }
    )
  }

  resetForm(){
    this.submitted = false;
    this.newCategoryForm.reset();
 }

  setValuesInForm(res: any) {
    this.newCategoryForm.controls["categoryId"].setValue(res.id);
    this.newCategoryForm.controls["categoryName"].setValue(res.name);
  }

  async onAddEditSubmit(formValues: any) {
    this.submitted = true;
    if (this.newCategoryForm.invalid) {
      return;
    }
    const formValue = { ...formValues };
    var categoryDetails: InModelCategory = new InModelCategory();
    categoryDetails.In.id = formValue.categoryId;
    categoryDetails.In.name = formValue.categoryName;
    if (categoryDetails.In.id == 0 || categoryDetails.In.id == null) {
      await this.CategoriesService.add(categoryDetails).subscribe(res => {
        alert('added successfully');
        location.reload();
      });
    }
    else{
      await this.CategoriesService.update(categoryDetails).subscribe(res => {
        alert('edited successfully');
        location.reload();
      });
    }
  }

  getCurrentCategories(): void {
    this.Categorylist = this.Categorylist;
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCurrentCategories();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCurrentCategories();
  }

  ngOnInit() {
    this.getcategories();
  }

}
class InModelCategory {
  In: CategoryModel = new CategoryModel();
}
import { Component, OnInit, Input } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { SubcategoriesService } from '../shared/services/subcategories.service';
import { CategoryModel } from '../shared/models/category-model.model';
import { SubcategoryModel } from '../shared/models/subcategory-model.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css']
})
export class SubcategoriesComponent implements OnInit {
  selectedCategory: CategoryModel = new CategoryModel();
  Categorylist?: CategoryModel[];
  SubcategoryList?: SubcategoryModel[];

  newSubcategoryForm: FormGroup = new FormGroup({
    subcategoryId: new FormControl(''),
    categoryId: new FormControl(''),
    subcategoryName: new FormControl(''),
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
    return this.newSubcategoryForm.controls;
  }

  getCategories(): void {
    this.CategoriesService.getAll().subscribe(result => {
      this.Categorylist = result;
    });
  }


  getsubcategories(): void {
    this.SubcategoriesService.getAllSubcategories().subscribe(result => {
      this.SubcategoryList = result;
    });
  }


  async onDeleteCategory(Id: number) {
    var confirmation = confirm("are you sure you want to delete this subcategory?");
    if (confirmation) {
      await this.SubcategoriesService.delete(Id).subscribe(res => {
        location.reload();
      }
      )
    };
  }

  addValidaiton() {
    this.newSubcategoryForm = this.formBuilder.group({
      categoryId: [''],
      subcategoryId: [''],
      subcategoryName: ['', [Validators.required]]
    });
  }

  resetForm(){
    this.submitted = false;
     this.newSubcategoryForm.reset();
  }

  async onEditCategory(subcategoryId: any) {
    await this.getCategories();
    await this.addValidaiton();
    await this.SubcategoriesService.getById(subcategoryId).subscribe(
      async res => {
        await this.setValuesInForm(res);
      }
    )

  }
  setValuesInForm(res: any) {
    this.newSubcategoryForm.controls["subcategoryId"].setValue(res.id);
    this.newSubcategoryForm.controls["categoryId"].setValue(res.productCategoryId);
    this.newSubcategoryForm.controls["subcategoryName"].setValue(res.name);
  }

  async onAddEditSubmit(formValues: any) {
    this.submitted = true;
    if (this.newSubcategoryForm.invalid) {
      return;
    }
    const formValue = { ...formValues };
    var subcategoryDetails: InModelSubcategory = new InModelSubcategory();
    subcategoryDetails.In.id = formValue.subcategoryId;
    subcategoryDetails.In.productCategoryId = formValue.categoryId;
    subcategoryDetails.In.name = formValue.subcategoryName;
    if (subcategoryDetails.In.id == 0 || subcategoryDetails.In.id == null) {
      subcategoryDetails.In.id = 0;
      await this.SubcategoriesService.add(subcategoryDetails).subscribe(res => {
        alert('added successfully');
        location.reload();
      });
    }
    else {
      await this.SubcategoriesService.update(subcategoryDetails).subscribe(res => {
        alert('edited successfully');
        location.reload();
      });
    }
  }

  getCurrentSubcategories(): void {
    this.SubcategoryList = this.SubcategoryList;
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCurrentSubcategories();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCurrentSubcategories();
  }

  onSelectSubcategory(CategoryId: number): void {
    this.SubcategoriesService.getAll(CategoryId).subscribe(result => {
      this.SubcategoryList = result;
    });
  }

  removeFilters(){
    this.getCategories();
    location.reload();
  }
  ngOnInit() {
    this.getCategories();
    this.getsubcategories();
  }

}
class InModelSubcategory {
  In: SubcategoryModel = new SubcategoryModel();
}
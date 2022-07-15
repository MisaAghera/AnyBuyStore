import { Component, OnInit, Input } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { SubcategoriesService } from '../shared/services/subcategories.service';
import { CategoryModel } from '../shared/models/category-model.model';
import { SubcategoryModel } from '../shared/models/subcategory-model.model';
import { GlobalConstants } from '../shared/global-constants.model';
import { DiscountModel } from '../shared/models/discount-model.model';
import { DiscountsService } from '../shared/services/discounts.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css']
})
export class DiscountsComponent implements OnInit {
  Discountlist?: DiscountModel[];

  newDiscountForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    type: new FormControl(''),
    value: new FormControl(''),
  });
  submitted: boolean = false;

  filterTerm?: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 8;
  tableSizes: any = [3, 6, 9, 12];

  constructor(
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private DiscountsService:DiscountsService) { }

    get f(): { [key: string]: AbstractControl } {
      return this.newDiscountForm.controls;
    }
  
  getDiscounts(): void {
    this.DiscountsService.getAll().subscribe(result => {
      this.Discountlist = result;
    });
  }

  async onDeleteDiscount(Id: number) {
    var confirmation = confirm("are you sure you want to delete this discount?");
    if (confirmation) {
      await this.DiscountsService.delete(Id).subscribe(res => {
        location.reload();
      }
      )
    };
  }

  addValidaiton(){
    this.newDiscountForm = this.formBuilder.group({
      id:[''],
      type:['',[Validators.required]],
      value:['',[Validators.required]]
    });
  }

  async onEditDiscount(Id: any) {
    await this.newDiscountForm.reset();
    await this.addValidaiton();
    await this.DiscountsService.GetById(Id).subscribe(
      async res => {
        await this.setValuesInForm(res);
      }
    )
  }

  resetForm(){
    this.submitted = false;
    this.newDiscountForm.reset();
 }

  setValuesInForm(res: any) {
    this.newDiscountForm.controls["id"].setValue(res.id);
    this.newDiscountForm.controls["type"].setValue(res.type);
    this.newDiscountForm.controls["value"].setValue(res.value);
  }

  async onAddEditSubmit(formValues: any) {
    this.submitted = true;
    if (this.newDiscountForm.invalid) {
      return;
    }
    const formValue = { ...formValues };
    var Details: InModelDiscount = new InModelDiscount();
  
    Details.In.id = formValue.id;
    Details.In.type = formValue.type;
    Details.In.value = formValue.value;
    if (Details.In.id == 0 || Details.In.id == null) {
      Details.In.id =0;
      await this.DiscountsService.add(Details).subscribe(res => {
        alert('added successfully');
        location.reload();
      });
    }
    else{
      await this.DiscountsService.update(Details).subscribe(res => {
        alert('edited successfully');
        location.reload();
      });
    }
  }

  getCurrentDiscounts(): void {
    this.Discountlist = this.Discountlist;
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCurrentDiscounts();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCurrentDiscounts();
  }

  ngOnInit() {
    this.getDiscounts();
  }

}
class InModelDiscount {
  In: DiscountModel = new DiscountModel();
}
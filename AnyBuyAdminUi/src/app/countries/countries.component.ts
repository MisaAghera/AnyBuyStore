import { Component, OnInit, Input } from '@angular/core';
import { SubcategoriesService } from '../shared/services/subcategories.service';
import { SubcategoryModel } from '../shared/models/subcategory-model.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CountryModel } from '../shared/models/country-model.model';
import { CountriesService } from '../shared/services/countries.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  selectedCategory: CountryModel = new CountryModel();
  Countrylist?: CountryModel[];

  newCountryForm: FormGroup = new FormGroup({
    Id: new FormControl(''),
    Name: new FormControl(''),
  });
  submitted: boolean = false;

  filterTerm?: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 8;
  tableSizes: any = [3, 6, 9, 12];

  constructor(public CountriesService: CountriesService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

    get f(): { [key: string]: AbstractControl } {
      return this.newCountryForm.controls;
    }
  
  getcountries(): void {
    this.CountriesService.getAll().subscribe(result => {
      this.Countrylist = result;
    });
  }


  async onDeleteCategory(Id: number) {
    var confirmation = confirm("are you sure you want to delete this country?");
    if (confirmation) {
      this.CountriesService.delete(Id).subscribe(res => {
        this.getcountries();
      }
      )
    };
  }

  addValidaiton(){
    this.newCountryForm = this.formBuilder.group({
      Id:[''],
      Name:['',[Validators.required]]
    });
  }

  async onEditCountryDisplay(Id: any) {
    await this.newCountryForm.reset();
    await this.addValidaiton();
    await this.CountriesService.getById(Id).subscribe(
      async res => {
        await this.setValuesInForm(res);
      }
    )
  }

  resetForm(){
    this.submitted = false;
    this.newCountryForm.reset();
 }

  setValuesInForm(res: any) {
    this.newCountryForm.controls["Id"].setValue(res.id);
    this.newCountryForm.controls["Name"].setValue(res.name);
  }

  async onAddEditSubmit(formValues: any) {
    this.submitted = true;
    if (this.newCountryForm.invalid) {
      return;
    }
    const formValue = { ...formValues };
    var countryDetails: InModelCountry = new InModelCountry();
    countryDetails.In.id = formValue.Id||0;
    countryDetails.In.name = formValue.Name;
    if (countryDetails.In.id == 0 || countryDetails.In.id == null) {
      await this.CountriesService.add(countryDetails).subscribe(res => {
        alert('added successfully');
        this.getcountries();
      });
    }
    else{
      await this.CountriesService.update(countryDetails).subscribe(res => {
        alert('edited successfully');
        this.getcountries();
      });
    }
  }

  getCurrentCategories(): void {
    this.Countrylist = this.Countrylist;
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
    this.getcountries();
  }

}
class InModelCountry {
  In: CountryModel = new CountryModel();
}
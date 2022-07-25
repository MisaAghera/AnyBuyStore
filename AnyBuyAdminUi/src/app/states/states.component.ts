import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CityModel } from '../shared/models/city-model.model';
import { StateModel } from '../shared/models/state-model.model';
import { StatesService } from '../shared/services/states.service';
import { CitiesService } from '../shared/services/cities.service';
import { CountriesService } from '../shared/services/countries.service';
import { CountryModel } from '../shared/models/country-model.model';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent implements OnInit {

  selectedCountry: CountryModel = new CountryModel();
  Statelist?: StateModel[];
  CountryList?: CountryModel[];

  newStateForm: FormGroup = new FormGroup({
    Id: new FormControl(''),
    CountryId: new FormControl(''),
    Name: new FormControl(''),
  });
  submitted: boolean = false;

  filterTerm?: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 8;
  tableSizes: any = [3, 6, 9, 12];

  constructor(public StatesService: StatesService,
    public CountriesService: CountriesService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  get f(): { [key: string]: AbstractControl } {
    return this.newStateForm.controls;
  }

  getStates(): void {
    this.StatesService.getAll().subscribe(result => {
      this.Statelist = result;
    });
  }


  getCountries(): void {
    this.CountriesService.getAll().subscribe(result => {
      this.CountryList = result;
    });
  }


  async onDeleteState(Id: number) {
    var confirmation = confirm("are you sure you want to delete this state?");
    if (confirmation) {
      await this.StatesService.delete(Id).subscribe(res => {
        this.getStates();
      }
      )
    };
  }

  addValidaiton() {
    this.newStateForm = this.formBuilder.group({
      Id: [''],
      CountryId: [''],
      Name: ['', [Validators.required]]
    });
  }

  resetForm(){
    this.submitted = false;
     this.newStateForm.reset();
  }

  async onEditState(Id: any) {
    await this.getStates();
    await this.addValidaiton();
    await this.StatesService.getById(Id).subscribe(
      async res => {
        await this.setValuesInForm(res);
      }
    )
  }

  setValuesInForm(res: any) {
    this.newStateForm.controls["Id"].setValue(res.id);
    this.newStateForm.controls["CountryId"].setValue(res.countryId);
    this.newStateForm.controls["Name"].setValue(res.name);
  }

  async onAddEditSubmit(formValues: any) {
    this.submitted = true;
    if (this.newStateForm.invalid) {
      return;
    }
    const formValue = { ...formValues };
    var Details: InModelState = new InModelState();
    Details.In.id = formValue.Id;
    Details.In.countryId = formValue.CountryId;
    Details.In.name = formValue.Name;
    if (Details.In.id == 0 || Details.In.id == null) {
      Details.In.id = 0;
      await this.StatesService.add(Details).subscribe(res => {
        alert('added successfully');
        this.getStates();
      });
    }
    else {
      await this.StatesService.update(Details).subscribe(res => {
        alert('edited successfully');
        this.getStates();
      });
    }
  }

  getCurrentStates(): void {
    this.Statelist = this.Statelist;
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCurrentStates();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCurrentStates();
  }

  onSelectStates(countryId: number): void {
    this.StatesService.getAllFromCountryId(countryId).subscribe(result => {
      this.Statelist = result;
    });
  }

  removeFilters(){
    this.getStates();
  }
  ngOnInit() {
    this.getCountries();
    this.getStates();
  }

}
class InModelState {
  In: StateModel = new StateModel();
}

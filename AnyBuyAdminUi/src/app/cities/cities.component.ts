import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CityModel } from '../shared/models/city-model.model';
import { StateModel } from '../shared/models/state-model.model';
import { StatesService } from '../shared/services/states.service';
import { CitiesService } from '../shared/services/cities.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {

  selectedState: StateModel = new StateModel();
  Statelist?: StateModel[];
  cityList?: CityModel[];

  newCityForm: FormGroup = new FormGroup({
    Id: new FormControl(''),
    StateId: new FormControl(''),
    Name: new FormControl(''),
  });
  submitted: boolean = false;

  filterTerm?: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 8;
  tableSizes: any = [3, 6, 9, 12];

  constructor(public StatesService: StatesService,
    public CitiesService: CitiesService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  get f(): { [key: string]: AbstractControl } {
    return this.newCityForm.controls;
  }

  getStates(): void {
    this.StatesService.getAll().subscribe(result => {
      this.Statelist = result;
    });
  }


  getCities(): void {
    this.CitiesService.getAll().subscribe(result => {
      this.cityList = result;
    });
  }


  async onDeleteCity(Id: number) {
    var confirmation = confirm("are you sure you want to delete this city?");
    if (confirmation) {
      await this.CitiesService.delete(Id).subscribe(res => {
        this.getCities();
      }
      )
    };
  }

  addValidaiton() {
    this.newCityForm = this.formBuilder.group({
      Id: [''],
      StateId: [''],
      Name: ['', [Validators.required]]
    });
  }

  resetForm(){
    this.submitted = false;
     this.newCityForm.reset();
  }

  async onEditCity(StateId: any) {
    await this.getCities();
    await this.addValidaiton();
    await this.CitiesService.getById(StateId).subscribe(
      async res => {
        await this.setValuesInForm(res);
      }
    )
  }

  setValuesInForm(res: any) {
    this.newCityForm.controls["Id"].setValue(res.id);
    this.newCityForm.controls["StateId"].setValue(res.stateId);
    this.newCityForm.controls["Name"].setValue(res.name);
  }

  async onAddEditSubmit(formValues: any) {
    this.submitted = true;
    if (this.newCityForm.invalid) {
      return;
    }
    const formValue = { ...formValues };
    var Details: InModelCity = new InModelCity();
    Details.In.id = formValue.Id;
    Details.In.stateId = formValue.StateId;
    Details.In.name = formValue.Name;
    if (Details.In.id == 0 || Details.In.id == null) {
      Details.In.id = 0;
      await this.CitiesService.add(Details).subscribe(res => {
        alert('added successfully');
        this.getCities();
      });
    }
    else {
      await this.CitiesService.update(Details).subscribe(res => {
        alert('edited successfully');
        this.getCities();
      });
    }
  }

  getCurrentCities(): void {
    this.cityList = this.cityList;
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCurrentCities();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCurrentCities();
  }

  onSelectCities(StateId: number): void {
    this.CitiesService.getAllFromStateId(StateId).subscribe(result => {
      this.cityList = result;
    });
  }

  removeFilters(){
    this.getCities();
  }
  ngOnInit() {
    this.getCities();
    this.getStates();
  }

}
class InModelCity {
  In: CityModel = new CityModel();
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { AddressModel } from '../shared/models/address-model';
import { AddressService } from '../shared/services/address.service';
import { Output, EventEmitter } from '@angular/core';
import { CountryModel } from '../shared/models/country-model.model';
import { StateModel } from '../shared/models/state-model.model';
import { StatesService } from '../shared/services/states.service';
import { CitiesService } from '../shared/services/cities.service';
import { CountriesService } from '../shared/services/countries.service';
import { CityModel } from '../shared/models/city-model.model';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {
  selectedCountry: CountryModel = new CountryModel();
  selectedState: StateModel = new StateModel();
  StateList?: StateModel[];
  CountryList?: CountryModel[];
  CityList?: CityModel[];

  submitted: boolean = false;
  addressId: number = 0;
  addressList?: AddressModel[];
  IschangeAddress: boolean = false;

  @Output() sendAddressIdEvent = new EventEmitter<number>();

  AddressForm: UntypedFormGroup = new UntypedFormGroup({
    addressId: new UntypedFormControl(''),
    house: new UntypedFormControl(''),
    street: new UntypedFormControl(''),
    city: new UntypedFormControl(''),
    state: new UntypedFormControl(''),
    country: new UntypedFormControl(''),
    zipCode: new UntypedFormControl(''),
    type: new UntypedFormControl(''),
  });
  UserId: number = Number(localStorage.getItem('userId'));

  constructor(public AddressService: AddressService,
    private formBuilder: UntypedFormBuilder,
    public route: ActivatedRoute,
    public StatesService: StatesService,
    public CitiesService: CitiesService,
    public CountriesService: CountriesService,) { }

  sendAddressIdToParent(id: number) {
    this.sendAddressIdEvent.emit(id);
  }

  async onSelectState(CountryId: number): Promise<void> {
    await this.StatesService.getAllFromCountryId(CountryId).subscribe(result => {
      this.StateList = result;
    });
  }

  async onSelectCity(StateId: number): Promise<void> {
    await this.CitiesService.getAllFromStateId(StateId).subscribe(result => {
      this.CityList = result;
    });
  }

  async getCountries(): Promise<void> {
    await this.CountriesService.getAll().subscribe(result => {
      this.CountryList = result;
    });
  }


  get f(): { [key: string]: AbstractControl } {
    return this.AddressForm.controls;
  }

  onReset(): void {
    document.getElementById("success-alert")!.style.display = "none";
    this.submitted = false;
    this.IschangeAddress = false; 
    this.AddressForm.reset();
  }

  async onSubmit(formValues: any) {
    this.submitted = true;
    if (this.AddressForm.invalid) {
      return;
    }

    const formValue = { ...formValues };

    var AddressDetails: InModel = new InModel();
    AddressDetails.In.house = formValue.house;
    AddressDetails.In.street = formValue.street;
    AddressDetails.In.cityId = formValue.city;
    AddressDetails.In.stateId = formValue.state;
    AddressDetails.In.countryId = formValue.country;
    AddressDetails.In.zipCode = formValue.zipCode;
    AddressDetails.In.addressType = formValue.type;
    
    AddressDetails.In.userId = Number(localStorage.getItem("userId"));
    if (this.IschangeAddress == false && (formValue.addressId == null||formValue.addressId == "")) {
      AddressDetails.In.id =0;
      await this.AddressService.add(AddressDetails).subscribe({
        next: res => {
          document.getElementById("success-alert")!.style.display = "block";
          document.getElementById("danger-alert")!.style.display = "none";
          document.getElementById("success-alert")!.innerHTML = "added successfully";
          document.getElementById('submitAddress')!.innerHTML = 'change address';
          this.IschangeAddress = true;
          this.addressId = res;
          this.AddressService.getAllByUserId(this.UserId).subscribe(res => {
            this.addressList = res;
          })
          this.sendAddressIdToParent(res);
        },
        error: (err: HttpErrorResponse) => {
          document.getElementById("danger-alert")!.style.display = "block";
          document.getElementById("success-alert")!.style.display = "none";
          document.getElementById("danger-alert")!.innerHTML = "something went wrong";
        }
      })
    }

    else {
      AddressDetails.In.id = Number(formValue.addressId);
      await this.AddressService.update(AddressDetails).subscribe({
        next: res => {
          document.getElementById("success-alert")!.style.display = "block";
          document.getElementById("danger-alert")!.style.display = "none";
          document.getElementById("success-alert")!.innerHTML = "updated successfully";
          document.getElementById("submitAddress")!.innerHTML = "change Address";
          this.IschangeAddress = true;
          this.addressId = res;
          this.sendAddressIdToParent(res);
        },
        error: (err: HttpErrorResponse) => {
          document.getElementById("danger-alert")!.style.display = "block";
          document.getElementById("success-alert")!.style.display = "none";
          document.getElementById("danger-alert")!.innerHTML = "something went wrong";
        }
      })
    }
  }

  async setValuesInForm(res: any) {
    document.getElementById("success-alert")!.style.display = "none";
    this.AddressForm.controls["addressId"].setValue(res.id);
    this.AddressForm.controls["house"].setValue(res.house);
    this.AddressForm.controls["street"].setValue(res.street);
    this.AddressForm.controls["country"].setValue(res.countryId);
    this.AddressForm.controls["zipCode"].setValue(res.zipCode);
    this.AddressForm.controls["type"].setValue(res.addressType);
    this.StatesService.getAllFromCountryId(res.countryId).subscribe(result=>{
      this.StateList = result;
      this.AddressForm.controls["state"].setValue(res.stateId);
      this.CitiesService.getAllFromStateId(res.stateId).subscribe(result2=>{
         this.CityList = result2;
         this.AddressForm.controls["city"].setValue(res.cityId); 
         })
    })
  }

  async initialValues(addressId: number) {
    await this.AddressService.getById(addressId).subscribe(
      async res => {
        await this.setValuesInForm(res);
      }
    )
  }

  async addressesOfUser(userId: number) {
    this.AddressService.getAllByUserId(userId).subscribe(res => {
      this.addressList = res;
    });
  }

  async onClickShowAddress(addressId: number) {
    await this.AddressService.getById(addressId).subscribe(async res => {
      await this.setValuesInForm(res);
    })
  }

 

  ngOnInit(): void {
    this.AddressForm = this.formBuilder.group({
      addressId: [''],
      house: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
    this.addressesOfUser(this.UserId);
    this.getCountries();
    
  }
}


class InModel {
  In: AddressModel = new AddressModel();
}
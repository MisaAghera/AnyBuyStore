import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { AddressModel } from '../shared/models/address-model';
import { AddressService } from '../shared/services/address.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
 export class EditAddressComponent implements OnInit {
   submitted: boolean = false;
  addressId: number = 0;
  addressList?: AddressModel[];
   IschangeAddress:boolean=false;
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
    public route: ActivatedRoute) { }

  sendAddressIdToParent(id:number){
    this.sendAddressIdEvent.emit(id);
  }
    
  get f(): { [key: string]: AbstractControl } {
    return this.AddressForm.controls;
  }

  onReset(): void {
    this.submitted = false;
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
    AddressDetails.In.city = formValue.city;
    AddressDetails.In.state = formValue.state;
    AddressDetails.In.country = formValue.country;
    AddressDetails.In.zipCode = formValue.zipCode;
    AddressDetails.In.addressType = formValue.type;

     AddressDetails.In.userId = Number(localStorage.getItem("userId"));
    if(this.IschangeAddress==false && this.addressId==0){
      await this.AddressService.add(AddressDetails).subscribe({
        next:res => {
          document.getElementById("success-alert")!.style.display = "block";
          document.getElementById("danger-alert")!.style.display = "none";
          document.getElementById("success-alert")!.innerHTML = "added successfully";
          document.getElementById('submitAddress')!.innerHTML = 'change address';
          this.IschangeAddress = true;
          this.addressId = res;
          this.sendAddressIdToParent(res);
        },
        error: (err: HttpErrorResponse) => {
          document.getElementById("danger-alert")!.style.display = "block";
          document.getElementById("danger-alert")!.innerHTML = "something went wrong";
        }
      })
    }

    else {
      AddressDetails.In.id = Number(this.addressId);
      await this.AddressService.update(AddressDetails).subscribe({
        next:res=> {
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
          document.getElementById("danger-alert")!.innerHTML = "something went wrong";
        }
      })
    }
  }

  async setValuesInForm(res: any) {
    this.AddressForm.controls["addressId"].setValue(res.id);
    this.AddressForm.controls["house"].setValue(res.house);
    this.AddressForm.controls["street"].setValue(res.street);
    this.AddressForm.controls["city"].setValue(res.city);
    this.AddressForm.controls["state"].setValue(res.state);
    this.AddressForm.controls["country"].setValue(res.country);
    this.AddressForm.controls["zipCode"].setValue(res.zipCode);
    this.AddressForm.controls["type"].setValue(res.addressType);
    this.addressId = res.id;
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
      addressId:[''],
      house: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
    this.addressesOfUser(this.UserId);    
  }
 }


class InModel {
  In: AddressModel = new AddressModel();
 }
import { Component, OnInit, Input } from '@angular/core';
import { GlobalConstants } from '../shared/global-constants.model';
import { OrderDetailsModel } from '../shared/models/order-details-model';
import { OrderDetailsService } from '../shared/services/order-details.service';
import { OrderModel } from '../shared/models/order-model';
import { OrderService } from '../shared/services/order.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DiscountsService } from '../shared/services/discounts.service';
import { AddressService } from '../shared/services/address.service';
import { AddressModel } from '../shared/models/address-model';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  OrderList?: OrderModel[];
  OrderDetailsList?: OrderDetailsModel[];
  OrderDetailDetails?:OrderDetailsModel;
  AddressDetails?:AddressModel;
  filterTerm?: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 8;
  tableSizes: any = [3, 6, 9, 12];
  discountValue?:number;
  userId:number=0;
  netProfit:number=0;
  newOrderDetailsForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    productId: new FormControl(''),
    orderId: new FormControl(''),
    discountId: new FormControl(''),
    quantity: new FormControl(''),
    status: new FormControl(''),
    price: new FormControl(''),
  });

  YearForm: FormGroup = new FormGroup({
    year: new FormControl(''),
  });


  getOrderAddress(orderDetailsId:number){
    this.OrderDetailsService.getById(orderDetailsId).subscribe(res=>{
      this.AddressService.getByOrderId(res.orderId).subscribe(res=>{
        this.AddressDetails = res;
        console.log(this.AddressDetails);
      });
    });
  }
  onSubmitFilterByYear(Year:string){

    var year = Number(Year); 
    this.OrderDetailsService.GetAllOrderDetailsOfMyProductsByYear(this.userId,year).subscribe(res=>{
      this.OrderDetailsList = res;
    })
    this.OrderDetailsService.GetTotalProfitOfMyProductsOfThisYear(this.userId,year).subscribe(res=>{
      this.netProfit = res;
    })
  }

  addValidaiton(){
    this.newOrderDetailsForm = this.formBuilder.group({
      id:[''],
      productId:[''],
      orderId:[''],
      discountId:[''],
      quantity:[''],
      status:[''],
      price:[''],
    });
  }
  async getOrderDetailById(Id: any) {
    await this.addValidaiton();
    await this.OrderDetailsService.getById(Id).subscribe(
      async res => {
        await this.setValuesInForm(res);
      }
    )
  }

  setValuesInForm(res: any) {
    this.newOrderDetailsForm.controls["id"].setValue(res.id);
    this.newOrderDetailsForm.controls["productId"].setValue(res.productId);
    this.newOrderDetailsForm.controls["orderId"].setValue(res.orderId);
    this.newOrderDetailsForm.controls["discountId"].setValue(res.discountId);
    this.newOrderDetailsForm.controls["quantity"].setValue(res.quantity);
    this.newOrderDetailsForm.controls["status"].setValue(res.status);
    this.newOrderDetailsForm.controls["price"].setValue(res.price*res.quantity);
  }


  async onEditSubmit(formValues: any) {
    const formValue = { ...formValues };
    var Details: InModelOrderDetails = new InModelOrderDetails();
  
    Details.In.id = formValue.id;
    Details.In.productId = formValue.productId;
    Details.In.orderId = formValue.orderId;
    Details.In.discountId = formValue.discountId;
    Details.In.quantity = formValue.quantity;
    Details.In.status = formValue.status;

   
      await this.OrderDetailsService.update(Details).subscribe(res => {
        alert('edited successfully');
        location.reload();
      });
    
  }


  constructor(
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private orderService:OrderService,
    private DiscountsService:DiscountsService,
    private OrderDetailsService:OrderDetailsService,
    private AddressService:AddressService
    ) { }

   
  getOrderDetails(userId:number): void {
    this.OrderDetailsService.GetAllOrderDetailsOfMyProducts(userId).subscribe(result => {
      this.OrderDetailsList = result;
    });
    this.OrderDetailsService.GetTotalProfitsOfMyProducts(userId).subscribe(res=>{
      this.netProfit = res;
    })
  }

  displayProductSoldThisMonth(monthId:number){
    this.OrderDetailsService.GetAllOrderDetailsOfMyProductsByMonth(this.userId,monthId).subscribe(result => {
      this.OrderDetailsList = result;
    });
    this.OrderDetailsService.GetTotalProfitOfMyProductsOfThisMonth(this.userId,monthId).subscribe(res=>{
      this.netProfit = res;
    })
  }

  async onDeleteOrderDetails(Id: number) {
    var confirmation = confirm("are you sure you want to delete this order detail?");
    if (confirmation) {
      await this.OrderDetailsService.delete(Id).subscribe(res => {
      }
      )
    };
  }

  OnClickPriceHighToLow(): void {
    this.OrderDetailsList = this.OrderDetailsList?.sort((a, b) => b.price! * b.quantity! - a.price! * a.quantity!);
  }

  OnClickPriceLowToHigh(): void {
    this.OrderDetailsList = this.OrderDetailsList?.sort((a, b) => a.price! * a.quantity!- b.price! * b.quantity!);
  }

  OnClickAscendingName(): void {
    this.OrderDetailsList = this.OrderDetailsList?.sort((a, b) => a.productName! < b.productName! ? -1 : a.productName! > b.productName! ? 1 : 0);
  }

  OnClicDescendingName(): void {
    this.OrderDetailsList = this.OrderDetailsList?.sort((a, b) => a.productName! > b.productName! ? -1 : a.productName! < b.productName! ? 1 : 0);
  }


  getCurrentOrderDetails(): void {
    this.OrderDetailsList = this.OrderDetailsList;
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCurrentOrderDetails();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCurrentOrderDetails();
  }

  ngOnInit() {
    var userId = Number(localStorage.getItem('userId'));
    this.userId = userId;
    this.getOrderDetails(userId);
  }

}
class InModelOrderDetails{
  In: OrderDetailsModel = new OrderDetailsModel();
}
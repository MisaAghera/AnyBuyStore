import { Component, OnInit, Input } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { SubcategoriesService } from '../shared/services/subcategories.service';
import { CategoryModel } from '../shared/models/category-model.model';
import { SubcategoryModel } from '../shared/models/subcategory-model.model';
import { GlobalConstants } from '../shared/global-constants.model';
import { OrderDetailsModel } from '../shared/models/order-details-model';
import { OrderDetailsService } from '../shared/services/order-details.service';
import { OrderModel } from '../shared/models/order-model';
import { OrderService } from '../shared/services/order.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DiscountsService } from '../shared/services/discounts.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  OrderList?: OrderModel[];
  OrderDetailsList?: OrderDetailsModel[];
  OrderDetailDetails?:OrderDetailsModel;
  filterTerm?: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 8;
  tableSizes: any = [3, 6, 9, 12];
  newOrderDetailsForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    productId: new FormControl(''),
    orderId: new FormControl(''),
    discountId: new FormControl(''),
    quantity: new FormControl(''),
    status: new FormControl(''),
    price: new FormControl(''),
  });
  constructor(
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private OrderService:OrderService,
    private OrderDetailsService:OrderDetailsService
    ) { }

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
  
  getOrders(): void {
    this.OrderService.getAll().subscribe(result => {
      this.OrderList = result;
    });
  }

  getOrderDetailById(id:number):void{
    this.OrderDetailsService.getById(id).subscribe(result=>{
      this.setValuesInForm(result);
    })
  }

  getOrdersDetails(orderId:number): void {
    this.OrderDetailsService.getAllByOrderId(orderId).subscribe(result => {
      this.OrderDetailsList = result;
    });
  }

  async onDeleteOrder(Id: number) {
    var confirmation = confirm("are you sure you want to delete this order?");
    if (confirmation) {
      await this.OrderService.delete(Id).subscribe(res => {
        location.reload();
      }
      )
    };
  }

  async onDeleteOrderDetails(Id: number) {
    var confirmation = confirm("are you sure you want to delete this order detail?");
    if (confirmation) {
      await this.OrderDetailsService.delete(Id).subscribe();
    };
  }

  OnClickPriceHighToLow(): void {
    this.OrderList = this.OrderList?.sort((a, b) => b.totalAmount! - a.totalAmount!);
  }

  OnClickPriceLowToHigh(): void {
    this.OrderList = this.OrderList?.sort((a, b) => a.totalAmount! - b.totalAmount!);
  }

  OnClickAscendingName(): void {
    this.OrderList = this.OrderList?.sort((a, b) => a.userName! < b.userName! ? -1 : a.userName! > b.userName! ? 1 : 0);
  }

  OnClicDescendingName(): void {
    this.OrderList = this.OrderList?.sort((a, b) => a.userName! > b.userName! ? -1 : a.userName! < b.userName! ? 1 : 0);
  }


  getCurrentOrders(): void {
    this.OrderList = this.OrderList;
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCurrentOrders();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCurrentOrders();
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

  ngOnInit() {
    this.getOrders();
  }

}
class InModelOrder {
  In: OrderModel = new OrderModel();
}
class InModelOrderDetails{
  In: OrderDetailsModel = new OrderDetailsModel();
}
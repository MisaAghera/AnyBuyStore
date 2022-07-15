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
  discountValue?:number;

  constructor(
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private OrderService:OrderService,
    private DiscountsService:DiscountsService,
    private OrderDetailsService:OrderDetailsService
    ) { }

   
  getOrders(): void {
    this.OrderService.getAll().subscribe(result => {
      this.OrderList = result;
    });
  }

  getOrderDetailById(id:number):void{
    this.OrderDetailsService.getById(id).subscribe(result=>{
      this.OrderDetailDetails = result;
      this.DiscountsService.GetById(result.discountId!).subscribe(result=>{
        this.discountValue = result.value;
      })
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
      await this.OrderDetailsService.delete(Id).subscribe(res => {
      }
      )
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

  ngOnInit() {
    this.getOrders();
  }

}
class InModelOrder {
  In: OrderModel = new OrderModel();
}
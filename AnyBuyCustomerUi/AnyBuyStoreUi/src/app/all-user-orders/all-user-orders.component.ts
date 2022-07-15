import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/services/order.service';
import { OrderModel } from '../shared/models/order-model';
@Component({
  selector: 'app-all-user-orders',
  templateUrl: './all-user-orders.component.html',
  styleUrls: ['./all-user-orders.component.css']
})
export class AllUserOrdersComponent implements OnInit {
  ordersList?:OrderModel[];
  constructor(public OrderService:OrderService) { }

  getAllOrdersByUserId(){
    let userId = Number(localStorage.getItem('userId'));
    this.OrderService.getByUserId(userId).subscribe(res=>{
      this.ordersList = res
    })
  }

  ngOnInit(): void {
    this.getAllOrdersByUserId();
  }

}

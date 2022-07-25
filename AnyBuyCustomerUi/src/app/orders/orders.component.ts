import { Component, OnInit } from '@angular/core';
import { OrderDetailsModel } from '../shared/models/order-details-model';
import { OrderDetailsService } from '../shared/services/order-details.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CartService } from '../shared/services/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orderList?: OrderDetailsModel[];
  id: number = 0;
  totalPrice?: number;
  PriceToReduce: number = 0;
  quantityToAdd: number = 0;
  OrderId: number = 0;

  constructor(
    public OrderDetailsService: OrderDetailsService,
    public route: ActivatedRoute,
    public CartService: CartService,
    public router: Router) { }

  getProducts(orderId: number): void {
    this.OrderDetailsService.getAllByOrderId(orderId).subscribe(async result => {
      this.orderList = result;
      this.totalPrice = result.reduce((accumulator, object) => {
        return accumulator + (object.price! * object.quantity!);
      }, 0);
    });
  }

   async deleteItemFromOrderDetails(id: number) {
     await this.OrderDetailsService.delete(id).subscribe( res => {
      this.getProducts(this.id);
    });
  }

  onClickNavigate() {
    this.router.navigate(['/products']);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      var id = Number(params.get('id'));
      this.id = id;
      await this.getProducts(id);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { OrderModel } from '../shared/models/order-model';
import { OrderService } from '../shared/services/order.service';
import { OrderDetailsModel } from '../shared/models/order-details-model';
import { OrderDetailsService } from '../shared/services/order-details.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CartService } from '../shared/services/cart.service';
import { ProductService } from '../shared/services/products.service';
import { ProductQuantity } from '../shared/models/product-quantity';

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

  constructor(public OrderService: OrderService,
    public OrderDetailsService: OrderDetailsService,
    public route: ActivatedRoute,
    public CartService: CartService,
    public ProductService: ProductService,
    public router: Router) { }

  getProducts(orderId: number): void {
    this.OrderDetailsService.getAllByOrderId(orderId).subscribe(async result => {
      this.orderList = result;
      this.totalPrice = result.reduce((accumulator, object) => {
        return accumulator + (object.price! * object.quantity!);
      }, 0);
    });
  }

   async changeOrderTotalPrice() {
     await this.OrderService.getById(this.OrderId).subscribe( res => {
      let order = new InOrderModel();
      order.In.addressId = res.addressId;
      order.In.id = res.id;
      order.In.totalAmount = res.totalAmount! - this.PriceToReduce!;
      order.In.userId = res.userId;
       this.OrderService.update(order).subscribe();
    });
  }

   async addQuantityToProduct(id: number) {
     await this.OrderDetailsService.getById(id).subscribe(async res => {
      this.quantityToAdd = res.quantity;
      this.PriceToReduce = res.price! * res.quantity;
      this.OrderId = res.orderId;
      await this.updateProduct(res);
      await this.changeOrderTotalPrice();
    })
  }

  async updateProduct(res:any){
    await this.ProductService.getById(res.productId).subscribe( res => {
      var updateModel: InUpdateProductmodel = new InUpdateProductmodel();
      updateModel.In.id = res.id;
      updateModel.In.quantity = res.quantity + this.quantityToAdd;
       this.ProductService.updateQuantity(updateModel).subscribe();
      })
  }

   async deleteItemFromOrderDetails(id: number) {
     await this.OrderDetailsService.delete(id).subscribe( res => {
      this.getProducts(this.id);
    });
  }

  async deleteOrderitem(id: number) {
    await this.addQuantityToProduct(id);
    await this.deleteItemFromOrderDetails(id);
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


class InOrderModel {
  In: OrderModel = new OrderModel();
}

class InUpdateProductmodel {
  In: ProductQuantity = new ProductQuantity();
}
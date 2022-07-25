import { Component, OnInit } from '@angular/core';
import { CartModel } from '../shared/models/cart-model.model';
import { CartService } from '../shared/services/cart.service';
import { OrderDetailsModel } from '../shared/models/order-details-model';
import { OrderDetailsService } from '../shared/services/order-details.service';
import { OrderModel } from '../shared/models/order-model';
import { OrderService } from '../shared/services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/products.service';
import { ProductQuantity } from '../shared/models/product-quantity';
import { CheckoutService } from '../shared/services/checkout.service';
import { PaymentModel } from '../shared/models/payment-model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartProducts: CartModel[] = [];
  OrderDetailsList: OrderDetailsModel[] = [];
  orderId: number = 0;
  addressId: number = 0;
  totalPrice: number = 0;
  stripeAPIKey: any = 'pk_test_51LLOM8SDnYiiSSr8IqBLdWHR1Wy1dPJlTSQb0MMhBQ5uXNT0GDXQEzGGK7k9YHWud3CLU3w2fVFnE204HVOJMJ38009UeZWr31';
  paymentHandler: any = null;
  success: boolean = false
  failure: boolean = false
  clicked = false;

  constructor(public CartService: CartService,
    public OrderDetailsService: OrderDetailsService,
    public OrderService: OrderService,
    public ProductService: ProductService,
    public router: Router,
    private checkout: CheckoutService) { }

  userId: number = Number(localStorage.getItem('userId')) ? Number(localStorage.getItem('userId')) : 0;
  cartList?: CartModel[];

  async getAddressIdFromChild(addressId: number) {
    this.addressId = addressId;
  }

  async createOrder() {
    var order: InOrderModel = new InOrderModel();
    order.In.userId = Number(localStorage.getItem("userId"));
    order.In.addressId = this.addressId;
    this.OrderService.add(order).subscribe(async res => {
      this.orderId = res;
      await this.addOrderDetailsToOrder(this.orderId);
      await this.updateTotalPriceAndDeleteFromCart();
    });
  }

  async getAllCartProducts() {
    await this.CartService.getAllByUserId(this.userId).subscribe(async res => {
      this.cartList = res;
      this.CartService.cartCount(res.reduce((accumulator, current) => accumulator + current.quantity, 0));
    })
  }

  addItem(newItem: CartModel) {
    this.cartProducts.push(newItem);
  }

  async onClickOrderPlace() {
    if (this.addressId == 0) {
      alert("please add address before placing the order");
    }
    else {
      this.createOrder();
      document.getElementById("checkout")!.style.display = "block";
    }
  }

  async onClickDisplayAddressPanel() {
    if (this.cartList?.length != 0) {
      document.getElementById("editAddressPanel")!.style.display = "block";
      document.getElementById("checkout")!.style.display = "none";
      for (let cartItem of this.cartList!) {
        var cartDetails: InCartModel = new InCartModel();
        cartDetails.In.id = cartItem.id;
        cartDetails.In.quantity = Math.min(cartItem.quantity, cartItem.actualProductQuantity!);
        cartDetails.In.userId = Number(localStorage.getItem('userId'));
        cartDetails.In.productId = cartItem.productId;
        cartDetails.In.isAvailable = true;
        this.CartService.update(cartDetails).subscribe({
          next: (_) => {
          },
          error: (err: HttpErrorResponse) => {
            console.log("error")
          }
        });
      }
    }
  }

  updateTotalPriceAndDeleteFromCart() {
    this.makePayment(this.totalPrice);
  }

  async addOrderDetailsToOrder(orderId: number) {
    for (let cartItem of this.cartList!) {
      this.totalPrice += cartItem.productPrice! * cartItem.quantity;
      let orderDetails = await this.createOrderDetailsModel(cartItem, orderId);
      await this.ProductService.getById(cartItem.productId).subscribe(async res => {
        if (res.discountId) {
          orderDetails.In.discountId = res.discountId;
        }
        await this.OrderDetailsService.add(orderDetails).subscribe({
          next: (res) => {
          },
          error: (err: HttpErrorResponse) => {
            console.log("error")
          }
        });
      })
    }
  }

  async createOrderDetailsModel(cartItem: any, orderId: number) {
    var orderDetails: InOrderDetailsModel = new InOrderDetailsModel();
    orderDetails.In.orderId = orderId;
    orderDetails.In.productId = cartItem.productId;
    orderDetails.In.status = 'preparing';
    orderDetails.In.quantity = cartItem.quantity;
    return orderDetails;
  }


  makePayment(amount: any) {

    var totalPrice = this.totalPrice;
    var orderId = this.orderId;
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.stripeAPIKey,
      locale: 'auto',
      token: function (stripeToken: any) {
        var stripeTokenModel = new InPaymentModel();
        stripeTokenModel.in.id = stripeToken.id;
        stripeTokenModel.in.orderId = orderId;
        stripeTokenModel.in.amount = totalPrice * 100;
        stripeTokenModel.in.customerEmail = stripeToken.email;
        paymentstripe(stripeTokenModel);
      },
    });

    const paymentstripe = (stripeTokenModel: any) => {
      this.checkout.makePayment(stripeTokenModel).subscribe(res => {
        if (res === true) {
          this.OrderService.getById(this.orderId).subscribe(res => {
            let order = new InOrderModel();
            order.In.addressId = res.addressId;
            order.In.id = res.id;
            order.In.totalAmount = this.totalPrice;
            order.In.userId = res.userId;
            this.OrderService.update(order).subscribe(async res => {
            });
            var userId = Number(localStorage.getItem('userId'));
            this.CartService.deleteFromUserId(userId).subscribe();
            this.CartService.cartCount(0);
            this.OrderDetailsService.getAllByOrderId(this.orderId).subscribe(res => {
              for (let orderDetail of res) {
                let orederQuantity = orderDetail.quantity;
                this.ProductService.getById(orderDetail.productId).subscribe(res => {
                  var updateModel: InUpdateProductmodel = new InUpdateProductmodel();
                  updateModel.In.id = res.id;
                  updateModel.In.quantity = res.quantity - orederQuantity;
                  this.ProductService.updateQuantity(updateModel).subscribe();
                })
              }
            })
            this.router.navigate(['/thankyou']);
          })
        }
        else {
          this.OrderService.delete(this.orderId).subscribe(res => {
            alert("order cancelled")
          })
        }
      });
    };

    paymentHandler.open({
      name: 'make payment',
      description: 'payment details',
      amount: amount,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');

      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.stripeAPIKey,
          locale: 'auto',
          token: function (stripeToken: any) {
          },
        });
      };

      window.document.body.appendChild(script);
    }
  }

  async ngOnInit(): Promise<void> {
    this.invokeStripe();
    await this.getAllCartProducts();
  }
}


class InOrderModel {
  In: OrderModel = new OrderModel();
}

class InOrderDetailsModel {
  In: OrderDetailsModel = new OrderDetailsModel();
}

class InCartModel {
  In: CartModel = new CartModel();
}
class InUpdateProductmodel {
  In: ProductQuantity = new ProductQuantity();
}
class InPaymentModel {
  in: PaymentModel = new PaymentModel();
}
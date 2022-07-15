export class CartModel {
    id:number = 0;
    userId: number = 0;
    productId:number = 0;
    quantity:number = 0;
    isAvailable:boolean =false;
    productPrice?:number
    productName?:string
    productImgUrl?:string
    actualProductQuantity?:number
}

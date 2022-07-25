export class OrderDetailsModel {
    id:number=0;

    productId?:number;

    orderId?:number;

    discountId?:number;

    quantity:number=1;

    status:string='';

    updatedAt?:any ;
    
    price?:number;

    productName?:string;

    discountValue?:number;


}

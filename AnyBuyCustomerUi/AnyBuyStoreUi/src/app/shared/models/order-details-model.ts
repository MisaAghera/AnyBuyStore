export class OrderDetailsModel {

     id:number=0;

    productId:number=0;

    orderId:number=0;

    discountId?:number;

    quantity:number=1;

    status:string='';

    updatedAt?:any ;
    
    price?:number;

    productName?:string;

    discountValue?:number;

}

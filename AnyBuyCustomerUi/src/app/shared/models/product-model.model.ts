export class ProductModel {
    id: number = 0;
    discountId?: number;

    productSubcategoryId: number = 0;

    name: string = '';

    description: string = '';

    price: number = 0.0;

    brand: string = '';

    imageUrl: string = '';

    quantity: number = 0;
    
    discountValue?:number;

}

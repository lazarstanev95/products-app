export default class ProductEntity {
    id: string;
    name: string;
    description: string;
    price: number;
    productImage: string;
    
    constructor(data: any) {
        this.id = data._id;
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.productImage = data.productImage;
    }
}
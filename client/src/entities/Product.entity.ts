export default class ProductEntity {
    id: string;
    name: string;
    description: string;
    price: number;
    productImage: string;
    likes: string[];
    
    constructor(data: any) {
        this.id = data._id;
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.productImage = data.productImage;
        this.likes = data.likes;
    }
}
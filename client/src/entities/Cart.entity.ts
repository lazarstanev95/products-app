export default class CartEntity {
    id: string;
    name: string;
    price: number;
    productImage: string;
    quantity: number;

    constructor(data: any) {
        this.id = data.productId._id;
        this.name = data.productId.name;
        this.price = data.productId.price;
        this.productImage = this.getProductUrl(data.productId.productImage);
        this.quantity = data.quantity;
    }

    getProductUrl(productImage: string) {
        return `/image/getImage/${productImage}`;
    }
}
export default class ProductEntity {
    id: string;
    name: string;
    description: string;
    price: number;
    productImage: string;
    productImages: string[];
    likes: string[];
    
    constructor(data: any) {
        this.id = data._id;
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.productImage = this.getProductUrl(data?.productImages[0]);
        this.productImages = this.getAllProductImagesUrl(data.productImages);
        this.likes = data.likes;
    }

    getProductUrl(productImage: string) {
        if (productImage) {
            return `/image/getImage/${productImage}`;
        }
        return '';
    }

    getAllProductImagesUrl(productImages: string[]) {
        return productImages.map(item => `/image/getImage/${item}`);
    }
}
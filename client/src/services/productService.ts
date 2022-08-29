import DataService from "./DataService";
import ProductEntity from "../entities/Product.entity";

export default class ProductService {
    static productsService = '/products/products';
    static addProductService = '/products';
    static uploadImageService = '/image/uploadmulter';
    static uploadImageToStoreService = '/image/uploadImage';
    static getProductByIdService = '/products/';
    static saveProductByIdService = '/products/';
    static deleteProductByIdService = '/products/';
    static addToCartProducService = '/cart';
    static likeProductService = '/products/like/';
    static unlikeProductService = '/products/unlike/';

    static getProducts(payload: any): Promise<any> {
        return DataService.post(this.productsService, payload).then((response: any) => {
            return {
                count: response?.data?.totalCount,
                data: response?.data?.products?.map((item: any) => new ProductEntity(item)) || []
            }
        })
    }

    static uploadImage(imageFormObject: any, options: any): Promise<any> {
        return DataService.post(this.uploadImageService, imageFormObject, options).then((response: any) => {
            return response;
        })
    }

    static uploadImageToStore(imageFormObject: any, options: any): Promise<any> {
        return DataService.post(this.uploadImageToStoreService, imageFormObject, options).then((response: any) => {
            return response;
        })
    }

    static addProduct(product: any): Promise<any> {
        return DataService.post(this.addProductService, product).then((response: any) => {
            return response;
        })
    }

    static getProductById(id: any): Promise<any> {
        return DataService.get(this.getProductByIdService + id).then((response: any) => {
            return {
                data: new ProductEntity(response?.data?.product)
            };
        })
    }

    static saveProductById(id: any, payload: any): Promise<any> {
        return DataService.patch(this.saveProductByIdService + id, payload).then((response: any) => {
            return response;
        })
    }

    static deleteProductById(id: any): Promise<any> {
        return DataService.delete(this.deleteProductByIdService + id).then((response: any) => {
            return response;
        })
    }

    static addToCartProduct(payload: any): Promise<any> {
        return DataService.post(this.addToCartProducService, payload).then((response: any) => {
            return response;
        })
    }

    static likeProduct(id: any): Promise<any> {
        return DataService.patch(this.likeProductService + id).then((response: any) => {
            return response;
        })
    }

    static unlikeProduct(id: any): Promise<any> {
        return DataService.patch(this.unlikeProductService + id).then((response: any) => {
            return response;
        })
    }
}
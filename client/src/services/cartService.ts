import CartEntity from "../entities/Cart.entity";
import DataService from "./DataService";

export default class CartService {
    static getCartService = '/cart/all';
    static addToCartProducService = '/cart';
    static removeProductFromCartService = '/cart/removeProductQuantity';
    static deleteProductFromCartService = '/cart/cartDeleteItem';

    static getCart(): Promise<any> {
        return DataService.get(this.getCartService).then((response: any) => {
            return {
                data: response?.data?.products?.map((item: any) => new CartEntity(item)) || [],
                totalCount: response?.data?.totalCount,
                totalPrice: response?.data?.totalPrice,
            }
        })
    }

    static addToCartProduct(payload: any): Promise<any> {
        return DataService.post(this.addToCartProducService, payload).then((response: any) => {
            return response;
        })
    }

    static removeFromCartProduct(payload: any): Promise<any> {
        return DataService.post(this.removeProductFromCartService, payload).then((response: any) => {
            return response;
        })
    }

    static deleteProductFromCart(payload: any): Promise<any> {
        return DataService.post(this.deleteProductFromCartService, payload).then((response: any) => {
            return response;
        })
    }
}
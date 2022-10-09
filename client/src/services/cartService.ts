import DataService from "./DataService";

export default class CartService {
    static getCartService = '/cart/all';
    static addToCartProducService = '/cart';
    static removeProductFromCartService = '/cart/removeProductQuantity';
    static deleteProductFromCartService = '/cart/cartDeleteItem';

    static getCart(): Promise<any> {
        return DataService.get(this.getCartService).then((response: any) => {
            return {
                count: response?.data?.totalCount,
                data: response?.data?.products || []
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
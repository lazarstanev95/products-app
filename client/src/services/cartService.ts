import DataService from "./DataService";

export default class CartService {
    static getCartService = '/cart/all';

    static getCart(): Promise<any> {
        return DataService.get(this.getCartService).then((response: any) => {
            return {
                count: response?.data?.totalCount,
                data: response?.data?.products || []
            }
        })
    }
}
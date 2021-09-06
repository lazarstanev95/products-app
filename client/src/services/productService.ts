import DataService from "./DataService";
import ProductEntity from "../entities/Product.entity";

export default class ProductService {
    static productsService = '/products';

    static getProducts(): Promise<any> {
        return DataService.get(this.productsService).then((response: any) => {
            return {
                count: response?.data?.totalCount,
                data: response?.data?.products?.map((item: any) => new ProductEntity(item)) || []
            }
        })
    }
}
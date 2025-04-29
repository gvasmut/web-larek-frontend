import { IOrderData, IOrderResult, IProductItem, IProductList } from "../../types";
import { Api, ApiListResponse } from "./api";


export interface ILarekAPI {
    getProductList: () => Promise<IProductItem[]>;
    getProduct: (id: string) => Promise<IProductItem>;
    orderProduct: (order: IOrderData) => Promise<IOrderResult>;
}

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProduct(id: string): Promise<IProductItem> {
        return this.get(`/product/${id}`).then(
            (item: IProductItem) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }


    getProductList(): Promise<IProductItem[]> {
        return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderProduct(order: IOrderData): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}
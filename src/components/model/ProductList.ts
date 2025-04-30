import { IProductItem, IProductList } from '../../types';
import { IEvents } from '../base/events';

export class ProductListData implements IProductList {
	protected _products: IProductItem[];
	protected events: IEvents;
  // productData: { items: { id: string; description: string; image: string; title: string; category: string; price: number; }[]; };

	constructor(events: IEvents) {
		this.events = events;
	}

	getProduct(productId: string) {
		return this._products.find((item) => item.id === productId);
	}
	set items(products: IProductItem[]) {
		this._products = products;
		this.events.emit('products: set');
	}

	get items() {
		return this._products;
	}
}


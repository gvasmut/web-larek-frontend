import { IBasket, IProductItem } from '../../types';
import { IEvents } from '../base/events';

export class BasketData implements IBasket {
	protected basketProducts: IProductItem[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
    this.basketProducts = [];
	}

	get items() {
		return this.basketProducts;
	}
  set items(products: IProductItem[]) {
		this.basketProducts = products;
		this.events.emit('basket:updated', this.basketProducts);
	}

	get totalprice() {
		return this.basketProducts.reduce((sum, product) => {
			if (product.price === null) {
				return sum;
			}
			return (sum += product.price);
		}, 0);
	}

  addProduct(product:IProductItem): void{
    const exists = this.basketProducts.some(p => p.id === product.id);
    if(!exists){
      this.basketProducts = [product, ...this.basketProducts]
      this.events.emit('product:add', { productId: product.id })
    }
  }

  deleteProduct(productId: string): void {
    this.basketProducts = this.basketProducts.filter(p => p.id !== productId);
    this.events.emit('product:remove', { id: productId });
  }

  cleanBasket(): void {
    this.basketProducts = []
    this.events.emit('product:clean');
  }

  checkIdInBasket(id:string): boolean {
    return this.basketProducts.some((p) => p.id === id);
  }

}


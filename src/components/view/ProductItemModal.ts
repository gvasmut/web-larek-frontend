import { CategoryClassMap } from '../../utils/constants';
import { IEvents } from '../base/events';
import { ProductItem } from './ProductItem';
import { Product } from './common/Product';

export class ProductItemModal extends Product {
  protected productImage: HTMLImageElement;
  protected productCategory: HTMLElement;
	protected productDescription: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container, events);

    this.productImage = this.container.querySelector('.card__image');
    this.productCategory = this.container.querySelector('.card__category');
		this.productDescription = this.container.querySelector('.card__text');
		this.button = this.container.querySelector('.button');

		this.button.addEventListener('click', () =>
			this.events.emit('product:buy', { productId: this.id })
		);
	}

	set description(value: string) {
		this.setText(this.productDescription, value);
	}

	set inBasket(value: boolean) {
		this.setDisabled(this.button, value);
		if (value === true) {
			this.setText(this.button, 'Уже в корзине');
		} else {
			this.setText(this.button, 'В корзину');
		}
	}

  set image(value:string){
    this.setImage(this.productImage, value, this.title)
  }
  
  set category (value:string){
    this.setText(this.productCategory, value)
    const className = CategoryClassMap[value] || 'card__category_other';
    this.productCategory.className = `card__category ${className}`;
}
}
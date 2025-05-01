import { CategoryClassMap } from '../../utils/constants';
import { IEvents } from '../base/events';
import { Product } from './common/Product';

export class ProductItemModal extends Product {
	protected productImage: HTMLImageElement;
	protected productCategory: HTMLElement;
	protected productDescription: HTMLElement;
	protected productBtn: HTMLButtonElement;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container, events);

		this.productImage = this.container.querySelector('.card__image');
		this.productCategory = this.container.querySelector('.card__category');
		this.productDescription = this.container.querySelector('.card__text');
		this.productBtn = this.container.querySelector('.button');

		this.productBtn.addEventListener('click', () =>
			this.events.emit('product:buy', { productId: this.id })
		);
	}

	set description(value: string) {
		this.setText(this.productDescription, value);
	}

	set inBasket(value: boolean) {
		this.setDisabled(this.productBtn, value);
		if (value === true) {
			this.setText(this.productBtn, 'Уже в корзине');
		} else {
			this.setText(this.productBtn, 'В корзину');
		}
	}

	set image(value: string) {
		this.setImage(this.productImage, value, this.title);
	}

	set category(value: string) {
		this.setText(this.productCategory, value);
		const className = CategoryClassMap[value] || 'card__category_other';
		this.productCategory.className = `card__category ${className}`;
	}
}

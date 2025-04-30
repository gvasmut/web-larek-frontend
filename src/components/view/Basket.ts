import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

interface IBasketView {
	products: HTMLElement[];
	total: number;
	index: HTMLElement[];
	isEmpty: boolean;
}

export class Basket extends Component<IBasketView> {
	protected _productList: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._productList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLElement>(
			'.basket__button',
			this.container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.products = [];
	}
	
	set products(products: HTMLElement[]) {
		if (products.length) {
			this._productList.replaceChildren(...products);
		} else {
			this._productList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

	set index(products: HTMLElement[]) {
		if (products) {
			for (let i = 0; i < products.length; i++) {
				const index = products[i].querySelector('.basket__item-index');
				index.textContent = `${i + 1}`;
			}
		}
	}

	set isEmpty(value: boolean) {
		this.setDisabled(this._button, value);
	}
}

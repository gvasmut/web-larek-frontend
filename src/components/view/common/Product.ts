import { IProductItem } from '../../../types';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/events';

export class Product extends Component<IProductItem> {
	protected productTitle: HTMLElement;
	protected productPrice: HTMLElement;
	protected events: IEvents;
	protected productId: string;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container);
		this.events = events;

		this.productTitle = this.container.querySelector('.card__title');
		this.productPrice = this.container.querySelector('.card__price');
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id() {
		return this.container.dataset.id;
	}

	set title(value: string) {
		this.setText(this.productTitle, value);
	}

	get title(): string {
		return this.productTitle.textContent || '';
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this.productPrice, 'Бесценно');
		} else {
			this.setText(this.productPrice, `${value} синапсов`);
		}
	}
}

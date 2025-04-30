import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Product } from './common/Product';

export class ProductInBasket extends Product {
	protected basketButton: HTMLButtonElement;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container, events);
		this.events = events;

		this.basketButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);

		this.basketButton.addEventListener('click', () =>
			this.events.emit('product:delete', { productId: this.id })
		);
	}
}

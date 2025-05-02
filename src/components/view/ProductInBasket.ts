import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Product } from './common/Product';

export class ProductInBasket extends Product {
	protected basketButton: HTMLButtonElement;
	protected indexOfProduct:HTMLElement;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container, events);

		this.basketButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);
		this.indexOfProduct = ensureElement<HTMLButtonElement>('.basket__item-index', this.container)

		this.basketButton.addEventListener('click', () =>
			this.events.emit('product:delete', { productId: this.id })
		);
	}

	set index(i:number){
		if (this.indexOfProduct){
			this.setText(this.indexOfProduct, i)
		}
	}
}

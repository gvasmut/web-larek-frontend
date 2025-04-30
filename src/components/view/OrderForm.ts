import { Form } from './common/Form';
import { TOrderDeliveryData, TOrderUserData } from '../../types';
import { IEvents } from '../base/events';
import { ensureAllElements } from '../../utils/utils';

export class OrderDeliveryForm extends Form<TOrderDeliveryData> {
	protected paymentBtns: HTMLButtonElement[];
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.paymentBtns = ensureAllElements('.button_alt', this.container);

		this.paymentBtns.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				this.onInputChange('payment', button.name);
			});
		});
    
	}

	set payment(value: string) {
		this.paymentBtns.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === value);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

}

export class OrderContactForm extends Form<TOrderUserData> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

}

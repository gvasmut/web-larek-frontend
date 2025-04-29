import { Form } from './common/Form';
import { IContactsData, TOrderData, TOrderUserData } from '../../types';
import { IEvents } from '../base/events';
import { ensureAllElements } from '../../utils/utils';

export class OrderDeliveryForm extends Form<TOrderData> {
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
  set orderIsValid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}
}

export class OrderContactForm extends Form<IContactsData> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit('contacts:submit');

    })
  
	}

	set contactPhone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set contactsEmail(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
  set contactIsValid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}
}

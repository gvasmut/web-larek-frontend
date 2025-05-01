import {
	FormErrors,
	IUserData,
	TOrderDeliveryData,
	TOrderUserData,
} from '../../types';
import { IEvents } from '../base/events';

export class OrderData implements IUserData {
	protected _userData: TOrderDeliveryData & TOrderUserData;
	protected events: IEvents;
	formErrors: FormErrors = {};

	constructor(events: IEvents) {
		this.events = events;
		this._userData = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}

	get userData() {
		return this._userData;
	}

	setDeliveryOrderField(field: keyof TOrderDeliveryData, value: string) {
		this._userData[field] = value;
		this.validateDeliveryOrderData();
	}

	validateDeliveryOrderData() {
		const errors: typeof this.formErrors = {};
		if (!this._userData.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!this._userData.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('form:deliveryErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactOrderData() {
		const errors: typeof this.formErrors = {};
		if (!this._userData.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this._userData.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('form:contactErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setContactOrderField(field: keyof TOrderUserData, value: string) {
		this._userData[field] = value;
		this.validateContactOrderData();
	}

	reset() {
		this._userData = {
			address: '',
			payment: '',
			email: '',
			phone: '',
		};
		this.formErrors = {};
		this.events.emit('form:deliveryErrors:change', {});
		this.events.emit('form:contactErrors:change', {});
	}
}

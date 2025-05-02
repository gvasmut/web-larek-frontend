export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	index: number;
}

export interface IOrderData {
	address: string;
	email: string;
	phone: string;
	payment: string;
	total: number;
	items: string[];
}

export interface IProductList {
	items: IProductItem[];
	getProduct(id: string): IProductItem;
}

export interface IBasket {
	items: IProductItem[];
	totalPrice: number;
	addProduct(product: IProductItem): void;
	deleteProduct(productId: string): void;
	cleanBasket(): void;
	checkIdInBasket(id: string): boolean;
}

export type TOrderDeliveryData = Pick<IOrderData, 'payment' | 'address'>;
export type TOrderUserData = Pick<IOrderData, 'phone' | 'email'>;

export interface IUserData {
	userData: TOrderDeliveryData & TOrderUserData;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<
	Record<keyof (TOrderDeliveryData & TOrderUserData), string>
>;

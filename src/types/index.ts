export interface IProductItem {
  id: string,
  description: string,
  image: string,
  title: string,
  category: string,
  price: number|null;
}

export interface IOrderData {
  address: string,
  email: string,
  phone: string,
  payment: string,
  total:number,
  items:string[]
}

export interface IProductList {
  total?:number,
  items: IProductItem[],
  preview?: string|null;
  getProduct(id: string): IProductItem;
}

export interface IBasket {
  items: IProductItem[],
  totalprice: number,
  addProduct(product:IProductItem):void;
  deleteProduct(productId: string): void;
  // cleanBasket():void;
}

export type TProductInfo = Pick<IProductItem, 'image'| 'title'| 'category'|'price'| 'description'>
export type TOrderData = Pick<IOrderData, 'payment'|'address'>
export type TOrderUserData = Pick<IOrderData, 'phone'|'email'>


export interface IUserData {
	userData: TOrderData & TOrderUserData;
}


export interface IOrderResult {
  id: string;
  total:number;
}

export type FormErrors = Partial<Record<keyof (TOrderData & TOrderUserData), string>>

export interface IContactsData {
	contactsPhone: string;
	contactsEmail: string;
	contactsIsValid: boolean;
}

// export type FormDeliveryErrors = Partial<Record<keyof IOrderData, string>>;
// export type FormContactErrors = Partial<Record<keyof TOrderUserData, string>>;
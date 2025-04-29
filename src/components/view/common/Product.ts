import { IProductItem } from "../../../types";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/events";

export class Product extends Component<IProductItem> {
protected productTitle: HTMLElement;
// protected productImage: HTMLImageElement;
// protected productCategory: HTMLElement;
protected productPrice: HTMLElement;
protected events: IEvents;
protected productId: string;

constructor(protected container: HTMLTemplateElement, events: IEvents){
  super(container)
  this.events = events;
  // this.container = cloneTemplate(container);

  this.productTitle = this.container.querySelector('.card__title');
  this.productPrice = this.container.querySelector('.card__price');

	// this.container.addEventListener('click', () =>
	// 		this.events.emit('product:select', { product: this })
	// 	);
}

// set data(product: IProductItem) {
// 	this.productTitle.textContent = product.title;
// 	this.productImage.src = product.image;
// 	this.productImage.alt = product.title;
// 	this.productCategory.textContent = product.category;
// 	this.productPrice.textContent = `${product.price} синапсов`;
// 	this.productId = product.id;
// }
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

// set image(value:string){
//   this.setImage(this.productImage, value, this.title)
// }

// set category (value:string){
//   this.setText(this.productCategory, value)
// }

set price (value:number) {
  if (value === null){
    this.setText(this.productPrice, 'Бесценно')
  }else{
    this.setText(this.productPrice, `${value} синапсов`)
  }
}

}

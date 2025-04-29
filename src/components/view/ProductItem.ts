import { IProductItem } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { Product } from "./common/Product";

export class ProductItem extends Product {

protected productImage: HTMLImageElement;
protected productCategory: HTMLElement;

constructor(protected container: HTMLTemplateElement, events: IEvents){
  super(container,events)
  this.events = events;
  // this.container = cloneTemplate(container);


  this.productImage = this.container.querySelector('.card__image');
  this.productCategory = this.container.querySelector('.card__category');


	this.container.addEventListener('click', () =>
			this.events.emit('product:select', { productId: this.id })
		);
}


set image(value:string){
  this.setImage(this.productImage, value, this.title)
}

set category (value:string){
  this.setText(this.productCategory, value)
}

}

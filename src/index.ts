import { LarekAPI } from './components/base/LarekAPI';
import { EventEmitter } from './components/base/events';
import { BasketData } from './components/model/BasketData';
import { OrderData } from './components/model/OrderData';
import { ProductListData } from './components/model/ProductList';
import { Basket } from './components/view/Basket';
import {
	OrderContactForm,
	OrderDeliveryForm,
} from './components/view/OrderForm';
import { Page } from './components/view/Page';
import { ProductInBasket } from './components/view/ProductInBasket';
import { ProductItem } from './components/view/ProductItem';
import { ProductItemModal } from './components/view/ProductItemModal';
import { Success } from './components/view/Success';
import { Modal } from './components/view/common/Modal';
import './scss/styles.scss';
import {
  FormErrors,
	IOrderData,
	IProductItem,
	TOrderData,
	TOrderUserData,
} from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

// const productlist = [
// 		{
// 			id: '854cef69-976d-4c2a-a18c-2aa45046c390',
// 			description: 'Если планируете решать задачи в тренажёре, берите два.',
// 			image: 'https://larek-api.nomoreparties.co/content/weblarek/5_Dots.svg',
// 			title: '+1 час в сутках',
// 			category: 'софт-скил',
// 			price: 750,
// 		},
// 		{
// 			id: 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
// 			description:
// 				'Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.',
// 			image: '/Shell.svg',
// 			title: 'HEX-леденец',
// 			category: 'другое',
// 			price: 1450,
// 		},
// 	];

// basketData.items = productlist
// const testOrder = {
//     email: 'test@example.com',
//     phone: '+79999999999',
//     address: 'Улица Пушкина, дом Колотушкина',
//     payment: 'card', // или 'cash'
//     items: basketData.items.map(item => item.id),
//     total: basketData.totalprice
//     // items: ["854cef69-976d-4c2a-a18c-2aa45046c390", "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"], // сюда подставь реальные ID товаров

//   } satisfies IOrderData;

// productData.items = productlist
// productData.items = []
// console.log(productData.items)
// basketData.items = productlist
// console.log(basketData.totalprice)

const events = new EventEmitter();
const productData = new ProductListData(events);
const basketData = new BasketData(events);

const api = new LarekAPI(CDN_URL, API_URL);

const testSection = document.querySelector('.gallery');

const productTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');

const pageContainer = document
	.querySelector('.page__wrapper')
	?.closest('body') as HTMLElement;

const productTemplateModal: HTMLTemplateElement =
	document.querySelector('#card-preview');
const modalContainer: HTMLTemplateElement = document.querySelector('.modal');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const PageData = new Page(pageContainer, events);

const modal = new Modal(modalContainer, events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const product = new ProductItemModal(
	cloneTemplate(productTemplateModal),
	events
);

const productInBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const productInBasket = new ProductInBasket(
	cloneTemplate(productInBasketTemplate),
	events
);

const orderDeliveryFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactFormTemplate =
	ensureElement<HTMLTemplateElement>('#contacts');
const orderDeliveryForm = new OrderDeliveryForm(
	cloneTemplate(orderDeliveryFormTemplate),
	events
);
const orderContactForm = new OrderContactForm(
	cloneTemplate(orderContactFormTemplate),
	events
);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const orderData = new OrderData(events);

events.onAll((event) => {
	console.log(event.eventName, event.data);
});
api
	.getProductList()
	.then((products) => {
		productData.items = products;
		console.log(products);
		events.emit('initialData:loaded');
	})
	.catch((error) => {
		console.error('❌ Ошибка загрузке продуктов с сервера:', error);
	});


events.on('initialData:loaded', () => {
	const productArray = productData.items.map((product) => {
		const card = new ProductItem(cloneTemplate(productTemplate), events);
		return card.render(product);
	});

	PageData.catalog = productArray;
});

events.on('product:select', (data: { productId: string }) => {
	const product = productData.getProduct(data.productId);

	if (product) {
		const productCard = new ProductItemModal(
			cloneTemplate(productTemplateModal),
			events
		);
		const inBasket = basketData.checkIdInBasket(product.id);
		console.log('Товар уже в корзине?', inBasket);

		if (inBasket) {
			productCard.inBasket = true;
		}
		const preview = productCard.render(product);
		modal.render({ content: preview });
	} else {
		console.warn('Товар не найден:', data.productId);
	}
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	PageData.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	PageData.locked = false;
});

events.on('product:buy', (data: { productId: string }) => {
	const product = productData.getProduct(data.productId);
	console.log(product);
	basketData.addProduct(product);
	console.log(basketData.items);
	PageData.counter = basketData.items.length;
	modal.close();
});
events.on('product:clean', () => {
  PageData.counter = basketData.items.length;
});

events.on('basket:open', () => {
	const content = basketData.items.map((product) => {
		const productInBasket = new ProductInBasket(
			cloneTemplate(productInBasketTemplate),
			events
		);
		return productInBasket.render(product);
	});
	const basketPrew = basket.render({
		products: content,
		total: basketData.totalprice,
		isEmpty: basketData.totalprice === 0,
	});
	modal.render({ content: basketPrew });
	basket.index = content;
});

events.on('product:delete', (data: { productId: string }) => {
	basketData.deleteProduct(data.productId);
	PageData.counter = basketData.items.length;
	console.log(basketData.items);
	const content = basketData.items.map((product) => {
		const productInBasket = new ProductInBasket(
			cloneTemplate(productInBasketTemplate),
			events
		);
		return productInBasket.render(product);
	});
	basket.render({
		products: content,
		total: basketData.totalprice,
		isEmpty: basketData.totalprice === 0,
	});
});

events.on('basket:updated', (data:{basketProducts: []})=>{
if(basketData.items.some((item) => item.price === null)){
  
}
})

events.on('order:open', () => {
	modal.render({
		content: orderDeliveryForm.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof TOrderData; value: string }) => {
		orderData.setDeliveryOrderField(data.field, data.value);
	}
);

events.on('form:deliveryErrors:change', (errors:Partial<TOrderData> ) => {
	const {address, payment} = errors
	orderDeliveryForm.valid = !payment&&!address;
  orderDeliveryForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	console.log('Delivery form errors:', errors);
});


events.on('order:submit', () => {
  if (orderData.validateDeliveryOrderData()){
		console.log('Форма доставки валидна, открываем форму контактов...');
		modal.render({
			content: orderContactForm.render({
			  contactsPhone: '',
				contactsEmail: '',
				valid: false,
				errors: [],
			}),
		});
  }
});


events.on(
	/^contacts\..*:change/,
	(data: { field: keyof TOrderUserData; value: string }) => {
    orderData.setContactOrderField(data.field, data.value);
	})


events.on('form:contactErrors:change', (errors:Partial<TOrderUserData> ) => {
  const {phone,email} = errors
  orderContactForm.valid = !phone&&!email
  orderContactForm.errors = Object.values({phone,email})
    .filter((i) => !!i)
    .join('; ');
  console.log('contact form errors:', errors);
});

  // Отправлена форма заказа
  events.on('contacts:submit', () => {
    if (!orderData.validateContactOrderData()) {
      console.log('Форма заказа валидна, отправляем заказ...');
      return;
    }
    const pricedItems = basketData.items.filter(p => p.price !== null);
  api.orderProduct({...orderData.userData,
  items:pricedItems.map((p) => p.id), total: basketData.totalprice
})
      .then((result) => {
          const success = new Success(cloneTemplate(successTemplate), {
              onClick: () => {
                  modal.close();
                  // orderData.clearBasket();
                  // events.emit('auction:changed');
                  
              }
              
          });
          
          success.total = result.total
          basketData.cleanBasket()
          modal.render({
              content: success.render({})
          });
      })
      .catch(err => {
          console.error(err);
      });
});


// const cardPreview = new Product(productTemplatePreview,events);
// cardPreview.render(productlist[0])

// const card = new Product(productTemplate,events);
// card.render(productlist[0]) ;
// testSection.append(card.render())

// const card2 = new Product(productTemplate,events);
// card2.render(productlist[1])
// testSection.append(card2.render())

// PageData.counter = 2
// PageData.catalog = card.render(api.getProductList())

// проверка без сервера слушателя событий
// api.getProductList()
//   .then(products => {
//     // Сохраняем продукты в ProductListData
//     productData.items = products;

//     // Создаём карточки
//     const productCards = products.map(product => {
//       const card = new Product(productTemplate, events);
//       card.render(product);
//       return card.render(); // <- получаем DOM-элемент
//     });

//     // Передаём карточки в каталог страницы
//     PageData.catalog = productCards;

//     // Обновим счётчик товаров в корзине (например)
//     PageData.counter = Basket.items.length;
//   })
//   .catch(error => {
//     console.error('❌ Ошибка при загрузке карточек:', error);
//   });

//  var dict = new Map<Number, Number>
//  dict.set(1, 10)
//  dict.set(2, 20)
//  dict.set(4, 40)
//  dict.set(5, 50)
//  dict.set(6, 60)
//  dict.set(3, 30)

//  dict.forEach((value, key) => console.log(`key=${key} value=${value}`))

//  let obj: Record<number, number> ={}

// obj[1]=10;
// console.log(obj)

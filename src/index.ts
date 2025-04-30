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
	TOrderDeliveryData,
	TOrderUserData,
} from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const productData = new ProductListData(events);
const basketData = new BasketData(events);

// Чтобы мониторить все события, для отладки
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// Все шаблоны
const productTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productTemplateModal =
	ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const productInBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const orderDeliveryFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactFormTemplate =
	ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const PageData = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//Модели данных
const basket = new Basket(cloneTemplate(basketTemplate), events);
const productCard = new ProductItemModal(
	cloneTemplate(productTemplateModal),
	events
);
const orderData = new OrderData(events);

// Переиспользуемые части интерфейса
const productInBasket = new ProductInBasket(
	cloneTemplate(productInBasketTemplate),
	events
);
const orderDeliveryForm = new OrderDeliveryForm(
	cloneTemplate(orderDeliveryFormTemplate),
	events
);
const orderContactForm = new OrderContactForm(
	cloneTemplate(orderContactFormTemplate),
	events
);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

// Получаем продукты с сервера и инициализируем событие по загрузке 
api
	.getProductList()
	.then((products) => {
		const patchedProducts = products.map((item) => ({
			...item,
			image: item.image.replace('.svg', '.png'),
		}));
		productData.items = patchedProducts;
		events.emit('initialData:loaded');
	})
	.catch((error) => {
		console.error('Ошибка загрузке продуктов с сервера:', error);
	});

// Отображаем полученные продукты с сервера на главной странице 
events.on('initialData:loaded', () => {
	const productArray = productData.items.map((product) => {
		const card = new ProductItem(cloneTemplate(productTemplate), events);
		return card.render(product);
	});
	PageData.catalog = productArray;
});

// Отображаем модалку с выбранным продуктом и делаем проверку есть ли товар в корзине
events.on('product:select', (data: { productId: string }) => {
	const product = productData.getProduct(data.productId);
	if (product) {
		const inBasket = basketData.checkIdInBasket(product.id);
		if (inBasket) {
			productCard.inBasket = true;
		}
		modal.render({ content: productCard.render(product) });
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

// Событие по кнопке купить: товар добавляется в корзину, меняется счетчик товаров на главной странице
events.on('product:buy', (data: { productId: string }) => {
	const product = productData.getProduct(data.productId);
	basketData.addProduct(product);
	PageData.counter = basketData.items.length;
	modal.close();
});

events.on('product:clean', () => {
	PageData.counter = basketData.items.length;
});

events.on('basket:open', () => {
	const content = basketData.items.map((product) => {
		return productInBasket.render(product);
	});
	modal.render({
		content: basket.render({
			products: content,
			total: basketData.totalprice,
			isEmpty: basketData.totalprice === 0,
		}),
	});
	basket.index = content;
});

events.on('product:delete', (data: { productId: string }) => {
	basketData.deleteProduct(data.productId);
	PageData.counter = basketData.items.length;
	console.log(basketData.items);
	const content = basketData.items.map((product) => {
		return productInBasket.render(product);
	});
	basket.render({
		products: content,
		total: basketData.totalprice,
		isEmpty: basketData.totalprice === 0,
	});
});

events.on('basket:updated', (data: { basketProducts: [] }) => {
	if (basketData.items.some((item) => item.price === null)) {
	}
});

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
	(data: { field: keyof TOrderDeliveryData; value: string }) => {
		orderData.setDeliveryOrderField(data.field, data.value);
	}
);

events.on(
	'form:deliveryErrors:change',
	(errors: Partial<TOrderDeliveryData>) => {
		const { address, payment } = errors;
		orderDeliveryForm.valid = !payment && !address;
		orderDeliveryForm.errors = Object.values({ payment, address })
			.filter((i) => !!i)
			.join('; ');
		// console.log('Delivery form errors:', errors);
	}
);

events.on('order:submit', () => {
	if (orderData.validateDeliveryOrderData()) {
		modal.render({
			content: orderContactForm.render({
				phone: '',
				email: '',
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
	}
);

events.on('form:contactErrors:change', (errors: Partial<TOrderUserData>) => {
	const { phone, email } = errors;
	orderContactForm.valid = !phone && !email;
	orderContactForm.errors = Object.values({ phone, email })
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
	const pricedItems = basketData.items.filter((p) => p.price !== null);
	api
		.orderProduct({
			...orderData.userData,
			items: pricedItems.map((p) => p.id),
			total: basketData.totalprice,
		})
		.then((result) => {
			success.total = result.total;
			basketData.cleanBasket();
			orderData.reset();
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

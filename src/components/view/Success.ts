import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _closeBtn: HTMLButtonElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions?.onClick) {
            this._closeBtn.addEventListener('click', actions.onClick);
        }
    }

    set total(total: number) {
		this.setText(this._total, `Списано ${total} синапсов`);
	}
}
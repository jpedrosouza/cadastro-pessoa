import template from "./component.html";

export class HTMLXInput extends HTMLElement {
    private _root = this.attachShadow({ mode: "closed" });
    private _elMain: HTMLElement;
    private _elValue: HTMLSpanElement;
    private _elLabel: HTMLSpanElement;
    private _value: string = "";

    static get observedAttributes() {
        return ['value'];
    }

    constructor() {
        super();
        this._root.innerHTML = template;
        this._elMain = <HTMLElement>this._root.querySelector('main');
        this._elLabel = <HTMLSpanElement>this._elMain.querySelector('.label');
        this._elValue = <HTMLSpanElement>this._elMain.querySelector('.value');
    }

    get value() {
        return this._elValue.innerText;
    }

    set value(newValue: string) {
        this.setAttribute('value', newValue);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name == 'value') {
            this._value = newValue;
            this._elValue.innerText = newValue;
            this.checkIfValueIsEmpty()
            return;
        }
    }

    connectedCallback() {
        this._elLabel.innerText = this._root.host.getAttribute("label") || "label";
        this._elValue.addEventListener('focus', el => this._elMain.classList.add("titled"));
        this._elValue.addEventListener('blur', el => this.checkIfValueIsEmpty());
    }

    private checkIfValueIsEmpty() {
        if (this._elValue.innerText.trim() == "")
            this._elMain.classList.remove("titled");
        else
            this._elMain.classList.add("titled");
    }
}

customElements.define("x-input", HTMLXInput);
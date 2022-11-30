import { LitElement, css, html } from 'lit';
import { OffCanvas } from './OffCanvas';
import { IconButton } from './IconButton';

export class PanelSelect extends LitElement {
    static properties = {
        max: { type: Number },
        selected: { type: Array, reflect: true },
        header: {},
    }

    constructor() {
        super();

        this.header = "";
        this.selected = []; // List of keys for selected slot elements.
        this.max = -1;

        this.isPanel = true;

        this.addEventListener("click", e => {
            if (e.target.hasAttribute("key")) {
                this.toggleKey(e.target.getAttribute("key"));
            }
        });
    }

    get _slottedChildren() {
        const slot = this.shadowRoot.querySelector('slot');
        const childNodes = slot.assignedNodes({ flatten: true });
        return Array.prototype.filter.call(childNodes, (node) => node.nodeType == Node.ELEMENT_NODE);
    }

    updated() {
        this._slottedChildren.forEach(child => {
            if (child.hasAttribute("key")) {
                child.classList.toggle("selected", this.selected.includes(child.getAttribute("key")));
            }
        })
    }

    get open() { return this.renderRoot.querySelector("#panel").open; }

    open() { return this.renderRoot.querySelector("#panel").open(); }

    close() { return this.renderRoot.querySelector("#panel").close(); }

    toggle() { return this.renderRoot.querySelector("#panel").toggle(); }

    toggleKey(key) {
        if (this.selected.includes(key)) {
            this.removeKey(key);
        }
        else {
            this.addKey(key);
        }
    }

    addKey(key) {
        this.selected = [...this.selected, key];

        if (this.max > 0 && this.selected.length > this.max) {
            this.selected.shift(); // Mutation
            this.requestUpdate();
        }
    }

    removeKey(key) {
        this.selected = this.selected.filter(function (value) {
            return value != key;
        });
    }

    _onClose() {
        const event = new CustomEvent('panel-select-cancel', {
            detail: {
                selected: this.selected,
                element: this,
            }
        });

        this.dispatchEvent(event);
    }

    confirm() {
        const event = new CustomEvent('panel-select-confirm', {
            detail: {
                selected: this.selected,
                element: this,
            }
        });

        this.dispatchEvent(event);

        this.close();
    }

    async choose() {
        this.open();

        return new Promise((resolve, reject) => {
            this.addEventListener('panel-select-confirm', function () {
                resolve(this.selected);
            });

            this.addEventListener('panel-select-cancel', function () {
                reject('close');
            });
        })
    }

    render() {
        return html`
            <off-canvas id="panel" header="${this.header}" @panel-close="${this._onClose}">

                <slot id="slot"></slot>

                <div slot="options" class="options">
                    <span class="counter">${this.selected.length} Selected</span>
                    <icon-button id="button" @click=${this.confirm}>Confirm Changes</icon-button>
                </div>
            </off-canvas>
        `;
    }

    static styles = css`
        #slot{
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 1.5rem;
            padding: 1.5rem;
        }

        ::slotted(*){
            cursor: pointer;
        }

        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            gap: 1rem;
        }
        
        .counter{
            font-weight: 500;
            color: #64748b;
        }
    `;
}

customElements.define('panel-select', PanelSelect);

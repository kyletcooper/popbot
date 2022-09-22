import { LitElement, css, html } from 'lit';

export class WRDSelectPanel extends LitElement {
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

    openPanel() { this.renderRoot.querySelector("#panel").openPanel(); }

    closePanel() { this.renderRoot.querySelector("#panel").closePanel(); }

    togglePanel() { this.renderRoot.querySelector("#panel").togglePanel(); }

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
        const event = new CustomEvent('wrd-select-panel-cancel', {
            detail: {
                selected: this.selected,
                element: this,
            }
        });

        this.dispatchEvent(event);
    }

    confirm() {
        const event = new CustomEvent('wrd-select-panel-confirm', {
            detail: {
                selected: this.selected,
                element: this,
            }
        });

        this.dispatchEvent(event);

        this.closePanel();
    }



    // STYLE

    static styles = css`
        :host{
            background: red;
        }

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



    // MARKUP

    render() {
        return html`
            <wrd-panel id="panel" header="${this.header}" @wrd-panel-close="${this._onClose}">

                <slot id="slot"></slot>

                <div slot="options" class="options">
                    <span class="counter">${this.selected.length} Selected</span>
                    <wrd-button id="button" @click=${this.confirm}>Confirm Changes</wrd-button>
                </div>
            </wrd-panel>
        `;
    }
}

window.WRDSelectPanelChoose = async function (panel) {
    panel.openPanel();

    return new Promise((resolve, reject) => {
        panel.addEventListener('wrd-select-panel-confirm', function () {
            resolve(panel.selected);
        });

        panel.addEventListener('wrd-select-panel-cancel', function () {
            reject('close');
        });
    })
}

customElements.define('wrd-select-panel', WRDSelectPanel);

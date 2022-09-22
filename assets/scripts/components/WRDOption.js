import { LitElement, css, html } from 'lit';

export class WRDOptional extends LitElement {
    static properties = {
        value: {},
        name: {},
        label: {},

        _loading: { state: true },
    }

    constructor() {
        super();

        this._loading = false;
    }

    _onChange(e) {
        this._loading = true;

        setTimeout(() => {
            this._loading = false;
            this.renderRoot.querySelector(".spinner").succeed();
        }, 1000);
    }

    async save() {

    }



    static styles = css`
        .container{
            display: flex;
            align-items: start;
            gap: 1rem;
        }
    `;



    // MARKUP

    render() {
        return html`
            <div class="container">
                <wrd-input id="input" label="${this.label}" name="${this.name}" .value="${this.value || ''}" @wrd-input-change="${this._onChange}"></wrd-input>

                <wrd-spinner class="spinner" ?active="${this._loading}"></wrd-spinner>
            </div>
        `;
    }
}

customElements.define('wrd-option', WRDOptional);

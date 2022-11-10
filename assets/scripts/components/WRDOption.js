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

    async _onChange(e) {
        this._loading = true;
        
        const response = await window.popbot.manager.fetch.send("popbotUpdateOption", {
            name: this.name,
            value: e.detail.value
        });

        this._loading = false;
        
        if(response.success){
            this.renderRoot.querySelector(".spinner").succeed();
        }
        else{
            this.renderRoot.querySelector(".spinner").fail();
        }
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

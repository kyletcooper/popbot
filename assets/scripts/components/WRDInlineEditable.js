import { LitElement, css, html } from 'lit';

export class WRDInlineEditable extends LitElement {
    static properties = {
        value: { type: String, reflect: true },
        saving: { state: true },
    };

    firstUpdated() {
        super.firstUpdated();
        this.resize();
    }

    focus() {
        this.renderRoot?.querySelector("#input").focus();
    }

    async save() {
        this.saving = true;

        const response = await popbot.manager.fetch.send("popbot_setTitle", {
            "title": this.value,
            "post_id": window.popbot.wp.post_id,
            "_wpnonce": window.popbot.fetch.action_nonces.popbot_setTitle
        });

        if (response.success) {
            WRDToast("Saved.");
        }
        else {
            WRDToast("An error occured.");
        }

        this.saving = false;
    }

    _onBlur(e) {
        this.save();
    }

    _onInput(e) {
        this.value = e.target.value;
        this.resize();
    }

    _onFocus(e) {
        this.resize();
    }

    resize() {
        let inp = this.renderRoot.querySelector(".input");
        inp.style.width = this.value.length + "ch";
    }



    // STYLE

    static styles = css`
        :host{
            display: block;
            width: fit-content;
        }

        .container{
            display: flex;
            align-items: center;
            gap: 0.5rem;

            border-bottom: 2px solid transparent;
            border-radius: 2px;

            padding: 0.25rem 0.5rem;
            margin-left: -0.5rem;
        }

        .container:focus-within{
            border-bottom: 2px solid #cbd5e1;
        }

        .input{
            border: none;
            padding: 0px;
            margin: 0px;

            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: inherit;
        }
        .input:focus,
        .input:focus-visible{
            outline: none;
        }

        .spinner {
            width: 0.75rem;
            height: 0.75rem;

            border-radius: 50%;
            border: 0.15rem solid #64748b;
            border-color: #64748b #64748b #64748b transparent;

            animation: spinner 1.2s linear infinite;
            transition: opacity 0.2s ease;
        }
        
        .spinner[data-hidden]{
            opacity: 0;
        }

        @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
        }
        
    `;



    // MARKUP

    render() {
        return html`
            <div class="container">
                <input id="input" class="input" @blur="${this._onBlur}" @focus="${this._onFocus}" @input="${this._onInput}" .value="${this.value || ''}"/>
                <div class="spinner" ?data-hidden="${!this.saving}"></div>
            </div>
        `;
    }
}

customElements.define('wrd-inline-editable', WRDInlineEditable);

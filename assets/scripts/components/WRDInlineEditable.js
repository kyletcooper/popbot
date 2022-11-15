import { LitElement, css, html } from 'lit';

export class WRDInlineEditable extends LitElement {
    static properties = {
        value: { type: String, reflect: true },
        saving: { state: true },
    };

    connectedCallback() {
        super.connectedCallback();
        this.resize();
    }

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
        const inp = this.renderRoot.querySelector(".input");
        const sizer = this.renderRoot.querySelector(".sizer");
        const underline = this.renderRoot.querySelector(".underline");
        const styles = window.getComputedStyle(sizer);
        sizer.textContent = inp.value;
        underline.style.width = styles.width;
    }

    render() {
        return html`
        <div class="container ${this.saving ? "saving" : null}">
            <input class="input" @blur="${this._onBlur}" @focus="${this._onFocus}" @input="${this._onInput}" .value="${this.value || ''}"/>
            <div class="underline"></div>
        </div>

        <div class="sizer"></div>
        `;
    }

    static styles = css`
        :host{
            display: block;
        }

        .container{
            position: relative;
        }

        .sizer{
            position: absolute;
            top: 0;
            left: -99999px;
            height: 0;
            overflow: hidden;
            visibility: hidden;
            white-space: nowrap;
        }
        .sizer, .input{
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: inherit;
        }

        .input{
            display: block;
            width: 100%;

            border: none;
            padding: 0px;
            margin: 0px;
            background: none;
        }
        .input:focus,
        .input:focus-visible{
            outline: none;
        }

        .underline{
            position: absolute;
            bottom: 0;
            left: 0;
            min-width: 5ch;
            height: 2px;
            background: #E2E8F0;
            opacity: 0;
            pointer-events: none;
        }
        .container:focus-within .underline{
            opacity: 1;
        }
        .container.saving .underline{
            opacity: 1;
            animation: save 1s infinite ease;
        }

        @keyframes save {
            0% {
                background: #F696DE;
            }
            50% {
                background: #D824AB;
            }
            100% {
                background: #F696DE;
            }
        }
        
    `;
}

customElements.define('wrd-inline-editable', WRDInlineEditable);

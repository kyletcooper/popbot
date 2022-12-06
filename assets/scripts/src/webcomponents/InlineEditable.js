import { LitElement, css, html } from 'lit';
import { api } from '../utils';
import { toast } from './SnackBar';

export class InlineEditable extends LitElement {
    static properties = {
        uuid: { type: String },
        value: { type: String, reflect: true },
        saving: { state: true },
    };

    connectedCallback() {
        super.connectedCallback();
        this._getServerValue();
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

        const response = await api(`/popbot/v1/popbots/${this.uuid}`, {
            "title": this.value,
        }, 'POST');

        if (response.uuid) {
            toast("Saved.");
        }
        else {
            toast("An error occured.");
        }

        this.saving = false;
    }

    async _getServerValue() {
        const response = await api(`/popbot/v1/popbots/${this.uuid}`, { _fields: 'title' });
        this.value = response.title;
    }

    _onBlur() {
        this.save();
    }

    _onInput(e) {
        this.value = e.target.value;
        this.resize();
    }

    _onFocus() {
        this.resize();
    }

    resize() {
        const inp = this.renderRoot.querySelector(".input");
        const sizer = this.renderRoot.querySelector(".sizer");
        const border = this.renderRoot.querySelector(".border");
        const styles = window.getComputedStyle(sizer);
        sizer.textContent = inp.value;
        border.style.width = styles.width;
    }

    render() {
        return html`
        <div class="container ${this.saving ? "saving" : null}">
            <input class="input" @blur="${this._onBlur}" @focus="${this._onFocus}" @input="${this._onInput}" .value="${this.value || ''}"/>
            <div class="border"></div>
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

        .border{
            position: absolute;
            bottom: 0;
            top: -0.25rem;
            left: -0.5rem;
            box-sizing: content-box;
            min-width: 5ch;
            padding: 0.25rem 0.5rem;
            height: 100%;
            border: 1px solid transparent;
            border-radius: 0.2rem;
            pointer-events: none;
            outline: 0px solid var(--theme-100);
            transition: all 0.2s ease;
        }
        .container:hover .border{
            border-color: var(--gray-300);
        }
        .container:focus-within .border{
            outline: 5px solid var(--theme-100);
            border-color: var(--theme-500);
        }
        
    `;
}

customElements.define('inline-editable', InlineEditable);

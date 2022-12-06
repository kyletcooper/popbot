import { LitElement, css, html } from 'lit';
import { toast } from './SnackBar';

export class FloatingInput extends LitElement {
    static properties = {
        label: {},

        required: { type: Boolean },
        readonly: { type: Boolean },
        range: {},

        hideErrors: {
            type: Boolean,
            attribute: 'hide-errors'
        },

        _value: {
            reflect: true,
            attribute: 'value'
        },
        _type: {
            attribute: 'type'
        },
        _name: {
            attribute: 'name'
        },
        _placeholder: {
            attribute: 'placeholder'
        },
    };

    static formAssociated = true;

    constructor() {
        super();

        this._internals = this.attachInternals();
        this._value = "";

        this.addEventListener("focus", () => {
            this._onFocus();
        })

        this.addEventListener("invalid", e => {
            e.preventDefault();

            this._container.animate([
                {
                    outline: "0px solid #fecdd3",
                    borderColor: "#ADBAC2",
                },
                {
                    offset: 0.2,
                    borderColor: "#f43f5e",
                },
                {
                    outline: "0.75rem solid transparent",
                    borderColor: "#ADBAC2",
                },
            ], 300);
        })
    }

    firstUpdated() {
        this._onInput();
        this.setAttribute("tabindex", 0);
    }

    get value() {
        if (typeof this._value == "string") {
            return this._value.trim();
        }

        return String(this._value).trim();
    }
    set value(v) { this._value = v; }

    get form() { return this._internals.form; }
    get name() { return this._name; }
    get type() { return this._type; }
    get validity() { return this._internals.validity; }
    get validationMessage() { return this._internals.validationMessage; }
    get willValidate() { return this._internals.willValidate; }

    checkValidity() { return this._internals.checkValidity(); }
    reportValidity() { return this._internals.reportValidity(); }


    get _input() {
        return this.renderRoot?.querySelector("#input");
    }
    get _container() {
        return this.renderRoot?.querySelector(".container");
    }

    _checkValidity() {
        if (!this._input.willValidate && this._input.validationMessage) {
            this._internals.setValidity({ customError: true }, this._input.validationMessage);
            return false;
        }

        if (this.required && this._value.length < 1) {
            this._internals.setValidity({ customError: true }, "This field is required.");
            return false;
        }

        this._internals.setValidity({});
        return true;
    }

    _onKeyDown(e) {
        if (e.key == "Tab" && this.type == "code" && e.shiftKey) {
            e.preventDefault();
            e.target.setRangeText('\t', e.target.selectionStart, e.target.selectionStart, 'end')
        }
    }

    _onInput() {
        this._value = this._input.value;

        const event = new CustomEvent('input', {
            bubbles: true,
            cancelable: false,
            detail: {
                input: this._input,
                value: this._input.value
            }
        });
        this.dispatchEvent(event);

        this._internals.setFormValue(this._value);
        this._checkValidity();
    }

    _onChange() {
        const event = new CustomEvent('change', {
            bubbles: true,
            cancelable: false,
            detail: {
                input: this._input,
                value: this._input.value
            }
        });
        this.dispatchEvent(event);
    }

    _onFocus() {
        this._input.focus();
    }

    _copyToClipboard() {
        navigator.clipboard.writeText(this.value).then(
            () => {
                toast("Copied to clipboard");
            },
        );
    }

    render() {
        if (this.type == "textarea" || this.type == "code") return this.renderTextarea();

        return html`
            <label class="container">
                <div class="input-inline">
                    <input id="input" class="input ${this._placeholder ? "hasPlaceholder" : null}" type="${this.type}" name="${this.name}" value="${this.value}" placeholder="${this._placeholder ?? this.label}" ?readonly="${this.readonly}" @input=${this._onInput} @change=${this._onChange} @keydown=${this._onKeyDown} />
                    
                    ${this.readonly ? html`<wrd-icon icon="content_paste" button @click="${this._copyToClipboard}" style="margin-left: auto"></wrd-icon>` : null}
                </div>

                <div class="label">${this.label}</div>
            </label>

            ${this.hideErrors ? null : html`<div class="error">${this.validationMessage}</div>`}
        `;
    }

    renderTextarea() {
        return html`
            <label class="container">
                <div class="input-inline">
                    <textarea id="input" class="input" name="${this.name}" @input=${this._onInput} @change=${this._onChange} @keydown=${this._onKeyDown} ${this.type == "code" ? `spellcheck="false"` : null}>${this.value}</textarea>
                </div>

                <div class="label">${this.label}</div>
            </label>

            ${this.hideErrors ? null : html`<div class="error">${this.validationMessage}</div>`}
        `;
    }

    static styles = css`
        .container{
            position: relative;

            display: flex;
            flex-direction: column-reverse;

            border: 1px solid #ADBAC2;
            border-radius: 0.2rem;

            background: #fff;

            outline: 0px solid transparent;
            transition: outline 0.2s ease;

            cursor: text;
        }
        .container:focus-within{
            border-color: #D204B0;
            outline: 0.35rem solid #FECEF6;
        }

        .input-inline{
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .input{
            border: none;
            padding: 0px;
            margin: 0px;
            background: none;

            color: #0E2533;
            font-size: 1rem;
            font-weight: 400;
            font-family: inherit;

            padding: 0.5rem 0.75rem;
            flex-grow: 1;
        }
        .input::placeholder{
            color: transparent;
        }
        .input.hasPlaceholder::placeholder{
            color: #CBD5E1;
        }
        .input:focus{
            outline: none;
        }
        textarea.input{
            min-height: 8em;
        }

        .label{
            font-size: 0.9rem;
            font-weight: 400;

            /* Shrunk */
            color: #7E8E97;
            transform-origin: top left;
            transform: translate(0, -1.2rem) scale(0.75);
            transition: transform 0.2s ease, color 0.2s ease;
            background: #fff;

            padding: 0rem 0.5rem;

            position: absolute;
            top: 0.6rem;
            left: 0.25rem;
        }

        .container:focus-within .label{
            color: #D204B0;
        }

        .input:placeholder-shown:not(:focus) + .label{
            /* Full Size */
            color: #0E2533;
            transform: translate(0, 0) scale(1);
        }

        .error{
            color: red;
            font-weight: 500;
            font-size: 0.9rem;

            min-height: 1.35rem;

            margin-top: 0.5rem;
        }
    `;
}

customElements.define('floating-input', FloatingInput);

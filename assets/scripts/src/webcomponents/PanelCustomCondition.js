import { LitElement, css, html } from 'lit';
import { PanelInterface } from './PanelInterface.js';
import { api, setupCustomConditions } from '../utils';
import { toast } from './SnackBar';
import './FloatingInput';
import './IconButton';
import './OffCanvas';

export class PanelCustomCondition extends PanelInterface {
    static properties = {
        uuid: { type: String, state: true, reflect: true },
        value: { type: Object, reflect: true },

        error: { type: String, state: true }
    };

    static key = false;
    static route = 'popbot/v1/custom-conditions/';
    static defaultValue = {
        "title": "New Custom Condition",
        "callback": "return 1;",
    };

    _onChange(e) {
        this.value[e.target.name] = e.target.value;
        this.requestUpdate();
    }

    async save() {
        await super.save();
        setupCustomConditions();
    }

    async delete() {
        if (this.uuid > 0) {
            await api(`/popbot/v1/custom-conditions/${this.uuid}`, {}, "DELETE");
        }

        this._saveState();
        this.close();
        this.dispatchEvent(new CustomEvent('panel-interface-saved', {
            bubbles: true,
            cancelable: false,
        }));
        setupCustomConditions();
        toast("Condition deleted.");
        setTimeout(() => this.remove(), 501);
    }

    render() {
        return html`
            <off-canvas id="panel" header="Edit Custom Condition">
                <div class="wrapper">
                    <p class="info">
                        The value of the condition is evaluated on every page by the result of your callback function.
                    </p>

                    <div class="group">
                        <floating-input name="title" label="Condition Name" value="${this.value.title}" hide-errors @input="${this._onChange}"></floating-input>
                    </div>
                    
                    <div class="group">
                        <floating-input name="callback" label="Callback Function" type="code" value="${this.value.callback}" hide-errors @input="${this._onChange}"></floating-input>
                        
                        <p class="info">
                            This JavaScript code should return the value of the condition. True/false should be converted to 1/0 respectively.
                        </p>
                    </div>

                    <icon-button class="delete" @click="${this.delete}">Delete Condition</icon-button>
                </div>

                <div slot="options" class="options">
                    ${this.error ? html`<div class="error">${this.error}</div>` : html`<div></div>`}

                    <icon-button id="button" @click=${this.save}>Save Changes</icon-button>
                </div>
            </off-canvas>
        `;
    }

    static styles = css`
        .wrapper{
            display: grid;
            gap: 2.5rem;
            padding: 1.5rem;
        }

        floating-input{
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .info{
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: #586C77;
            margin: 0;
        }

        .info a{
            text-decoration: none;
            color: #D204B0;
        }
        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }

        .delete{
            --bg: #EF3838;
            --outline: #FFD2D2;
        }

        .error{
            border-radius: 0.2rem;
            background: #FFD2D2;

            color: #4E0C0C;
            font-size: 0.9rem;
            font-weight: 500;
            font-family: inherit;

            width: fit-content;
            padding: 0.5rem 1rem;
        }
    `;
}

customElements.define('panel-custom-condition', PanelCustomCondition);

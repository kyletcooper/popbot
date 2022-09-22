import { LitElement, css, html } from 'lit';
import { WRDPanelInterface } from './WRDPanelInterface.js';

export class WRDConditionsPanel extends WRDPanelInterface {
    static properties = {
        value: {
            type: Array,
            reflect: true,
        },
    };

    static key = "conditions";
    static defaultValue = [];

    connectedCallback() {
        super.connectedCallback();

        this._onChangeHandler = this._onChange.bind(this);
        this.renderRoot.addEventListener('wrd-condition-change', this._onChangeHandler);
    }

    _onChange(e) {
        let value = [];
        let conditionsElements = this.renderRoot.querySelectorAll("wrd-condition");

        conditionsElements.forEach(conditionElement => {
            value.push({
                condition: conditionElement.condition,
                comparison: conditionElement.comparison,
                value: conditionElement.value,
            });
        });

        this.value = value;
        this.requestUpdate();
    }

    remove() {
        this.value.pop();
        this.requestUpdate();
    }

    add() {
        this.value = [...this.value, { condition: "", comparison: "", value: "" }];
    }


    // STYLE

    static styles = css`
        .wrapper{
            padding: 1.5rem;
        }

        .info{
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: #586C77;

            margin: 0;
            margin-bottom: 2.5rem;
        }

        .info a{
            text-decoration: none;
            color: #D204B0;
        }

        wrd-condition{
            margin-bottom: 1.5rem;
        }

        .options{
            display: flex;
            justify-content: end;
        }
    `;



    // MARKUP

    render() {
        return html`
            <wrd-panel id="panel" header="Manage Conditions">
                <div class="wrapper">
                    <p class="info">
                        The PopBot will display when the Trigger fires and all these conditions are met. <a href="#">Learn more about Conditions</a>.
                    </p>

                    ${this.value.map((condition) => {
            return html`<wrd-condition condition="${condition.condition}" comparison="${condition.comparison}" value="${condition.value}"></wrd-condition>`
        })
            }

                    <wrd-icon class="remove" icon="remove" button @click=${this.remove}></wrd-icon>
        
                    <wrd-icon class="add" icon="add" button @click=${this.add}></wrd-icon>

                </div>

                <div slot="options" class="options">
                    <wrd-button id="button" @click=${this.save}>Save Changes</wrd-button>
                </div>
            </wrd-panel>
    `;
    }
}

customElements.define('wrd-conditions-panel', WRDConditionsPanel);

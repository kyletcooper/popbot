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

    getChip() {
        if (!this.value || !this.value.length) return false;

        return {
            label: `${this.value.length} Conditions`,
            icon: "task_alt",
            color: "#C60295",
        }
    }



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
        this.value = [...this.value, { condition: "url.href", comparison: "equal", value: "" }];
    }

    openPanelCustomConditions() {
        this.renderRoot?.querySelector("#customConditions")?.openPanel();
    }

    render() {
        return html`
            <wrd-panel id="panel" header="Manage Conditions">
                <div class="wrapper">
                    <p class="info">
                        The PopBot will display when the Trigger fires and all these conditions are met.
                    </p>

                    ${this.value.map((condition) => {
            return html`<wrd-condition condition="${condition.condition}" comparison="${condition.comparison}" value="${condition.value}"></wrd-condition>`
        })
            }

                    <wrd-icon class="remove" icon="remove" button @click=${this.remove}></wrd-icon>
        
                    <wrd-icon class="add" icon="add" button @click=${this.add}></wrd-icon>

                </div>

                <div slot="options" class="options">
                    <wrd-button secondary id="button" @click=${this.openPanelCustomConditions}>Custom Conditions</wrd-button>
                    <wrd-button id="button" @click=${this.save}>Save Changes</wrd-button>
                </div>

                <wrd-custom-conditions-panel id="customConditions"></wrd-custom-conditions-panel>
            </wrd-panel>
    `;
    }

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
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }
    `;
}

customElements.define('wrd-conditions-panel', WRDConditionsPanel);

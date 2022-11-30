import { LitElement, css, html } from 'lit';
import { PanelInterface } from './PanelInterface.js';
import './PanelCustomConditions';
import './OffCanvas';
import './ConditionRule';
import './IconLabel';
import './IconButton';

export class PanelConditions extends PanelInterface {
    static properties = {
        uuid: { type: String },
        value: { type: Array, state: true },
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
        this.renderRoot.addEventListener('change', this._onChange.bind(this));
    }

    _onChange(e) {
        let value = [];
        let conditionsElements = this.renderRoot.querySelectorAll("condition-rule");

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
        this.renderRoot?.querySelector("#customConditions")?.open();
    }

    render() {
        return html`
            <off-canvas id="panel" header="Manage Conditions">
                <div class="wrapper">
                    <p class="info">
                        The PopBot will display when the Trigger fires and all these conditions are met.
                    </p>

                    ${this.value.map((condition) => {
            return html`<condition-rule condition="${condition.condition}" comparison="${condition.comparison}" value="${condition.value}"></condition-rule>`
        })
            }

                    <icon-label class="remove" icon="remove" button @click=${this.remove}></icon-label>
        
                    <icon-label class="add" icon="add" button @click=${this.add}></icon-label>

                </div>

                <div slot="options" class="options">
                    <icon-button secondary id="button" @click=${this.openPanelCustomConditions}>Custom Conditions</icon-button>
                    <icon-button id="button" @click=${this.save}>Save Changes</icon-button>
                </div>

                <panel-custom-conditions id="customConditions"></panel-custom-conditions>
            </off-canvas>
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

        condition-rule{
            margin-bottom: 1.5rem;
        }

        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }
    `;
}

customElements.define('panel-conditions', PanelConditions);

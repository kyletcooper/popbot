import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { WRDPanelInterface } from './WRDPanelInterface.js';

const categorise = (items, key) => {
    var result = [];

    items.forEach(item => {
        let found = false;

        result.forEach(cat => {
            if (cat.label == item[key]) {
                cat.items.push(item);
                found = true;
            }
        })

        if (!found) {
            result.push({
                label: item[key],
                items: [item]
            });
        }
    });

    return result;
}

export class WRDTriggerPanel extends WRDPanelInterface {
    static key = "trigger";
    static defaultValue = {
        trigger: null,
        threshold: null,
    };

    firstUpdated() {
        const optionsWrapper = this.renderRoot.querySelector(".options");

        optionsWrapper.addEventListener('wrd-input-change', e => {
            this.value = { ...this.value, threshold: e.detail.value };
        });
    }


    _getTrigger(triggerID) {
        for (let trigger of window.popbot.triggers) {
            if (trigger.id == triggerID) {
                return trigger;
            }
        }

        return false;
    }

    get trigger() {
        return this._getTrigger(this.value.trigger);
    }

    set trigger(value) {
        let trigger = this._getTrigger(value);

        if (!trigger) return false;

        let firstOption = trigger.options?.[0];

        this.value = {
            trigger: trigger.id,
            threshold: firstOption?.default ?? "",
        };
    }

    get threshold() {
        return this.value.threshold;
    }

    set threshold(value) {
        this.value = { ...this.value, threshold: value };
        this.requestUpdate();
    }

    _getOptionsHTML() {
        if (!this.trigger?.options) {
            return html`<div></div>`;
        }

        var defaultOption = {
            type: "text",
            default: "",
            label: "Option",
            name: "trigger_threshold"
        }

        return this.trigger.options.map((option) => {
            option = { ...defaultOption, ...option };

            if (this.threshold) {
                option.default = this.threshold;
            }

            return html`<wrd-input name="${option.name}" value="${option.default}" type="${option.type}" label="${option.label}" hide-errors></wrd-input>`;
        });
    }



    // STYLE

    static styles = css`
        .group{
            margin-top: 0.75rem;
            margin-bottom: 2.25rem;
        }

        .info{
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: #586C77;

            margin: 0;
            padding: 1.5rem;
        }
        .info a{
            text-decoration: none;
            color: #D204B0;
        }

        .groupTitle{
            margin: 0;
            padding: 0.75rem 1.5rem;

            text-transform: uppercase;
            font-family: inherit;
            color: #7E8E97;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .trigger{
            --bg: inherit;
            --selected: #D204B0;
            --highlight: #FECEF6;

            display: block;
            box-sizing: border-box;
            width: 100%;

            padding: 0.5rem 1.5rem;

            border: none;
            background: none;
            font-family: inherit;
            font-weight: inherit;
            font-size: inherit;
            text-align: left;

            position: relative;
            overflow: hidden;

            cursor: pointer;

            transition: background 0.2s ease;
        }

        .trigger:hover,
        .trigger:focus-within{
            background: #FFEFFC;
        }

        .trigger.selected{
            background: var(--highlight);
        }

        .trigger wrd-icon{
            --fill: #fff;
            --bg: inherit;

            font-weight: 500;
        }

        .trigger.selected wrd-icon{
            --bg: var(--selected);
            --text: var(--selected);
        }

        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }
    `;



    // MARKUP

    render() {
        let categorisedTriggers = categorise(window.popbot.triggers, "category");

        return html`
            <wrd-panel id="panel" header="Choose a Trigger">

                <p class="info">
                    When a trigger fires the PopBot will be displayed, so long as all conditions are met. PopBots with the same trigger are fired in order of priority. <a href="#">Learn more about Triggers</a>.
                </p>


                ${repeat(categorisedTriggers, (category) => category.label, (category) => html`
            
                <div class="group" style="--bg: ${category.items[0].color};">
                    <h3 class="groupTitle">
                        ${category.label}
                    </h3>

                    ${repeat(category.items, (item) => item.id, (item) => html`

                        <button type="button" class="trigger ${item.id == this.trigger?.id ? "selected" : "unselected"}" @click="${() => this.trigger = item.id}">
                            <wrd-icon icon="${item.icon}" label="${item.label}"></wrd-icon>
                        </button>

                    `)}

                </div>

                `)}


                <div slot="options" class="options">
                    ${this._getOptionsHTML()}
                
                    <wrd-button id="button" @click=${this.save}>Save Changes</wrd-button>
                </div>

            </wrd-panel>
        `;
    }
}

customElements.define('wrd-trigger-panel', WRDTriggerPanel);

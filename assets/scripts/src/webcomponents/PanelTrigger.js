import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { categorise } from '../utils';
import { PanelInterface } from './PanelInterface';
import { FloatingInput } from './FloatingInput';


export class PanelTrigger extends PanelInterface {
    static key = "trigger";
    static defaultValue = {
        trigger: null,
        threshold: null,
    };

    getChip() {
        if (!this.trigger) return false;

        return {
            label: this.trigger.label,
            icon: this.trigger.icon,
            color: this.trigger.color,
        }
    }

    firstUpdated() {
        const optionsWrapper = this.renderRoot.querySelector(".options");

        optionsWrapper.addEventListener('change', e => {
            this.treshold = e.detail.value;
        });
    }


    _getTrigger(triggerID) {
        if (!window.popbot?.triggers || !window.popbot?.triggers?.length) {
            return false;
        }

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
            value: "",
            placeholder: "",
            label: "Option",
            name: "trigger_threshold"
        }

        return this.trigger.options.map((option) => {
            option = { ...defaultOption, ...option };

            if (this.threshold) {
                option.value = this.threshold;
            }

            return html`<floating-input name="${option.name}" value="${option.value}" placeholder="${option.placeholder}" type="${option.type}" label="${option.label}" hide-errors></floating-input>`;
        });
    }


    render() {
        let categorisedTriggers = categorise(window.popbot.triggers, "category");

        return html`
            <off-canvas id="panel" header="Choose a Trigger">

                <p class="info">
                    When a trigger fires the PopBot will be displayed, so long as all conditions are met.
                </p>


                ${repeat(categorisedTriggers, (category) => category.label, (category) => html`
            
                <div class="group" style="--bg: ${category.items[0].color};">
                    <h3 class="groupTitle">
                        ${category.label}
                    </h3>

                    ${repeat(category.items, (item) => item.id, (item) => html`

                        <button type="button" class="trigger ${item.id == this.trigger?.id ? "selected" : "unselected"}" @click="${() => this.trigger = item.id}">
                            <icon-label icon="${item.icon}" label="${item.label}"></icon-label>
                        </button>

                    `)}

                </div>

                `)}


                <div slot="options" class="options">
                    ${this._getOptionsHTML()}
                
                    <icon-button id="button" @click=${this.save}>Save Changes</icon-button>
                </div>

            </off-canvas>
        `;
    }

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

        .trigger icon-label{
            --fill: #fff;
            --bg: inherit;
            --gap: 1rem;

            font-weight: 500;
        }

        .trigger.selected icon-label{
            --bg: var(--selected);
            --text: var(--selected);
        }

        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }
    `;
}

customElements.define('panel-trigger', PanelTrigger);

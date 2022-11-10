import { LitElement, css, html } from 'lit';

const renderOptGroups = (groups, selected) => {
    return groups.map(group => {

        return html`
            <optgroup label="${group.label}">
                ${group.items.map(option => {
            return html`<option value="${option.id}" ?selected=${selected == option.id}>${option.label}</option>`
        })}
            </optgroup>
        `;

    });
}

const renderOptions = (items, selected) => {
    return items.map(item => {
        return html`<option value="${item.id}" ?selected=${selected == item.id}>${item.label}</option>`
    });
}

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

export class WRDCondition extends LitElement {
    static properties = {
        condition: {
            relect: true,
        },

        comparison: {
            relect: true,
        },

        value: {
            relect: true,
        },

        interval: { type: String, state: true },
    };

    _onUpdateValue(property) {
        let input = this.renderRoot.querySelector(`[name="${property}"]`);
        if (!input) return;

        this[property] = input.value;

        if (property == "condition") {
            let condition = window.popbot.conditions.find(cond => cond.id == this.condition);

            if (condition.options && !condition.options.find(opt => opt.id == this.value)) {
                // This has options and what we have isn't one of them
                this.value = condition.options[0].id;
            }
        }

        this.requestUpdate();

        const event = new CustomEvent('wrd-condition-change', {
            bubbles: true,
            cancelable: true
        });

        this.dispatchEvent(event);
    }


    // STYLE

    static styles = css`
        :host{
            --border: #ADBAC2;

            --primary: #D204B0;
            --highlight: #FFEFFC;

            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        select,
        input{
            flex: 1;
            width: 100%;
            min-width: none;

            font-size: 1rem;
            font-family: inherit;
            font-weight: inherit;

            margin: none;
            padding: 0.5rem;

            background: none;
            border: none;
            
            border-bottom: 2px solid var(--border);
            border-radius: 2px;

            transition: border-bottom-color 0.2s ease;
        }
        select optgroup,
        select option{
            background: #fff;
        }

        select:focus,
        input:focus{
            outline: none;
            background: var(--highlight);
            border-bottom-color: var(--primary);
        }
    `;



    // MARKUP

    render() {
        let categorisedConditions = categorise(window.popbot.conditions, "category");
        let condition = window.popbot.conditions.find(cond => cond.id == this.condition);

        return html`
            <select name="condition" @input="${() => { this._onUpdateValue("condition") }}" @focus="${e => this.requestUpdate()}">
                ${renderOptGroups(categorisedConditions, this.condition)}
            </select>

            <select name="comparison" @input="${() => { this._onUpdateValue("comparison") }}">
                ${renderOptions(window.popbot.comparisons, this.comparison)}
            </select>

            ${condition?.options ?
                html`<select name="value" @input="${() => { this._onUpdateValue("value") }}" .value="${this.value}">
                ${renderOptions(condition?.options, this.value)}
                </select>`
                :
                html`<input name="value" @input="${() => { this._onUpdateValue("value") }}" .value="${this.value}" placeholder="Value" />`
            }
        `;
    }
}

customElements.define('wrd-condition', WRDCondition);

import { LitElement, css, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { api } from '../utils';
import { PartialTemplate } from './PartialTemplate';

export class TemplatePicker extends LitElement {
    static properties = {
        category: {},
        count: { type: Number },
        sort: {},
        loading: { type: Boolean },

        _templates: { type: Array, state: true },
    };

    constructor() {
        super();

        this.category = "";
        this.count = 20;
        this.sort = "count";
        this._templates = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this._getTemplates();
    }

    async _getTemplates() {
        this._templates = await api('/popbot/v1/templates', { category: this.category, per_page: this.count });
    }

    async create(template) {
        this.loading = true;
        const bot = await api('/popbot/v1/popbots', { template: template }, 'POST');
        window.location.href = bot.edit_link;
    }

    render() {
        return html`
            <div class="container" ?inert="${this.loading}">
                <slot class="label"></slot>

                <div class="templates">
                    ${map(this._templates, template => html`
                        <tool-tip label="Create from Template">
                            <button type="button" role="button" @click="${() => { this.create(template.slug) }}">
                                <partial-template .template="${template}"></partial-template>
                            </button>
                        </tool-tip>
                    `)}
                </div>
            </div>
        `;
    }

    static styles = css`
        .templates{
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fit, minmax(25ch, 1fr));
        }
        
        button{
            display: block;
            width: 100%;
            height: 100%;
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            font-family: inherit;
            text-align: inherit;
            font-weight: inherit;
            font-size: inherit;
        }

    `;
}

customElements.define('template-picker', TemplatePicker);

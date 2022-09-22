import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { WRDPanelInterface } from './WRDPanelInterface.js';

export class WRDTemplateSettingsPanel extends WRDPanelInterface {
    static properties = {
        value: {
            type: Object,
            reflect: true,
        },

        settings: { state: true, type: Array },

        _loading: { state: true, type: Boolean },
    };

    static key = "template_settings";
    static defaultValue = {};

    constructor() {
        super();

        this.settings = [];
        this._getCurrentSettings(true);
    }

    createRenderRoot() {
        const root = super.createRenderRoot();

        root.addEventListener("wrd-input-change", (e) => {
            return this._onChange();
        });

        return root;
    }



    openPanel() {
        super.openPanel();
        this._getCurrentSettings();
    }

    _onChange() {
        let newValue = {};
        let form = this.renderRoot.querySelector("#form");
        let inps = form.elements;

        for (let inp of inps) {
            newValue[inp.name] = inp.value;
        }

        this.value = newValue;
        this.requestUpdate("value");
    }

    _getValue(setting) {
        if (this.value.hasOwnProperty(setting.name)) {
            return this.value[setting.name];
        }

        return setting.default ?? "";
    }

    async _getCurrentSettings(setValue = false) {
        var form_data = new FormData(); // We use formdata so $_POST is filled in PHP
        this._loading = true;

        form_data.append("action", "templateSettings");
        form_data.append("post_id", window.popbot.wp.post_id);
        form_data.append("nonce", window.popbot.fetch.nonce);

        const responseRaw = await fetch(window.popbot.fetch.ajax_url, {
            method: 'POST',
            body: form_data
        });

        try {
            const response = await responseRaw.json();

            if (responseRaw.ok && response.success) {
                this.settings = response.data.settings;

                if (setValue) {
                    this.value = { ...response.data.values };
                }
            }
        }
        catch (e) {
            console.error(e);
        }

        this._loading = false;
    }


    // STYLE

    static styles = css`
        .wrapper{
            position: relative;
            padding: 1.5rem;
        }

        .wrapper.loading{
            background: red;
        }

        .options{
            display: flex;
            justify-content: end;
        }

        .loading{
            position: absolute;
            inset: 0;

            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            justify-content: center;

            font-size: 0.8rem;
            color: #64748b;

            background: rgba(255, 255, 255, 0.75);

            pointer-events: none;
            transition: opacity 0.2s ease;
        }

        .spinner {
            width: 2.5rem;
            height: 2.5rem;

            border-radius: 50%;
            border: 0.2rem solid currentColor;
            border-color: currentColor currentColor currentColor transparent;

            animation: spinner 1.2s linear infinite;
            transition: opacity 0.4s ease;
        }

        @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
        }

        .loading[hidden]{
            opacity: 0;
        }
    `;



    // MARKUP

    render() {
        return html`
            <wrd-panel id="panel" header="Template Settings">
                <form id="form" class="wrapper">
                    
                    ${repeat(this.settings, (item) => {
            return html`<wrd-input type="${item.type}" name="${item.name}" value="${this._getValue(item)}" label="${item.label ?? item.name}"></wrd-input>`;
        })}

        <div class="loading" ?hidden="${!this._loading}">
                        <div class="spinner"></div>
                        Loading...
                    </div>
                
                </form>

                <div slot="options" class="options">
                    <wrd-button id="button" @click=${this.save}>Save Changes</wrd-button>
                </div>
            </wrd-panel>
    `;
    }
}

customElements.define('wrd-template-settings-panel', WRDTemplateSettingsPanel);

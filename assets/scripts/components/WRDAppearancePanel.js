import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { WRDPanelInterface } from './WRDPanelInterface.js';

export class WRDAppearancePanel extends WRDPanelInterface {
    static properties = {
        value: {
            type: String,
            reflect: true,
        },

        _iframeLoading: { state: true }
    };

    static key = "template";
    static defaultValue = "";

    constructor() {
        super();

        this._iframeLoading = true;
    }



    async _chooseTemplate() {
        let panel = this.renderRoot.getElementById("changeTemplatePanel");
        let choice = WRDSelectPanelChoose(panel);

        choice.then(selection => {
            // If we have selected an item
            if (selection.length > 0) {
                this.requestUpdate('value');
            }
        }).catch(() => { })
    }

    async save() {
        this.renderRoot.querySelector(".editor")?.contentWindow?.wp?.data?.dispatch('core/editor')?.savePost();

        super.save();
    }

    _openSettings() {
        this.renderRoot.querySelector("#templateSettingsPanel")?.openPanel();
    }

    _onLoad(e) {
        this._iframeLoading = false;
    }



    // STYLE

    static styles = css`
        .container{
            height: 100%;

            position: relative;
        }

        .editor{
            display: block;
            width: 100%;
            height: 100%;

            border: none;
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

        .options{
            display: grid;
            grid-template-columns: auto auto 1fr;
            align-items: center;
            justify-items: end;
            gap: 0.5rem;
        }
    `;



    // MARKUP

    render() {
        return html`
            <wrd-panel id="panel" header="Customise Appearance">

                <wrd-template-settings-panel id="templateSettingsPanel"></wrd-template-settings-panel>
                
                <div class="container">
                    <wrd-select-panel id="changeTemplatePanel" max="1" header="Choose a Template">
                        ${repeat(window.popbot.templates, (template) => template.part_name, (template) => html`<wrd-part-preview key="${template.part_name}" part="${template.part_name}" name="${template.details.name}"></wrd-part-preview>`)}
                    </wrd-select-panel>

                    <div class="loading" ?hidden="${!this._iframeLoading}">
                        <div class="spinner"></div>
                        Loading...
                    </div>

                    <iframe class="editor" @load="${this._onLoad}" src="${`${window.popbot.wp.admin_url}post.php?post=${window.popbot.wp.post_id}&action=edit`}"></iframe>
                </div >


                <div slot="options" class="options">
                    <wrd-button @click="${this._chooseTemplate}" secondary > Change Template</wrd-button>
                    
                    <wrd-icon icon="settings" button @click="${this._openSettings}"></wrd-icon>
                
                    <wrd-button id="button" @click="${this.save}">Save Changes</wrd-button>
                </div>

            </wrd-panel>
    `;
    }
}

customElements.define('wrd-appearance-panel', WRDAppearancePanel);

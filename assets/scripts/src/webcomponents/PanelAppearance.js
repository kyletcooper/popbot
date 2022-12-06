import { css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { api } from '../utils';
import { PanelInterface } from './PanelInterface';
import './OffCanvas';
import './PanelSelect';
import './IconButton';
import './PartialTemplate';
import './ToolTip';
import './IconLabel';

export class PanelAppearance extends PanelInterface {
    static properties = {
        uuid: { type: String },
        value: { type: String, state: true },

        _iframeLoading: { state: true },
        _templates: { type: Array, state: true }
    };

    static key = "template";
    static defaultValue = "";

    getChip() {
        if (!this.value) return false;

        return {
            label: this.value,
            icon: "dashboard",
            color: "#C60295",
        }
    }

    constructor() {
        super();
        this._iframeLoading = true;
        this._templates = [];
        this._getTemplates();
    }


    async _getTemplates() {
        this._templates = await api('/popbot/v1/templates');
        this.requestUpdate();
    }

    async _chooseTemplate() {
        const panel = this.renderRoot.getElementById("changeTemplatePanel");
        const choice = panel.choose();

        choice.then(selection => {
            // If we have selected an item
            if (selection.length > 0) {
                this.value = selection[0];
                this.requestUpdate('value');
            }
        }).catch(() => { });
    }

    _getEditorURL(panelMode) {
        let url = `${window.popbot.admin_url}post.php?post=${window.popbot.post_id}&action=edit`;
        if (panelMode) url += '&panelmode=true';
        return url;
    }

    _openInFullEditor() {
        window.open(this._getEditorURL(false), '_blank').focus();
    }

    async save() {
        this.renderRoot.querySelector(".editor")?.contentWindow?.wp?.data?.dispatch('core/editor')?.savePost();
        super.save();
    }


    render() {
        return html`
            <off-canvas id="panel" header="Customise Appearance">
                
                <div class="container">
                    <panel-select id="changeTemplatePanel" max="1" header="Choose a Template">
                        ${repeat(this._templates, (template) => template.slug, (template) => html`<partial-template key="${template.slug}" .template="${template}"></partial-template>`)}
                    </panel-select>

                    <div class="loading" ?hidden="${!this._iframeLoading}">
                        <div class="spinner"></div>
                        Loading...
                    </div>

                    <iframe class="editor" @load="${() => this._iframeLoading = false}" src="${this._getEditorURL(true)}"></iframe>
                </div >


                <div slot="options" class="options">
                    <icon-button @click="${this._chooseTemplate}" secondary>Change Template</icon-button>
                    <tool-tip label="Open in Full Editor"><icon-label icon="open_in_new" button @click="${this._openInFullEditor}"></icon-label></tool-tip>
                
                    <icon-button id="button" @click="${this.save}">Save Changes</icon-button>
                </div>

            </off-canvas>
    `;
    }

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
}

customElements.define('panel-appearance', PanelAppearance);

import { LitElement, css, html } from 'lit';

export class WRDBotPreview extends LitElement {
    static properties = {
        post: { type: Number },
        errors: { state: true },
        scale: { type: Number },
        showControls: { attribute: "show-controls", type: Boolean },
        showErrors: { attribute: "show-errors", type: Boolean },
    };

    constructor() {
        super();

        this.showControls = false;
        this.showErrors = false;
        this.scale = 1;
        this.post = -1;
        this.errors = [];

        this.refreshErrors();

        document.addEventListener("wrd-panel-interface-saved", e => {
            this.refreshPreview();
            this.refreshErrors();
        });

        document.addEventListener("wrd-visibility-toggle-change", e => {
            this.refreshErrors();
        });
    }

    _onLoad(e) {
        e.target.classList.remove("loading");
    }

    _getURL(scale = this.scale) {
        return `${window.popbot.wp.home_url}/popBotPreview?post=${this.post}&scale=${scale}`;
    }

    refreshPreview() {
        let preview = this.renderRoot.querySelector("iframe");
        preview.classList.add("loading");
        preview.contentWindow.location.reload();
    }

    openInNewTab() {
        window.open(this._getURL(1), '_blank').focus();
    }

    async refreshErrors() {
        var form_data = new FormData(); // We use formdata so $_POST is filled in PHP

        form_data.append("action", "getErrors");
        form_data.append("post_id", window.popbot.wp.post_id);
        form_data.append("nonce", window.popbot.fetch.nonce);

        const responseRaw = await fetch(window.popbot.fetch.ajax_url, {
            method: 'POST',
            body: form_data
        });

        const response = await responseRaw.json();

        if (responseRaw.ok && response.success) {
            this.errors = response.data.data;
        }
    }



    // STYLE

    static styles = css`
        *{
            box-sizing: border-box;
        }

        :host{
            display: block;
        }

        .container{
            display: flex;
            flex-direction: column;
            min-height: inherit;
        }

        .iframeWrapper{
            position: relative;

            background: #f8fafc;

            overflow: hidden;

            height: 100%;
            flex-grow: 1;

            border-radius: 0.25rem;
        }

        .iframe{
            display: block;
            position: absolute;
            inset: 0.5rem;

            border: none;
            padding: 0;
            margin: 0;

            pointer-events: none;

            width: calc(100% - 1rem);
            height: calc(100% - 1rem);
        }

        .iframeLoader {
            width: 2.5rem;
            height: 2.5rem;

            position: absolute;
            top: calc(50% - 1.25rem);
            left: calc(50% - 1.25rem);

            border-radius: 50%;
            border: 0.2rem solid currentColor;
            border-color: currentColor currentColor currentColor transparent;

            animation: spinner 1.2s linear infinite;
            transition: opacity 0.4s ease;

            opacity: 0;
        }

        .iframe.loading{
            opacity: 0.5;
        }

        .iframe.loading ~ .iframeLoader{
            opacity: 1;
        }

        @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
        }

        .controls{
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;

            display: flex;
            gap: 0.5rem;
        }
        .controls wrd-icon{
            --size: 32px;
        }
        
        .ol{
            list-style: none;
            margin: 0;
            padding: 0;

            margin-top: 1rem;
        }

        .li{
            display: flex;
            align-items: center;
            font-weight: 500;
        }
    `;



    // MARKUP

    render() {
        return html`
            <div class="container">
                <div class="iframeWrapper">
                    <iframe loading="eager" src="${this._getURL()}" class="iframe loading" @load="${this._onLoad}"></iframe>
                    <div class="iframeLoader"></div>
                    <div class="controls">
                        <wrd-icon button icon="refresh" @click="${this.refreshPreview}"></wrd-icon>
                        <wrd-icon button icon="open_in_new" @click="${this.openInNewTab}"></wrd-icon>
                    </div>
                </div>

                ${this.showErrors ? html`
                <ol class="ol">
                    ${this.errors.map(error => {
            return html`
                            <li class="li">
                                <wrd-icon icon="error" style="--size: 35px; --fill: #f43f5e"></wrd-icon>
                                ${error}
                            </li>`
        })}
                </ol>` : null}
            </div>
            `;
    }
}

customElements.define('wrd-bot-preview', WRDBotPreview);

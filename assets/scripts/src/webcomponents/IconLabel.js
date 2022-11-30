import { LitElement, css, html } from 'lit';

export class IconLabel extends LitElement {
    static properties = {
        label: {},
        icon: {},
        button: { type: Boolean },
        reverse: { type: Boolean },

        _fontLoaded: { type: Boolean, state: true },
    };

    constructor() {
        super();

        this.label = "";
        this.icon = "done";
        this.button = false;
        this.reverse = false;

        this._fontLoaded = document.fonts.check("24px Material Icons");

        document.fonts.ready.then(() => {
            this._fontLoaded = true;
        });
    }


    render() {
        if (this.button) {
            return html`
                <button class="container ${this.reverse ? "reverse" : null}">

                    <div class="icon ${this._fontLoaded ? "loaded" : "loading"}">
                        ${this.icon}
                    </div>

                    ${this.label ?
                    html`
                            <div class="label">
                                ${this.label}
                            </div>
                            `
                    :
                    null
                }
                </button>
            `;
        }
        else {
            return html`
                <div class="container ${this.reverse ? "reverse" : null}">

                    <div class="icon ${this._fontLoaded ? "loaded" : "loading"}">
                        ${this.icon}
                    </div>

                    ${this.label ?
                    html`
                            <div class="label">
                                ${this.label}
                            </div>
                            `
                    :
                    null
                }
                </div>
            `;
        }
    }

    static styles = css`
        :host{
            --fill: black;
            --text: black;
            --bg: transparent;
            --size: 48px;
            --gap: 0.5rem;

            display: inline-block;
        }

        :host([tabindex]){
            cursor: pointer;
        }

        .container{
            display: flex;
            align-items: center;
            justify-content: start;
            gap: var(--gap);

            background: none;
            padding: 0;
            margin: 0;
            border: 0;

            transition: all 0.2s ease;
        }
        .container.reverse{
            flex-direction: row-reverse;
        }

        button.container{
            cursor: pointer;
        }
        button.container:focus-visible{
            outline: none;
        }

        .icon{
            display: flex;
            align-items: center;
            justify-content: center;

            width: var(--size);
            height: var(--size);

            border-radius: 20rem;

            background: var(--bg);
            color: var(--fill);

            box-shadow: inset 0 0 0 0px rgba(0, 0, 0, 0);
            transition: all 0.2s ease;

            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            font-size: calc(var(--size) / 2);
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;

            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            /* Support for all WebKit browsers. */
            -webkit-font-smoothing: antialiased;
            /* Support for Safari and Chrome. */
            text-rendering: optimizeLegibility;

            /* Support for Firefox. */
            -moz-osx-font-smoothing: grayscale;

            /* Support for IE. */
            font-feature-settings: 'liga';
        }
        .icon.loading{
            opacity: 0;
        }

        button.container:hover .icon,
        button.container:focus .icon{
            box-shadow: inset 0 0 0 calc(var(--size) / 2) rgba(0, 0, 0, 0.1);
        }

        .label{
            color: var(--text);
        }
    `;
}

customElements.define('icon-label', IconLabel);

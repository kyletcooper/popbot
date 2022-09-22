import { LitElement, css, html } from 'lit';

export class WRDIcon extends LitElement {
    static properties = {
        label: {},
        icon: {},
        button: { type: Boolean }
    };

    constructor() {
        super();

        this.label = "";
        this.icon = "done";
        this.button = false;
    }



    // STYLE

    static styles = css`
        :host{
            --fill: black;
            --text: black;
            --bg: transparent;
            --size: 48px;

            display: inline-block;
        }

        :host([tabindex]){
            cursor: pointer;
        }

        .container{
            display: flex;
            align-items: center;
            justify-content: start;
            gap: 0.5rem;

            background: none;
            padding: 0;
            margin: 0;
            border: 0;

            transition: all 0.2s ease;
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
            font-size: calc(var(--size) / 2);  /* Preferred icon size */
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;

            /* Support for all WebKit browsers. */
            -webkit-font-smoothing: antialiased;
            /* Support for Safari and Chrome. */
            text-rendering: optimizeLegibility;

            /* Support for Firefox. */
            -moz-osx-font-smoothing: grayscale;

            /* Support for IE. */
            font-feature-settings: 'liga';
        }

        button.container:hover .icon,
        button.container:focus .icon{
            box-shadow: inset 0 0 0 calc(var(--size) / 2) rgba(0, 0, 0, 0.1);
        }

        .label{
            color: var(--text);
        }
    `;



    // MARKUP

    render() {
        if (this.button) {
            return html`
                <button class="container">

                    <div class="icon">
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
                <div class="container">

                    <div class="icon">
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
}

customElements.define('wrd-icon', WRDIcon);

import { LitElement, css, html } from 'lit';

export class WRDButton extends LitElement {
    static properties = {
        icon: {},

        secondary: { type: Boolean },
        loading: { type: Boolean, reflect: true }
    };

    constructor() {
        super();

        this.disabled = false;
        this.loading = false;
    }



    // STYLE

    static styles = css`
        :host{
            --text: white;
            --bg: #AF0092;
            --load-1: #E615C3;
            --load-2: #F15AD7;
            --outline: #FECEF6;

            display: block;
            width: fit-content;
        }
        
        .button{
            border: none;
            margin: 0;

            display: flex;
            align-items: center;
            justify-content: start;
            gap: 1rem;

            width: fit-content;

            padding: 0.5rem 1rem;
            border: 1px solid transparent; /* Helps it line up with inputs */

            color: var(--text);
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            font-size: inherit;
            font-family: inherit;
            text-overflow: ellipsis;

            cursor: pointer;

            border-radius: 0.2rem;
            background: var(--bg);
            box-shadow: inset 0 0 0 0px rgba(0, 0, 0, 0);
            transition: box-shadow 0.1s ease-in, outline 0.2s ease;

            position: relative;
        }
        .button:hover,
        .button:focus{
            box-shadow: inset 0 0 0 3rem rgba(0, 0, 0, 0.25);
        }

        .button:focus-visible{
            outline: 0.3rem solid var(--outline);
            outline-offset: none;
        }

        .icon{
            --fill: var(--text);
        }

        .button[disabled]{
            background: gray;
            pointer-events: none;
        }

        .button.loading{
            box-shadow: inset 0 0 0 0px rgba(0, 0, 0, 0);
            background: repeating-linear-gradient(
                45deg,
                var(--load-1),
                var(--load-1) 1.5rem,
                var(--load-2) 1.5rem,
                var(--load-2) 3rem
              );
            background-size: 200% 200%;
            animation: loading 2s linear infinite;
        }
        @keyframes loading{
            100% {
                background-position: 100% 100%;
            }
        }

        .button.secondary{
            color: var(--bg);
            background: transparent;
            outline-offset: -2px;
            outline: 2px solid var(--bg);
            transition: filter 0.2s ease;
        }
        .button.secondary:hover,
        .button.secondary:focus{
            box-shadow: none;
            filter: brightness(1.25);
        }
    `;



    // MARKUP

    render() {
        return html`
            <button class="button ${this.loading ? "loading" : null} ${this.secondary ? "secondary" : null}" role="button" onclick="${this.btnOnclick}" ?disabled=${this.loading || this.disabled}>
                ${this.icon ? html`<wrd-icon class="icon" icon="${this.icon}">` : null}
                
                <slot></slot>
            </button>
        `;
    }
}

customElements.define('wrd-button', WRDButton);

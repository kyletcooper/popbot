import { LitElement, css, html } from 'lit';

export class WRDPartPreview extends LitElement {
    static properties = {
        part: {},
        name: {},
        image: {},
        scale: { type: Number },
    };

    constructor() {
        super();

        this.name = "";
        this.part = "";
        this.image = false;
        this.scale = 0.5;
    }



    // STYLE

    static styles = css`
        :host{
            --bg: #f1f5f9;
            --text: #0f172a;

            display: block;
        }

        *{
            box-sizing: border-box;
        }
        
        .iframe-wrapper{
            padding: 1rem;
            margin-bottom: 0.5rem;
            
            background: var(--bg);
            border-radius: 0.5rem;

            transition: background 0.2s ease;
        }

        iframe{
            pointer-events: none;
            
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                supported by Chrome, Edge, Opera and Firefox */

            width: 100%;
            height: 150px;

            border: none;
            margin: 0;
            padding: 0;
        }

        .image{
            width: 100%;
            height: 150px;
            margin-bottom: 0.5rem;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            background-color: #f1f5f9;
            border-radius: 0.5rem;
        }

        .name{
            font-size: 1rem;
            font-weight: 500;
            color: var(--text);

            margin: 0;

            transition: color 0.2s ease;
        }


        :host(.selected){
            --bg: #FECEF6;
            --text: #AF0092;
        }
    `;



    // MARKUP

    render() {
        return html`
            <div class="container">
                ${this.image ?
                html`
                    <div class="image" style="background-image: url(${this.image})"></div>` :

                html`
                    <div class="iframe-wrapper">
                        <iframe loading="lazy" src="${`${window.popbot.wp.home_url}/popBotPreview?part=${this.part}&scale=${this.scale}`}"></iframe>
                    </div>
                `}

                <h3 class="name">${this.name}</h3>
            </div>
        `;
    }
}

customElements.define('wrd-part-preview', WRDPartPreview);

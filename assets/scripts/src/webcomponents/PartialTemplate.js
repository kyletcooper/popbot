import { LitElement, css, html } from 'lit';

export class PartialTemplate extends LitElement {
    static properties = {
        template: { type: Object },
    };

    render() {
        return html`
            <div class="container">
                ${this.template?.image ?
                html`
                    <div class="image" style="background-image: url(${this.template?.image})"></div>` :

                html`
                    <div class="iframe-wrapper">
                        <iframe loading="lazy" src="${this.template?.preview}"></iframe>
                    </div>
                `}

                <h3 class="name">${this.template?.details.name}</h3>
            </div>
        `;
    }

    static styles = css`
        :host{
            --outline: 0px solid var(--theme-100);
            --text: #0f172a;

            display: block;
        }

        *{
            box-sizing: border-box;
        }
        
        .iframe-wrapper{
            padding: 1rem;
            margin-bottom: 0.5rem;
            
            background: #f1f5f9;
            outline: var(--outline);
            border-radius: 0.5rem;
            transition: outline 0.2s ease;
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
            outline: var(--outline);
            transition: outline 0.2s ease;
        }

        .name{
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;
            color: var(--text);

            margin: 0;

            transition: color 0.2s ease;
        }


        :host(.selected){
            --outline: 5px solid var(--theme-100);
            --text: var(--theme-700);
        }
    `;
}

customElements.define('partial-template', PartialTemplate);

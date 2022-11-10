import { LitElement, css, html } from 'lit';

export class WRDHeader extends LitElement {
    static properties = {
        back: { type: Boolean },
        label: {},
    }



    static styles = css`
        .header{
            position: sticky;
            top: 32px;
            z-index: 10;

            height: 85px;

            background: white;
            box-shadow: 0 10px 15px -3px rgb(254 206 246 / 0.3), 0 4px 6px -4px rgb(254 206 246 / 0.3);
        }

        .container{
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 1.5rem;
            height: 100%;
        }

        .title{
            font-size: 1.25rem;
            line-height: 1.75rem;
            font-weight: 500;
            color: rgb(15 23 42);
        }

        .slot{
            display: flex;
            gap: 0.5rem;
            margin-left: auto;
        }
    `;



    // MARKUP

    render() {
        return html`
            <header class="header">
                <wrd-container class="container">
                        
                        ${this.back ? html`
                            <a href="${window.popbot.wp.plugin_home_url}">
                                <wrd-icon icon="arrow_back" button></wrd-icon>
                            </a>`
                : null}
                
                        <h1 class="title">
                            <slot name="title"></slot>
                            ${this.label}
                        </h1>

                        <div class="slot">
                            <slot></slot>
                        </div>
                        
                </wrd-container>
            </header>
        `;
    }
}

customElements.define('wrd-header', WRDHeader);

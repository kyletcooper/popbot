import { LitElement, css, html } from 'lit';
import './IconLabel';

export class NavBar extends LitElement {
    static properties = {
        back: { type: Boolean },
        label: {},
    }

    render() {
        return html`
            <header class="header">
                    ${this.back ? html`
                        <a href="${window.popbot.plugin_url}">
                            <icon-label icon="arrow_back" button></icon-label>
                        </a>`
                : null}
            
                    <h1 class="title">
                        <slot name="title"></slot>
                        ${this.label}
                    </h1>

                    <div class="actions">
                        <slot></slot>
                    </div>
            </header>
        `;
    }

    static styles = css`
        .header{
            position: sticky;
            top: 32px;
            z-index: 10;

            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 1.5rem;
            align-items: center;
            padding: 0 5vw;

            height: 85px;
            overflow: hidden;

            background: white;
            box-shadow: 0 10px 15px -3px rgb(254 206 246 / 0.3), 0 4px 6px -4px rgb(254 206 246 / 0.3);
        }

        @media screen and (max-width: 782px){
            .header{
                top: 46px;
            }
        }

        @media screen and (max-width: 600px){
            .header{
                top: 0;
            }
        }

        .title{
            font-size: 1.25rem;
            line-height: 1.75rem;
            font-weight: 500;
            color: rgb(15 23 42);
        }

        .actions{
            display: none;
        }

        @media (min-width: 726px){
            .actions{
                display: flex;
                gap: 0.5rem;
                margin-left: auto;
            }
        }
    `;
}

customElements.define('nav-bar', NavBar);

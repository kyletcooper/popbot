import { LitElement, css, html } from 'lit';

export class WRDScroller extends LitElement {

    static styles = css`
        .scroller{
            position: absolute;
            right: 0;
            left: 0;

            overflow-x: auto;

            padding-left: var(--container-distance);
            padding-bottom: 1rem;
        }

        .grid{
            display: grid;
            grid-auto-flow: column;
            grid-template-rows: 1fr;
            grid-template-columns: repeat(20rem, auto);
            gap: 1rem;
        }
        .grid::after {
            content: "";
            display: block;
            width: 2rem;
            height: 1px;
        }

        ::-webkit-scrollbar {
            height: 0.5em;
        }
        ::-webkit-scrollbar-track {
            background: none;
        }
        ::-webkit-scrollbar-thumb {
            background-color: rgb(71, 85, 105, 0.2);
            border-radius: 100vw;
            transition: background-color 0.2s ease;
        }
        ::-webkit-scrollbar-thumb:hover{
            background-color: rgb(210, 4, 176, 0.2);
        }
        ::-webkit-scrollbar-thumb:active{
            background-color: #D204B0;
        }

        .spacer{
            pointer-events: none;
        }

        .scroller {
            --container-width: 100%;
            --container-padding: 1rem;
            --padding-left: 2rem;
            /* (Half of the page width - container width) plus padding */
            --container-distance: calc(  ((100% - var(--container-width)) / 2) + var(--container-padding) + var(--padding-left) );
        }
        @media (min-width: 640px) {
            .scroller {
                --container-width: 640px;
                --container-padding: 1.5rem;
            }
        }
        @media (min-width: 768px) {
            .scroller {
                --container-width: 768px;
            }
        }
        @media (min-width: 1024px) {
            .scroller {
                --container-width: 1024px;
                --container-padding: 2rem;
            }
        }
        @media (min-width: 1280px) {
            .scroller {
                --container-width: 1280px;
                --container-padding: 2.5rem;
            }
        }
        @media (min-width: 1536px) {
            .scroller {
                --container-width: 1536px;
                --container-padding: 4rem;
            }
        }
    `;

    constructor() {
        super();
        window.addEventListener("resize", this._onResize);
    }

    updated() {
        this._onResize();
    }

    _onResize(e) {
        let spacer = this.renderRoot.querySelector(".spacer");
        let scroller = this.renderRoot.querySelector(".scroller");

        spacer.style.height = scroller.offsetHeight + "px";
    }



    // MARKUP

    render() {
        return html`
            <div class="scroller">
                <div class="grid">
                    <slot @slotchange="${this._onResize}"></slot>
                </div>
            </div>

            <div class="spacer"></div>
        `;
    }
}

customElements.define('wrd-scroller', WRDScroller);

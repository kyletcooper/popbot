import { LitElement, css, html } from 'lit';

export class WRDContainer extends LitElement {
    static styles = css`
        :host {
            display: block;
            box-sizing: border-box;
            width: 100%;
            margin-right: auto;
            margin-left: auto;
            padding-right: 1rem/* 16px */;
            padding-left: 1rem/* 16px */;
        }
        @media (min-width: 640px) {
            :host {
                max-width: 640px;
                padding-right: 1.5rem/* 24px */;
                padding-left: 1.5rem/* 24px */;
            }
        }
        @media (min-width: 768px) {
            :host {
                max-width: 768px;
            }
        }
        @media (min-width: 1024px) {
            :host {
                max-width: 1024px;
                padding-right: 2rem/* 32px */;
                padding-left: 2rem/* 32px */;
            }
        }
        @media (min-width: 1280px) {
            :host {
                max-width: 1280px;
                padding-right: 2.5rem/* 40px */;
                padding-left: 2.5rem/* 40px */;
            }
        }
        @media (min-width: 1536px) {
            :host {
                max-width: 1536px;
                padding-right: 4rem/* 64px */;
                padding-left: 4rem/* 64px */;
            }
        }
    `;



    // MARKUP

    render() {
        return html`
                <slot></slot>
        `;
    }
}

customElements.define('wrd-container', WRDContainer);

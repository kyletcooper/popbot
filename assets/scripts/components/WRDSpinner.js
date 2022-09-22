import { LitElement, css, html } from 'lit';

export class WRDSpinner extends LitElement {
    static properties = {
        active: { type: Boolean }
    }

    succeed() {
        this.renderRoot.querySelector(".success").animate([
            {
                opacity: 0,
            },
            {
                opacity: 1,
            },
            {
                opacity: 0,
            }
        ], {
            duration: 1500,
            iterations: 1,
        });
    }

    fail() {
        this.renderRoot.querySelector(".fail").animate([
            {
                opacity: 0,
            },
            {
                opacity: 1,
            },
            {
                opacity: 0,
            }
        ], {
            duration: 1500,
            iterations: 1,
        });
    }




    // STYLE

    static styles = css`
        :host{
            --size: 1.25rem;
            --color: #64748b;

            position: relative;
        }

        .spinner {
            width: var(--size);
            height: var(--size);

            border-radius: 50%;
            border: calc(var(--size) / 5) solid var(--color);
            border-color: var(--color) var(--color) var(--color) transparent;

            animation: spinner 1.2s linear infinite;
            transition: opacity 0.2s ease;
        }
        
        .spinner.inactive{
            opacity: 0;
        }

        @keyframes spinner {
            0% {
            transform: rotate(0deg);
            }
            100% {
            transform: rotate(360deg);
            }
        }

        .fail{
            position: absolute;
            top: 10%;
            left: -20%;

            width: var(--size);
            height: var(--size);

            opacity: 0;
        }
        .fail::after,
        .fail::before{
            content: '';

            display: block;
            position: absolute;

            width: var(--size);
            height: calc(var(--size) / 5);

            background: #f43f5e;
        }
        .fail::before{
            top: 50%;
            left: 50%;
            transform: rotate(45deg);
        }
        .fail::after{
            top: 50%;
            left: 50%;
            transform: rotate(-45deg);
        }

        .success{
            position: absolute;
            top: 10%;
            left: -20%;

            width: var(--size);
            height: var(--size);

            opacity: 0;
        }
        .success::after,
        .success::before{
            content: '';

            display: block;
            position: absolute;
            height: calc(var(--size) / 5);

            background: #10b981;
        }
        .success::before{
            top: 50%;
            left: 65%;
            transform: rotate(-45deg);

            width: var(--size);
        }
        .success::after{
            top: 60%;
            left: 50%;
            transform: rotate(45deg);

            width: calc(var(--size) / 3);
        }
    `;



    // MARKUP

    render() {
        return html`
            <div class="spinner ${this.active ? "active" : "inactive"}"></div>

            <div class="success"></div>
            <div class="fail"></div>
        `;
    }
}

customElements.define('wrd-spinner', WRDSpinner);

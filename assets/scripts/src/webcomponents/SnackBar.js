import { LitElement, css, html } from 'lit';

export class SnackBar extends LitElement {
    constructor() {
        super();

        setTimeout(() => {
            this.hide();
        }, 3000);
    }

    hide() {
        setTimeout(() => {
            this.remove();
        }, 300);

        this.renderRoot.querySelector(".toast").classList.add("out");
    }

    render() {
        return html`
            <div class="toast">
                <slot></slot>
            </div>
        `;
    }

    static styles = css`
        .toast{
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            z-index: 9999995;

            background: #354955;
            border-radius: 0.2rem;

            padding: 0.5rem 1rem;

            color: white;
            font-family: inherit;
            font-size: 1rem;
            font-weight: inherit;

            box-shadow:
                1.8px 1.8px 10px rgba(0, 0, 0, 0.03),
                14px 14px 80px rgba(0, 0, 0, 0.06)
            ;

            animation: in 300ms ease;
        }

        .toast.out{
            animation: out 300ms ease forwards;
        }

        @keyframes in{
            0%{
                opacity: 0;
                transform: translateY(10%);
            }
            100%{
                opacity: 1;
                transform: translateY(0%);
            }
        }

        @keyframes out{
            0%{
                opacity: 1;
                transform: translateY(0%);
            }
            100%{
                opacity: 0;
                transform: translateY(10%);
            }
        }
    `;
}

export const toast = function (content = "") {
    const toast = document.createElement("snack-bar");
    toast.append(content);
    document.getElementById("wpcontent").append(toast);

    return toast;
}

customElements.define('snack-bar', SnackBar);

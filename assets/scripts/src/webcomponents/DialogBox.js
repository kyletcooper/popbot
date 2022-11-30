import { LitElement, css, html } from 'lit';

export class DialogBox extends LitElement {
    static properties = {
        header: {},
        accept: { attribute: "accept" },
        reject: { attribute: "reject" },
    };

    constructor() {
        super();
    }

    hide() {
        setTimeout(() => {
            this.remove();
        }, 300);

        this.renderRoot.querySelector(".backdrop").classList.add("out")
    }

    _onAccept() {
        this.hide();

        const event = new CustomEvent('modal-accept');
        this.dispatchEvent(event);
    }

    _onReject() {
        this.hide();

        const event = new CustomEvent('modal-reject');
        this.dispatchEvent(event);
    }

    render() {
        return html`
            
            <div class="backdrop">
                <div class="modal">
                    <h2 class="title">
                        ${this.header}
                    </h2>

                    <slot></slot>

                    <div class="buttons">
                        <icon-button @click=${this._onAccept} class="accept">${this.accept}</icon-button>

                        <icon-button @click=${this._onReject} class="reject" secondary>${this.reject}</icon-button>
                    </div>
                </div>
            </div>
        `;
    }

    static styles = css`
        .backdrop{
            position: fixed;
            inset: 0;
            z-index: 999999;

            background: rgba(0,0,0,0.4);

            animation: fadeIn 300ms ease;
        }

        .modal{
            background: #fff;
            border-radius: 0.25rem;

            overflow: auto;

            width: 80vw;
            max-width: 45ch;

            padding: 1.5rem;

            margin: 10vh auto 0;

            animation: dropIn 300ms ease;
        }

        .backdrop.out{
            animation: fadeOut 300ms ease forwards;
        }
        .backdrop.out .modal{
            animation: dropOut 300ms ease forwards;
        }

        .title{
            font-size: 1.5rem;
            font-family: inherit;
            color: inherit;
            font-weight: 500;

            margin-top: 0;
            margin-bottom: 1rem;
        }

        .buttons{
            margin-top: 2rem;

            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }

        @keyframes fadeIn{
            0%{
                background: rgba(0,0,0,0);
            }
            100%{
                background: rgba(0,0,0,0.4);
            }
        }

        @keyframes dropIn{
            0%{
                opacity: 0;
                transform: translateY(-1rem);
            }
        }

        @keyframes fadeOut{
            0%{
                background: rgba(0,0,0,0.4);
            }
            100%{
                background: rgba(0,0,0,0);
            }
        }

        @keyframes dropOut{
            100%{
                opacity: 0;
                transform: translateY(-1rem);
            }
        }
    `;
}

export const modal = async function (header, content = "", accept = "Accept", reject = "Cancel") {
    const modal = document.createElement("dialog-box");
    modal.setAttribute("header", header)
    modal.setAttribute("accept", accept)
    modal.setAttribute("reject", reject)

    modal.append(content)

    document.getElementById("wpcontent").append(modal);

    return new Promise((resolve, reject) => {
        modal.addEventListener('modal-accept', function () {
            resolve();
        });

        modal.addEventListener('modal-reject', function () {
            reject("User rejected");
        });
    })
}

customElements.define('dialog-box', DialogBox);

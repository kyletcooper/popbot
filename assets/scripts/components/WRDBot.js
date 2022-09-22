import { LitElement, css, html } from 'lit';

export class WRDBot extends LitElement {
    static properties = {
        post_id: { type: Number },
        bot: { state: true },
    };

    connectedCallback() {
        super.connectedCallback();

        this._fetchPost();
    }

    async _fetchPost() {
        let response = await window.popbot.manager.fetch.send("popbotGetBotDetails", { post_id: this.post_id });

        if (response.success) {
            this.bot = response.data;
        }
    }



    // STYLE

    static styles = css`
        .container{
            width: 20rem;
            
            background: white;

            padding: 1rem;
            border-radius: 0.375rem;
            box-shadow: 0 10px 15px -3px rgb(254 206 246 / 0.3), 0 4px 6px -4px rgb(254 206 246 / 0.3);
        }

        .preview{
            height: 14rem;
        }

        .header{
            display: flex;
            align-items: center;
            gap: 1rem;

            margin-top: 1rem;
        }

        .dot{
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 2rem;

            background: #f43f5e;
        }
        .dot.enabled{
            background: #10b981;
        }

        .link{
            color: rgb(15 23 42);
            font-weight: 500;
            font-size: 1.125rem;
            line-height: 1.75rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
        }

        .icon{
            margin-left: auto;
        }
    `;



    // MARKUP

    render() {
        return html`
            <article class="container">

                <div class="preview">
                    <wrd-bot-preview post="${this.post_id}" scale="0.5"></wrd-bot-preview>
                </div>

                <header class="header">
                    <div class="dot ${this.bot?.enabled ? "enabled" : "disabled"}" title="${this.bot?.enabled ? "Enabled" : "Disabled"}"></div>


                    <a href="${this.bot?.edit_link}" class="link">
                        ${this.bot?.title}
                    </a>


                    <wrd-icon icon="more_vert" button class="icon"></wrd-icon>
                </header>
            </article>
            `;
    }
}

customElements.define('wrd-bot', WRDBot);

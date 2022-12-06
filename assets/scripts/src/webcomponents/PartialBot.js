import { LitElement, css, html } from 'lit';
import { api } from '../utils';
import '../triggers';
import './PreviewBot';
import './IconLabel';

export class PartialBot extends LitElement {
    static properties = {
        uuid: { type: String },
        bot: { type: Object, state: true },
    };

    connectedCallback() {
        super.connectedCallback();

        this._fetchPost();
    }

    async _fetchPost() {
        let response = await api(`/popbot/v1/popbots/${this.uuid}`)

        if (response) {
            this.bot = response;
        }
    }

    _getVisibilityIcon(visibility) {
        if (visibility == "public") {
            return "public";
        }
        else if (visibility == "private") {
            return "lock";
        }
        else {
            return "visibility_off";
        }
    }

    get trigger() {
        return popbot.triggers.find(trigger => trigger.id == this.bot?.trigger?.trigger);
    }

    render() {
        return html`
            <article class="container">
                <div class="preview_wrapper">
                    <preview-bot class="preview" uuid="${this.uuid}" scale="0.5"></preview-bot>
                    ${this.renderTrigger()}
                </div>

                <header class="header">
                    <a href="${this.bot?.edit_link}" class="link">
                        ${this.bot?.title}
                    </a>

                    <icon-label icon="${this._getVisibilityIcon(this.bot?.visibility.visibility)}" style="--fill: #94a3b8"></icon-label>
                </header>
            </article>
            `;
    }

    renderTrigger() {
        if (!this.trigger) return null;

        return html`
            <div class="trigger" style="--bg: ${this.trigger.color}">
                <icon-label icon="${this.trigger.icon}"></icon-label>
                ${this.trigger.label}
            </div>
        `;
    }

    static styles = css`
        *{
            box-sizing: border-box;
        }
        .container{
            
            
            background: white;

            padding: 1rem;
            padding-bottom: 0.5rem;
            border-radius: 0.375rem;
            box-shadow: 0 10px 15px -3px rgb(254 206 246 / 0.3), 0 4px 6px -4px rgb(254 206 246 / 0.3);
        }

        .preview_wrapper{
            position: relative;
        }
        .preview{
            min-height: 14rem;
        }

        .header{
            margin-top: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
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
            min-height: 28px;
        }
        .link:hover,
        .link:focus{
            color: #D204B0;
        }

        .trigger{
            --bg: #C60295;

            display: flex;
            gap: 0.25rem;
            align-items: center;
            padding: 0 0.5rem 0rem 0.25rem;

            background: var(--bg);
            
            color: #fff;
            font-size: 0.75rem;

            position: absolute;
            top: 1rem;
            left: 1rem;
            z-index: 1;

            border-radius: 100vw;
            box-shadow: 0.3rem 0.3rem 0.6rem rgba(0, 0, 0, 0.15);
        }
        .trigger icon-label{
            --size: 26px;
            --fill: currentColor;
        }

        .dropdown{
            display: flex;
            flex-direction: column;
            padding: 1rem;
            gap: 0.5rem;
        }
    `;
}

customElements.define('partial-bot', PartialBot);

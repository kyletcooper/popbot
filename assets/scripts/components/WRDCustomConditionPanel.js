import { LitElement, css, html } from 'lit';
import { WRDPanelInterface } from './WRDPanelInterface.js';

export class WRDCustomConditionPanel extends WRDPanelInterface {
    static properties = {
        post: { type: Number, reflect: true },
        value: { type: Object, reflect: true },
        error: { type: String, state: true }
    };

    static defaultValue = {
        "post_title": "New Custom Condition",
        "post_content": "return 1;",
    };

    connectedCallback() {
        super.connectedCallback();

        this.getValues();
    }

    _onChange(e) {
        this.value[e.target.name] = e.target.value;
        this.requestUpdate();
    }

    async delete() {
        if (this.post > 0) {
            popbot.manager.fetch.api(`/wp/v2/popbot_condition/${this.post}`, { force: true }, "DELETE");
        }

        this.dispatchEvent(new Event("wrd-custom-condition-panel-update"));
        this._saveState();
        this.closePanel();
        WRDToast("Condition deleted.");
        setTimeout(() => this.remove(), 501);
    }

    async getValues() {
        if (this.post < 1) return;

        let post = await popbot.manager.fetch.api(`/wp/v2/popbot_condition/${this.post}`, { context: 'edit' });

        this.value = {
            "post_title": post.title.rendered,
            "post_content": post.content.raw,
        };

        this._saveState();
    }

    async save() {
        if (this.value.post_title.length < 1 || this.value.post_content.length < 1) {
            this.error = "Please fill in all fields.";
            this.renderRoot.querySelector(".error").animate([
                { transform: "scale(1)" },
                { transform: "scale(1.05)" },
                { transform: "scale(1)" },
            ], { duration: 200, ease: 'ease-in-out' });
            return;
        }

        // Create & set Post to new ID
        let url = this.post < 1 ? `/wp/v2/popbot_condition/` : `/wp/v2/popbot_condition/${this.post}`;
        let post = await popbot.manager.fetch.api(url, {
            title: this.value.post_title,
            content: this.value.post_content,
            status: "publish",
        }, "POST");

        if (!post.id) {
            WRDToast("Could not save custom condition. Please refresh and retry.");
            return;
        }

        if (this.post < 1) {
            this.dispatchEvent(new Event("wrd-custom-condition-panel-create"));
        }
        else {
            this.dispatchEvent(new Event("wrd-custom-condition-panel-update"));
        }

        this._saveState();
        this.post = post.id;
        WRDToast("Saved custom condition!");
    }

    render() {
        return html`
            <wrd-panel id="panel" header="Edit Custom Condition">
                <div class="wrapper">
                    <p class="info">
                        The value of the condition is evaluated on every page by the result of your callback function.
                    </p>

                    <div class="group">
                        <wrd-input name="post_title" label="Condition Name" value="${this.value.post_title}" hide-errors @wrd-input-input="${this._onChange}"></wrd-input>
                    </div>
                    
                    <div class="group">
                        <wrd-input name="post_content" label="Callback Function" type="code" value="${this.value.post_content}" hide-errors @wrd-input-input="${this._onChange}"></wrd-input>
                        
                        <p class="info">
                            This JavaScript code should return the value of the condition. True/false should be converted to 1/0 respectively.
                        </p>
                    </div>

                    <wrd-button class="delete" @click="${this.delete}">Delete Condition</wrd-button>
                </div>

                <div slot="options" class="options">
                    ${this.error ? html`<div class="error">${this.error}</div>` : html`<div></div>`}

                    <wrd-button id="button" @click=${this.save}>Save Changes</wrd-button>
                </div>
            </wrd-panel>
        `;
    }

    static styles = css`
        .wrapper{
            display: grid;
            gap: 2.5rem;
            padding: 1.5rem;
        }

        wrd-input{
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .info{
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: #586C77;
            margin: 0;
        }

        .info a{
            text-decoration: none;
            color: #D204B0;
        }
        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }

        .delete{
            --bg: #EF3838;
            --outline: #FFD2D2;
        }

        .error{
            border-radius: 0.2rem;
            background: #FFD2D2;

            color: #4E0C0C;
            font-size: 0.9rem;
            font-weight: 500;
            font-family: inherit;

            width: fit-content;
            padding: 0.5rem 1rem;
        }
    `;
}

customElements.define('wrd-custom-condition-panel', WRDCustomConditionPanel);

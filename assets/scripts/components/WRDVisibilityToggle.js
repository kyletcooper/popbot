import { LitElement, css, html } from 'lit';

export class WRDVisibilityToggle extends LitElement {
    static properties = {
        post: { type: Number },
        value: { type: String },
    };

    get _icon() {
        if (this.value == "publish") {
            return "visibility";
        }
        else {
            return "visibility_off";
        }
    }

    toggle() {
        if (this.value == "publish") {
            this.value = "draft";
        }
        else {
            this.value = "publish";
        }

        this.save();
    }

    async save() {
        var form_data = new FormData(); // We use formdata so $_POST is filled in PHP

        form_data.append("action", "inlineSave");
        form_data.append("post_id", this.post);
        form_data.append("nonce", window.popbot.fetch.nonce);
        form_data.append("key", "post_status");
        form_data.append("value", this.value);

        const responseRaw = await fetch(window.popbot.fetch.ajax_url, {
            method: 'POST',
            body: form_data
        });

        try {
            const response = await responseRaw.json();

            if (!responseRaw.ok || !response.success) {
                throw "Error";
            }

            if (this.value == "publish") {
                WRDToast("PopBot now enabled.");
            }
            else {
                WRDToast("PopBot now disabled.");
            }

            const eventSaved = new CustomEvent('wrd-visibility-toggle-change', {
                bubbles: true,
                cancelable: true
            });

            this.dispatchEvent(eventSaved);
        }
        catch (e) {
            WRDToast("An error occured.");
        }
    }



    // STYLE

    static styles = css`
        
    `;



    // MARKUP

    render() {
        return html`
            <wrd-icon icon="${this._icon}" aria-label="Toggle Visibility" title="Toggle Visibility" button @click="${this.toggle}"></wrd-icon>
        `;
    }
}

customElements.define('wrd-visibility-toggle', WRDVisibilityToggle);

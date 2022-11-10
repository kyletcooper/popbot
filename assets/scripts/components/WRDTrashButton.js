import { LitElement, css, html } from 'lit';

export class WRDTrashButton extends LitElement {
    static properties = {
        post: { type: Number },
    };

    async trash() {
        const modal = WRDModal("Are you sure you want to delete this PopBot?", "This action cannot be undone.", "Cancel", "Delete");
        modal.then(
            () => { /* Cancel */ },
            async () => {

                const response = await window.popbot.manager.fetch.send("popbotDeletePost", {
                    post_id: this.post,
                    nonce: window.popbot.fetch.nonce
                });

                if (response.success) {
                    window.location.href = window.popbot.wp.plugin_home_url;
                }

            }
        )
    }



    // STYLE

    static styles = css`
        
    `;



    // MARKUP

    render() {
        return html`
            <wrd-icon icon="delete" aria-label="Delete" button @click="${this.trash}"></wrd-icon>
        `;
    }
}

customElements.define('wrd-trash-button', WRDTrashButton);

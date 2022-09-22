import { LitElement, css, html } from 'lit';

export class WRDPanelInterface extends LitElement {
    static properties = {
        value: {
            type: Object,
            reflect: true,
        },
    };

    static key = undefined;
    static defaultValue = {};

    constructor() {
        super();

        this.value = this.constructor.defaultValue;
    }

    connectedCallback() {
        super.connectedCallback();

        if (!this.value) {
            this.value = this.constructor.defaultValue;
        }
    }

    createRenderRoot() {
        const root = super.createRenderRoot();

        root.addEventListener("wrd-panel-open", e => {
            return this._onOpen(e);
        })

        root.addEventListener("wrd-panel-close", e => {
            return this._onClose(e);
        })

        return root;
    }

    openPanel() { this.renderRoot.querySelector("#panel").openPanel(); }

    closePanel() { this.renderRoot.querySelector("#panel").closePanel(); }

    togglePanel() { this.renderRoot.querySelector("#panel").togglePanel(); }


    _hasChanges() {
        // Shallow object value comparison from https://levelup.gitconnected.com/how-to-get-a-perfect-deep-equal-in-javascript-b849fe30e54f
        var shallowEqual = (objA, objB) => {
            if (Object.is(objA, objB)) {
                return true;
            }

            if (typeof objA !== typeof objB) {
                return false;
            }

            var keysA = Object.keys(objA);
            var keysB = Object.keys(objB);

            if (keysA.length !== keysB.length) {
                return false;
            }

            for (var i = 0; i < keysA.length; i++) {
                if (
                    !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
                    !Object.is(objA[keysA[i]], objB[keysA[i]])
                ) {
                    return false;
                }
            }

            return true;
        }

        // If they are equal, there are no changes.
        return !shallowEqual(this._savedState, this.value);
    }

    _onOpen(e) {
        this._saveState();
    }

    _onClose(e) {
        if (this._hasChanges()) {
            e.preventDefault();

            const modal = WRDModal("You have unsaved changes!", "Leaving now will revert all the changes you've made. Are you sure you don't want to save?", "Go Back", "Discard Changes");
            modal.then(
                () => { /* Don't close! */ },
                () => { this.discard(); this.closePanel(); }
            )
        }
    }

    _saveState() {
        if (Array.isArray(this.value)) {
            this._savedState = Object.assign([], this.value);
        }
        else if (typeof this.value == 'string') {
            this._savedState = (' ' + this.value).slice(1);
        }
        else {
            this._savedState = Object.assign({}, this.value); // Deep copy the object
        }
    }

    _restoreState() {
        if (!this._savedState) return;

        this.value = this._savedState;
        this.requestUpdate();
    }

    discard() {
        this._restoreState();
    }

    async save() {
        let btn = this.renderRoot.querySelector("#button");

        if (btn) btn.loading = true;

        // Send to back end
        var form_data = new FormData(); // We use formdata so $_POST is filled in PHP

        form_data.append("action", "panelSave");
        form_data.append("post_id", window.popbot.wp.post_id);
        form_data.append("nonce", window.popbot.fetch.nonce);
        form_data.append("key", this.constructor.key);

        if (typeof this.value == "object") {
            form_data.append("value", JSON.stringify(this.value));
        }
        else {
            form_data.append("value", this.value);
        }

        const responseRaw = await fetch(window.popbot.fetch.ajax_url, {
            method: 'POST',
            body: form_data
        });

        try {
            const response = await responseRaw.json();

            if (responseRaw.ok && response.success) {
                // Request okay and the back-end worked.
                this._saveState();

                const eventSaved = new CustomEvent('wrd-panel-interface-saved', {
                    bubbles: true,
                    cancelable: true
                });

                this.dispatchEvent(eventSaved);
            }

            if (!responseRaw.ok) {
                // Request could not be made
                console.error("Fetch connection failed.");
                WRDToast("A connection could not be established to the server.");
            }

            if (response.data.message) {
                // Server send a message.
                WRDToast(response.data.message);
            }
        }
        catch (e) {
            // Request malformed
            console.error("Fetch connection returned malformed response.");
            WRDToast("A connection could not be established to the server.");
        }

        if (btn) btn.loading = false;
    }
}
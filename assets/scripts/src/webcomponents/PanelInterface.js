import { LitElement } from 'lit';
import { toast } from './SnackBar';
import { modal } from './DialogBox';
import { api } from '../utils';

export class PanelInterface extends LitElement {
    static properties = {
        uuid: { type: String },
        value: { type: Object, state: true },
    };

    static route = '/popbot/v1/popbots/';
    static key = undefined;
    static defaultValue = {};

    constructor() {
        super();
        this.value = this.constructor.defaultValue;
    }

    connectedCallback() {
        super.connectedCallback();
        this._getValueFromServer();
    }

    createRenderRoot() {
        const root = super.createRenderRoot();

        root.addEventListener("panel-open", this._onOpen.bind(this));
        root.addEventListener("panel-close", this._onClose.bind(this));

        return root;
    }

    getChip() { return false; }

    get opened() { return this.renderRoot.querySelector("#panel").opened; }

    open() { return this.renderRoot.querySelector("#panel").open(); }

    close() { return this.renderRoot.querySelector("#panel").close(); }

    toggle() { return this.renderRoot.querySelector("#panel").toggle(); }

    async _getValueFromServer() {
        if (this.uuid < 0 || !this.uuid) return;

        const opts = this.constructor.key ? { _fields: this.constructor.key } : {};
        const post = await api(`${this.constructor.route}${this.uuid}`, opts);

        this.value = this.constructor.key ? post[this.constructor.key] : post;

        this.dispatchEvent(new CustomEvent('panel-interface-loaded', {
            bubbles: true,
            cancelable: false,
        }));
    }

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

    _onOpen() {
        this._saveState();
    }

    _onClose(e) {
        if (this._hasChanges()) {
            e.preventDefault();

            const resp = modal("You have unsaved changes!", "Leaving now will revert all the changes you've made. Are you sure you don't want to save?", "Go Back", "Discard Changes");
            resp.then(
                () => { /* Don't close! */ },
                () => { this.discard(); this.close(); }
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
        this.dispatchEvent(new CustomEvent('panel-interface-discarded', {
            bubbles: true,
            cancelable: false,
        }));
    }

    async save() {
        let btn = this.renderRoot.querySelector("#button");
        if (btn) btn.loading = true;

        if (this.uuid < 0) {
            // We have a negative UUID, signalling this is a new post
            var resp = await this.create();
        }
        else if (this.uuid) {
            // We have a UUID
            const opts = this.constructor.key ? { [this.constructor.key]: this.value } : this.value;
            var resp = await api(this.constructor.route + this.uuid, opts, 'POST')
        }

        if (resp?.uuid || resp?.id) {
            this._saveState();

            toast("Changed saved.");

            this.dispatchEvent(new CustomEvent('panel-interface-saved', {
                bubbles: true,
                cancelable: false,
            }));
        }
        else {
            toast("An error occurred.");
        }

        if (btn) btn.loading = false;
    }

    async create() {
        const opts = this.constructor.key ? { [this.constructor.key]: this.value } : this.value;
        const resp = await api(this.constructor.route, opts, 'POST');

        if (resp.uuid || resp.id) {
            this.uuid = resp.uuid || resp.id;
        }

        return resp;
    }
}
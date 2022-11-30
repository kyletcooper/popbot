import { LitElement, css, html } from 'lit';

export class OffCanvas extends LitElement {
    static properties = {
        header: {},
        button: {},
        _isOpen: { type: Boolean, reflect: true, attribute: 'open' },
    };

    constructor() {
        super();

        this.header = "Panel";
        this.button = "Save Changes";
        this._isOpen = false;

        this.isPanel = true;

        window.addEventListener("keydown", e => {
            if (e.key == "Escape" && this._isOpen && this._getOpenChildPanels().length < 1) {
                // Check if there are any child panels open that the user is trying to exit first.
                this.close();
            }
        });
    }

    get opened() {
        return this._isOpen;
    }

    close() {
        const event = new CustomEvent('panel-close', {
            bubbles: true,
            cancelable: true
        });
        this.dispatchEvent(event);

        if (!event.defaultPrevented) { // Check for cancelling
            this._isOpen = false;
            document.body.style.overflowY = 'auto';
        }
    }

    open() {
        const event = new CustomEvent('panel-open', {
            bubbles: true,
            cancelable: true
        });
        this.dispatchEvent(event);

        if (!event.defaultPrevented) { // Check for cancelling
            this._isOpen = true;
            document.body.style.overflowY = 'hidden';
        }
    }

    toggle() {
        if (this._isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }

    _getChildren() {
        let slot = this.shadowRoot.querySelector("slot");
        if (!slot) return [];

        let children = slot.assignedElements();

        return children;
    }

    _getChildPanels() {
        let children = this._getChildren();

        let panels = children.filter(child => {
            return child.isPanel;
        });

        return panels;
    }

    _getOpenChildPanels() {
        let children = this._getChildPanels();

        let panels = children.filter(child => {
            return child.open;
        });

        return panels;
    }


    render() {
        return html`
            <div class="container" ?inert=${!this._isOpen}>

                <div class="backdrop" @click="${this.close}" >
                </div>

                <aside class="panel">
                    <header class="header">
                        <icon-label class="close" icon="close" button @click="${this.close}"></icon-label>

                        <h2 class="title">
                            ${this.header}
                        </h2>
                    </header>

                    <main class="main">
                        <slot id="childrenSlot"></slot>
                    </main>

                    <footer class="footer">
                        <slot id="optionsSlot" name="options"></slot>
                    </footer >
                </aside >
            </div >
        `;
    }

    static styles = css`
        :host{
            --width: min(35rem, 95vw);
        }

        .container{
            position: fixed;
            inset: 0;
            height: 100%;
            z-index: 999999;
        }

        .container[inert]{
            pointer-events: none;
        }

        .backdrop{
            border: none;
            background: none;

            display: block;
            margin: 0;
            padding: 0;

            opacity: 1;

            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            background: rgba(0, 0, 0, 0.333);
            transition: opacity 0.5s ease;
        }

        .container[inert] .backdrop{
            opacity: 0;
        }

        .panel{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;

            width: var(--width);
            height: 100%;

            background: #fff;

            display: grid;
            grid-template-rows: auto 1fr auto;

            box-shadow:
                -1.4px 0px 3.6px rgba(0, 0, 0, 0.024),
                -3.8px 0px 10px rgba(0, 0, 0, 0.035),
                -9px 0px 24.1px rgba(0, 0, 0, 0.046),
                -30px 0px 80px rgba(0, 0, 0, 0.07)
            ;

            transition: transform 0.5s ease, right 0.5s ease, box-shadow 0.5s ease;
        }

        .container[inert] .panel{
            transform: translateX(var(--width));
            box-shadow: none;
        }

        .header{
            padding: 0.75rem 1.5rem;

            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .title{
            font-size: 1.3rem;
            font-weight: 500;
            color: #0f172a;
            margin: 0;
        }

        .main{
            border: 1px solid #E4EBEF;
            border-left: none;
            border-right: none;

            overflow-y: auto;
        }

        .footer{
            padding: 1.5rem;
        }

        .submit{
            grid-column: 2;
        }
    `;
}

customElements.define('off-canvas', OffCanvas);
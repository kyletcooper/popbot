import { LitElement, css, html } from 'lit';

export class WRDPanel extends LitElement {
    static properties = {
        header: {},
        button: {},
        open: { type: Boolean, reflect: true },
    };

    constructor() {
        super();

        this.header = "Panel";
        this.button = "Save Changes";
        this.open = false;

        this.isPanel = true;

        window.addEventListener("keydown", e => {
            if (e.key == "Escape" && this.open && this.getOpenChildPanels().length < 1) {
                // Check if there are any child panels open that the user is trying to exit first.
                this.closePanel();
            }
        });

        // Used to keep track of open children
        // this.addEventListener('wrd-panel-open', () => this.requestUpdate());
        // this.addEventListener('wrd-panel-close', () => this.requestUpdate());
        // For some reason some events are getting trapped by the shadow DOM. Workaround:
        // this.addEventListener('click', () => this.requestUpdate());
        // this.addEventListener('keydown', () => this.requestUpdate());
    }

    isOpen() {
        return this.open;
    }

    closePanel() {
        const event = new CustomEvent('wrd-panel-close', {
            bubbles: true,
            cancelable: true
        });
        this.dispatchEvent(event);

        if (!event.defaultPrevented) { // Check for cancelling
            this.open = false;
            document.body.style.overflowY = 'auto';
        }
    }

    openPanel() {
        const event = new CustomEvent('wrd-panel-open', {
            bubbles: true,
            cancelable: true
        });
        this.dispatchEvent(event);

        if (!event.defaultPrevented) { // Check for cancelling
            this.open = true;
            document.body.style.overflowY = 'hidden';
        }
    }

    togglePanel() {
        if (this.open) {
            this.closePanel();
        }
        else {
            this.openPanel();
        }
    }

    getChildren() {
        let slot = this.shadowRoot.querySelector("slot");
        if (!slot) return [];

        let children = slot.assignedElements();

        return children;
    }

    getChildPanels() {
        let children = this.getChildren();

        let panels = children.filter(child => {
            return child.isPanel;
        });

        return panels;
    }

    getOpenChildPanels() {
        let children = this.getChildPanels();

        let panels = children.filter(child => {
            return child.isOpen();
        });

        return panels;
    }

    getCountOpenDescendentPanels() {
        let children = this.getOpenChildPanels();
        let count = children.length;

        children.forEach(child => {
            count += child.getCountOpenDescendentPanels();
        });

        return count;
    }


    render() {
        return html`
            <div class="container" style="--open-children: ${this.getCountOpenDescendentPanels()}" ?inert=${!this.open}>

                <div class="backdrop" @click="${this.closePanel}" >
                </div>

                <aside class="panel">
                    <header class="header">
                        <wrd-icon class="close" icon="close" button @click="${this.closePanel}"></wrd-icon>

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

customElements.define('wrd-panel', WRDPanel);

document.addEventListener("click", e => {
    if (e.target.matches("[data-panel]")) {
        let btn = e.target;
        let panelSelector = btn.dataset.panel;
        let panel = document.querySelector(panelSelector);

        if (panel && typeof panel.togglePanel !== undefined) {
            panel.togglePanel();
        }
    }
})
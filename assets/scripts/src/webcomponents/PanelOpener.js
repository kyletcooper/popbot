import { LitElement, css, html } from 'lit';

export class PanelOpener extends LitElement {
    static properties = {
        icon: {},
        label: {},
        href: {},
    };

    constructor() {
        super();
        this.addEventListener("panel-interface-saved", () => this.requestUpdate());
        this.addEventListener("panel-interface-loaded", () => this.requestUpdate());
    }

    connectedCallback() {
        super.connectedCallback();
        this.requestUpdate();
    }

    _onSlotChange() {
        this.requestUpdate();
    }

    get chip() {
        if (this.panel?.getChip) {
            return this.panel.getChip();
        }
    }

    get children() {
        const slot = this.renderRoot.querySelector("#slot");
        if (!slot) return [];

        return slot.assignedElements({ flatten: true });
    }

    get panel() {
        for (const child of this.children) {
            if (typeof child.open == "function") {
                // Easier than checking if it is a panel or extends PanelInterface
                return child;
            }
        };

        return null;
    }

    open() {
        if (this.href) {
            window.open(this.href, "_blank");
        }
        else {
            this.panel?.open();
        }
    }

    render() {
        return html`
            <button class="button" type="button" role="button" @click="${this.open}">
                <icon-label class="icon" icon="${this.icon}" label="${this.label}"></icon-label>

                ${this.chip ? html`<icon-label class="chip" icon="${this.chip.icon}" label="${this.chip.label}" style="background-color: ${this.chip.color}"></icon-label>` : null}
                
                <icon-label class="arrow" icon="${this.href ? 'open_in_new' : 'arrow_forward'}"></icon-label>
            </button>

            <slot id="slot" @slotchange="${this._onSlotChange}"></slot>
        `;
    }

    static styles = css`
        :host{
            display: block;
            border-top: 1px solid #F1F5F9;
        }
        :host(:first-child){
            border-top: 0;
        }

        .button{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-wrap: wrap;
            gap: 1rem;
            width: 100%;

            border: none;
            background: none;
            font-size: 1.2rem;
            font-weight: 500;
            font-family: inherit;
            margin: 0;
            padding: 1rem 1.5rem;

            cursor: pointer;
        }

        .icon{
            flex: 1;
        }
        .icon, .arrow{
            --fill: #94A3B8;
        }
        .button:hover .icon{
            --bg: #F1F5F9;
        }

        .chip{
            --size: 32px;
            --fill: #fff;
            --text: #fff;

            display: none;
            
            border-radius: 5rem;
            padding-left: 0.25rem;
            padding-right: 0.75rem;
            font-size: 0.8rem;
            text-transform: capitalize;
        }

        @media (min-width: 600px){
            .chip{
                display: block;
            }
        }
    `;
}

customElements.define('panel-opener', PanelOpener);

import { LitElement, css, html } from 'lit';

export class WRDPanelIndicator extends LitElement {
    static properties = {
        count: { state: true },
        for: {},
        type: {},
        label: {},
    };

    constructor() {
        super();

        this._hide = false;
    }

    connectedCallback() {
        super.connectedCallback();

        this._updateLabels();

        let panel = document.getElementById(this.for);
        panel.addEventListener('wrd-panel-interface-saved', e => {
            this._updateLabels();
        });
    }

    _updateLabels() {
        let panel = document.getElementById(this.for);
        let value = panel.value;

        this.icon = value.length;
        this.color = "#FECEF6";

        if (this.type == "text") {
            this.color = "#D204B0";
            this.icon = "dashboard";
            this.label = value;
        }

        if (this.type == "trigger") {
            let triggerID = value.trigger;
            let trigger = window.popbot.triggers.find(trig => trig.id == triggerID);

            if (!trigger) {
                this.icon = "block";
                this.color = "#ec4899";
                this.label = "No trigger selected";
            }
            else {
                this.icon = trigger.icon;
                this.color = trigger.color;
                this.label = trigger.label;
            }
        }

        this.requestUpdate();
    }



    // STYLE

    static styles = css`
        :host{
            display: inline-block;
        }

        .container{
            display: flex;
            align-items: center;
            justify-content: start;
            gap: 1rem;
            padding-right: 1rem;

            color: #0f172a;
            font-weight: 500;
            font-size: 0.9rem;

            border-radius: 20rem;
            background: #f1f5f9;
        }

        .icon{
            --size: 42px;

            display: flex;
            align-items: center;
            justify-content: center;

            width: var(--size);
            height: var(--size);

            border-radius: inherit;
        }

        .icon.number{
            color: #8E0076;
            font-size: 1.2rem;
        }

        .icon.icon-font{
            color: white;

            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;

            /* Support for all WebKit browsers. */
            -webkit-font-smoothing: antialiased;
            /* Support for Safari and Chrome. */
            text-rendering: optimizeLegibility;

            /* Support for Firefox. */
            -moz-osx-font-smoothing: grayscale;

            /* Support for IE. */
            font-feature-settings: 'liga';
        }
    `;



    // MARKUP

    render() {
        return html`
        <div class="container">
            <div class="icon ${Number.isInteger(this.icon) ? "number" : "icon-font"}" style="background: ${this.color}">
                ${this.icon}
            </div>
            ${this.label}
        </div>
            `;
    }
}

customElements.define('wrd-panel-indicator', WRDPanelIndicator);

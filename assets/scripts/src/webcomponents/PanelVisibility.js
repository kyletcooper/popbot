import { LitElement, css, html } from 'lit';
import { PanelInterface } from './PanelInterface';
import './IconButton';
import './OffCanvas';
import './DatePicker';


export class PanelVisibility extends PanelInterface {
    static properties = {
        value: { type: Object, reflect: true },
        uuid: { type: String }
    };

    static key = "visibility";
    static defaultValue = {
        visibility: "public",
        start: null,
        end: null,
    };

    getChip() {
        if (this.value.visibility == "public") return false;

        return {
            label: this.value.visibility,
            icon: "visibility",
            color: "#C60295",
        }
    }

    _onChange(e) {
        this.value[e.target.name] = e.target.value;
    }

    _setVisibility(visibility) {
        this.value.visibility = visibility;
        this.requestUpdate();
    }


    render() {
        return html`
            <off-canvas id="panel" header="Schedule Visibility">
                <div class="wrapper">

                    <h3>Visibility</h3>

                    <div class="col">
                        <button class="visibility ${this.value.visibility == "public" ? "selected" : null}" type="button" @click="${() => this._setVisibility("public")}">
                            <wrd-icon icon="public"></wrd-icon>
                            <div>    
                                <h4>Public</h4>
                                <p>All visitors to your website can see your PopBot.</p>
                            </div>
                        </button>

                        <button class="visibility ${this.value.visibility == "private" ? "selected" : null}" type="button" @click="${() => this._setVisibility("private")}">
                            <wrd-icon icon="lock"></wrd-icon>
                            <div>
                                <h4>Private</h4>
                                <p>Only users logged into WordPress will see your PopBot.</p>
                            </div>
                        </button>

                        <button class="visibility ${this.value.visibility == "hidden" ? "selected" : null}" type="button" @click="${() => this._setVisibility("hidden")}">
                            <wrd-icon icon="visibility_off"></wrd-icon>
                            <div>    
                                <h4>Hidden</h4>
                                <p>This PopBot will not be shown to any users on your site.</p>
                            </div>
                        </button>
                    </div>

                
                    <h3>Schedule</h3>

                    <div class="row">
                        <date-picker label="From" name="start" value="${this.value.start}" change="${this._onChange}"></date-picker>
                        <date-picker label="To" name="end" value="${this.value.end}" change="${this._onChange}"></date-picker>
                    </div>

                </div>

                <div slot="options" class="options">
                    <icon-button id="button" @click=${this.save}>Save Changes</icon-button>
                </div>
            </off-canvas>
        `;
    }

    static styles = css`
        .wrapper{
            padding: 1.5rem;
        }

        h3{
            margin: 0;
            margin-bottom: 1rem;
            font-weight: 500;
            font-size: 1.35rem;
            color: #0f172a;
        }

        .row{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .col{
            display: grid;
            gap: 1.5rem;

            margin-bottom: 5rem;
        }

        .visibility{
            --bg: #f1f5f9;
            --text: #0f172a;
            --icon: #64748b;

            background: var(--bg);
            color: var(--text);

            text-align: left;
            font-family: inherit;
            border: 0.2rem solid var(--bg);
            border-radius: 0.5rem;

            cursor: pointer;
            transition: all 0.2s ease;

            display: flex;
            width: 100%;
            align-items: center;
            gap: 0.5rem;
            
            padding: 1rem;
        }
        .visibility wrd-icon{
            --size: 72px;
            --fill: var(--icon);
        }
        .visibility h4{
            margin: 0;
            margin-bottom: 0.25rem;

            font-weight: 500;
            font-size: 1.2rem;
            color: inherit;
        }
        .visibility p{
            color: inherit;
            font-size: 1rem;
            line-height: 1.5;
            font-weight: 400;
            margin: 0;
        }

        .visibility.selected{
            --bg: #FFEFFC;
            --text: #8E0076;
            --icon: #D204B0;

            border-left-color: #D204B0;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        .options{
            display: flex;
            justify-content: end;
        }
    `;
}

customElements.define('panel-visibility', PanelVisibility);

import { LitElement, css, html } from 'lit';
import { api } from '../utils';

export class StatScorecard extends LitElement {
    static properties = {
        event_type: { type: String },
        date_start: { type: Date },
        date_end: { type: Date },

        current: { type: Number, state: true },
        previous: { type: Number, state: true },
    };

    constructor() {
        super();

        this.event_type = "shown";

        this.current = -1;
        this.previous = -1;

        this.date_end = new Date();
        this.date_start = new Date(this.date_end.getFullYear(), this.date_end.getMonth(), 1);
    }

    connectedCallback() {
        super.connectedCallback();
        this.getData();
    }

    async getData() {
        // Get current period data
        api('/popbot/v1/analytics', {
            context: 'count',
            date_start: this.date_start.toISOString(),
            date_end: this.date_end.toISOString(),
            event_type: this.event_type
        }).then(resp => this.current = resp);

        // Get comparison period data
        const periodDuration = this.date_start.getTime() - this.date_end.getTime();
        const prevPeriodStart = new Date(this.date_start.getTime() - periodDuration);
        const prevPeriodEnd = this.date_start;

        api('/popbot/v1/analytics', {
            context: 'count',
            date_start: prevPeriodStart.toISOString(),
            date_end: prevPeriodEnd.toISOString(),
            event_type: this.event_type
        }).then(resp => { console.log(resp); this.previous = resp });
    }

    format(num) {
        num = Math.round(num * 10) / 10;
        return num.toLocaleString();
    }

    get _title() {
        switch (this.event_type) {
            case "shown":
                return "Total Views";
                break;

            case "converted":
                return "Conversions";
                break;

            case "dismissed":
                return "Dismissals";
                break;
        }
    }

    get _change() {
        let A = this.current;
        let B = this.previous;

        if (A == 0) {
            return '-';
        }

        let num = 100 * Math.abs((A - B) / ((A + B) / 2));
        num = Math.round(num * 10) / 10;
        return num + "%";
    }

    get _changedClass() {
        if (this.previous == 0 && false) {
            return "flat";
        }
        else if (this.current > this.previous) {
            return "increased";
        }
        else {
            return "decreased";
        }
    }

    render() {
        return html`
            <div class="container">
                <h3 class="title">
                    ${this._title}
                </h3>

                <div class="subtitle">${this.date}</div>

                <div class="stat">
                    <span class="value ${this.current < 0 ? 'value--hidden' : null}">${this.format(this.current)}</span>

                    <div class="change ${this._changedClass}">${this._change}</div>
                </div>
            </div>
        `;
    }

    static styles = css`
        .title{
            color: #0f172a;
            font-weight: 500;
            font-size: 1.25rem;

            margin: 0;
            padding: 0;
        }

        .subtitle{
            color: #475569;
            font-weight: 300;
            font-size: 1rem;

            margin-bottom: 0.5rem;
        }

        .value{
            color: #C60295;
            font-size: 3rem;
            font-weight: 500;
        }
        .value--hidden{
            opacity: 0;
        }

        .change{
            --color: #059669;

            color: var(--color);
            font-size: 0.9rem;
            font-weight: 500;

            display: flex;
            align-items: center;
            gap: 0.5rem;

            margin-top: -0.5rem;
        }
        .change::before{
            --width: 0.4rem;

            content: '';
            display: block;

            width: 0; 
            height: 0; 
            border-left: var(--width) solid transparent;
            border-right: var(--width) solid transparent;
            
            border-bottom: var(--width) solid var(--color);
        }

        .change.flat{
            color: #94a3b8;
        }
        .change.flat::before{
            content: none;
        }

        .change.decreased{
            --color: #e11d48;
        }
        .change.decreased::before{
            border-bottom: none;
            border-top: var(--width) solid var(--color);
        }

    `;
}

customElements.define('stat-scorecard', StatScorecard);

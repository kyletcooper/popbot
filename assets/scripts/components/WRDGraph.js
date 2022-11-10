import { LitElement, css, html } from 'lit';
import { map } from 'lit/directives/map.js';

export class WRDGraph extends LitElement {
    static properties = {
        _points: { state: true, type: Array },

        event_type: {},
        date_start: {},
        date_end: {},
        post_id: {},
    };

    constructor() {
        super();

        var date = new Date(), y = date.getFullYear(), m = date.getMonth() + 1, t = new Date(y, m, 0).getDate();

        this.event_type = "shown";
        this.date_start = `${y}-${m}-01`;
        this.date_end = `${y}-${m}-${t}`;
        this.post_id = 0; // Equals false

        this._points = [];
    }

    connectedCallback() {
        super.connectedCallback();

        this._getPoints();
    }

    get max() {
        return Math.max(...this._points.map(point => point.count));
    }

    get min() {
        return Math.min(...this._points.map(point => point.count));
    }

    get typeLabel() {
        const labels = {
            shown: "Total Views",
            dismissed: "Dismissed",
            converted: "Conversions",
        };

        return labels[this.event_type] ?? "-";
    }

    get dateLabel() {
        // If both dates are in the same month and year: Month, Year
        // If both dates are in the same year: Month - Month, Year
        // Otherwise: Month, Year - Month, Year
        const start = new Date(this.date_start);
        const end = new Date(this.date_end);

        if (start.getFullYear() == end.getFullYear()) {
            if (start.getMonth() == end.getMonth()) {
                return `${start.toLocaleString('default', { month: 'long' })}, ${start.getFullYear()}`;
            }

            return `${start.toLocaleString('default', { month: 'short' })} - ${end.toLocaleString('default', { month: 'short' })}, ${start.getFullYear()}`;
        }

        return `${start.toLocaleString('default', { month: 'short' })}, ${start.getFullYear()} - ${end.toLocaleString('default', { month: 'short' })}, ${end.getFullYear()}`;
    }

    async _getPoints() {
        // Fetch and set points array.
        const response = await window.popbot.manager.fetch.send("popbotGetAnalytics", {
            "type": "plot",
            "date_start": this.date_start,
            "date_end": this.date_end,
            "event_type": this.event_type,
            "post_id": this.post_id,
        });

        this._points = response.data;

        this._proccessPoints();
    }

    _proccessPoints() {
        if (!this._points.length) return;

        let final = [];
        let firstDay = new Date(this.date_start);
        let lastDay = new Date(this.date_end);

        var currDay = firstDay;

        while (currDay <= lastDay) {
            let foundPoint = this._points.find(point => {
                const d = new Date(point.day);

                return (
                    d.getFullYear() == currDay.getFullYear()
                    && d.getMonth() == currDay.getMonth()
                    && d.getDate() == currDay.getDate()
                )
            });

            final.push({
                count: foundPoint?.count ?? 0,
                day: new Date(currDay), // Otherwise currDay will get changed at the end of the loop
            });

            currDay = new Date(currDay.setDate(currDay.getDate() + 1));
        }

        this._points = final;
    }



    // STYLE

    static styles = css`
        .container{
            position: relative;
        }

        .labels{
            text-align: right;
            position: absolute;
            right: 0;
            top: 0;
        }

        .title{
            color: #0f172a;
            font-weight: 500;
            font-size: 1.1rem;

            margin: 0;
            padding: 0;
            margin-bottom: -0.25rem;
        }

        .subtitle{
            color: #475569;
            font-weight: 300;
            font-size: 0.85rem;
        }

        .graph{
            display: grid;
            grid-auto-flow: column;

            height: 30vh;
            padding-bottom: 2rem;
        }

        .point{
            height: 100%;
            max-width: 3ch;

            position: relative;
        }

        .bar{
            background: #C60295;
            border: 1px solid white;
            border-radius: 0.4rem;

            min-height: 0.25rem;

            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .bar.empty{
            background: #cbd5e1;
        }

        .date{
            display: none;

            position: absolute;
            top: calc(100% + 0.5rem);
            left: 0;
            right: 0;
            width: 100%;

            text-align: center;
            font-size: 0.75rem;
            color: #94a3b8;
        }

        @media (min-width: 992px){
            .date{
                display: block;
            }
        }
    `;



    // MARKUP

    render() {
        return html`
            <div class="container">
                <div class="labels">
                    <h3 class="title">${this.typeLabel}</h3>
                    <span class="subtitle">${this.dateLabel}</span>
                </div>

                <div class="graph">
                    ${map(this._points, point => html`
                        <div class="point">
                            <wrd-tooltip label="${point.count}">
                                <div class="bar ${point.count == 0 ? "empty" : "not-empty"}" style="height: ${((point.count - this.min) / (this.max - this.min)) * 100}%"></div>
                            </wrd-tooltip>

                            <div class="date">
                                ${this._points.length < 32 ? point.day.getDate() : null}
                            </div>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }
}

customElements.define('wrd-graph', WRDGraph);

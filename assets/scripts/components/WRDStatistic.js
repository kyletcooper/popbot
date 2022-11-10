import { LitElement, css, html } from 'lit';

export class WRDStatistic extends LitElement {
    static properties = {
        value: { type: Number },
        previous: { type: Number },
        date: { type: String },
    };

    constructor() {
        super();

        let today = new Date();

        this.date = today.toLocaleString('default', { month: 'long', year: 'numeric' });
        this.value = 0;
        this.previous = 0;
    }

    format(num) {
        num = Math.round(num * 10) / 10;
        return num.toLocaleString();
    }

    get _change() {
        let A = this.previous;
        let B = this.value;

        if (A == 0) {
            return '-';
        }

        let num = 100 * Math.abs((A - B) / ((A + B) / 2));
        num = Math.round(num * 10) / 10;
        return num + "%";
    }

    get _changedClass() {
        if (this.previous == 0) {
            return "flat";
        }
        else if (this.value > this.previous) {
            return "increased";
        }
        else {
            return "decreased";
        }
    }



    // STYLE

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



    // MARKUP

    render() {
        return html`
            <div class="container">
                <h3 class="title">
                    <slot></slot>
                </h3>

                <div class="subtitle">${this.date}</div>

                <div class="stat">
                    <span class="value">${this.format(this.value)}</span>

                    <div class="change ${this._changedClass}">${this._change}</div>
                </div>
            </div>
        `;
    }
}

customElements.define('wrd-statistic', WRDStatistic);

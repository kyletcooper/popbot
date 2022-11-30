import { LitElement, css, html } from 'lit';
import './ToolTip';
import './IconLabel';

export class DatePicker extends LitElement {
    static properties = {
        value: {
            type: Date,
            converter: {
                fromAttribute: (value, type) => {
                    if (!value) {
                        return null;
                    }

                    return new Date(value);
                },
                toAttribute: (value, type) => {
                    if (!value) {
                        return "";
                    }

                    return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}Z`;
                }
            }
        },
        label: {},
        name: {},

        _shownMonth: { type: Number, state: true },
        _shownYear: { type: Number, state: true }
    }

    connectedCallback() {
        super.connectedCallback();

        const d = this.value ?? new Date();
        this._shownMonth = d.getMonth();
        this._shownYear = d.getFullYear();
    }

    _formDateDisplay(date) {
        if (!date) return "-";

        return `${this._formatOrdinalSuffix(date.getDate())} ${this._formatMonthName(date.getMonth(), true)}, ${date.getFullYear()}`;
    }

    _formatOrdinalSuffix(dateIndex) {
        var j = dateIndex % 10,
            k = dateIndex % 100;
        if (j == 1 && k != 11) {
            return dateIndex + "st";
        }
        if (j == 2 && k != 12) {
            return dateIndex + "nd";
        }
        if (j == 3 && k != 13) {
            return dateIndex + "rd";
        }
        return dateIndex + "th";
    }

    _formatMonthName(monthIndex, short = false) {
        const fullNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const shortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (short) return shortNames[monthIndex];
        return fullNames[monthIndex];
    }

    _formatWeekdayName(weekdayIndex) {
        const weekdayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        return weekdayNames[weekdayIndex];
    }

    _getDaysInMonth(monthIndex, year) {
        return new Date(year, monthIndex + 1, 0).getDate();
    }

    set(date) {
        this.value = date;
        this.dispatchEvent(new Event("date-picker-change"));
    }

    changeMonth(amount) {
        this._shownMonth += amount;

        if (this._shownMonth < 0) {
            this._shownMonth = 11;
            this._shownYear--;
        }

        if (this._shownMonth > 11) {
            this._shownMonth = 0;
            this._shownYear++;
        }
    }

    reset() {
        this.set(null);
    }

    _renderMonth(monthIndex, year) {
        const getDayMondayIndexed = (date) => {
            return (date.getDay() + 6) % 7;
        }

        const datesEqual = (d1, d2) => {
            if (!d1 || !d2) return false;

            return (
                d1.getFullYear() == d2.getFullYear() &&
                d1.getMonth() == d2.getMonth() &&
                d1.getDate() == d2.getDate()
            );
        }

        const getDateClasses = (date) => {
            let classes = "";

            if (d.getMonth() != monthIndex) classes += "out-of-month ";
            if (datesEqual(d, new Date())) classes += "today ";
            if (datesEqual(d, this.value)) classes += "selected ";

            return classes;
        }

        let d = new Date(year, monthIndex);
        let rows = [];
        const daysInWeek = 7;
        const daysInMonth = this._getDaysInMonth(monthIndex, year);
        const weeksInMonth = Math.ceil((daysInMonth + getDayMondayIndexed(d)) / daysInWeek);

        // Set to first monday before start of month (or in month if it begins on a monday)
        d.setDate(d.getDate() - getDayMondayIndexed(d));

        // Header
        let weekdays = [];

        for (let dayIndex = 0; dayIndex < daysInWeek; dayIndex++) {
            weekdays.push(html`<td class="weekday">${this._formatWeekdayName(dayIndex)}</td>`);
        }

        rows.push(html`<tr class="weekdays">${weekdays}</tr>`);

        // Days
        for (let weekIndex = 0; weekIndex < weeksInMonth; weekIndex++) {
            let week = [];

            for (let dayIndex = 0; dayIndex < daysInWeek; dayIndex++) {
                let currDate = new Date(d.getTime());
                week.push(
                    html`
                        <td class="dateWrapper ${getDateClasses(d)}" @click="${() => { this.set(currDate) }}">
                            <div class="date">
                                ${d.getDate()}
                            </div>
                        </td>`
                );

                d.setDate(d.getDate() + 1);
            }

            rows.push(html`<tr class="week">${week}</tr>`);
        }

        return html`<table class="month">${rows}</table>`;
    }

    render() {
        return html`
            <tool-tip mode = "dropdown">
                <div class="btn" role="button">
                    <div class="label">${this.label}</div>

                    <div class="value">${this._formDateDisplay(this.value)}</div>
                </div>

                <div class="calendar" slot="tooltip">
                    <div class="header">
                        <h4 class="title">
                            ${this._formatMonthName(this._shownMonth)}, ${this._shownYear}
                        </h4>

                        <div class="controls">
                            <icon-label icon="chevron_left" button @click="${() => this.changeMonth(-1)}"></icon-label>
                            <icon-label icon="chevron_right" button @click="${() => this.changeMonth(1)}"></icon-label>
                        </div>
                    </div>

                    ${this._renderMonth(this._shownMonth, this._shownYear)}

                    <button class="reset" type="button" @click="${this.reset}">Reset</button>
                </div>
            </tool-tip>
            `;
    }

    static styles = css`
        .btn{
            --bg: #f1f5f9;
            --text-strong: #0f172a;
            --text-subtle: #64748b;

            background: var(--bg);
            border-radius: 0.5rem;

            padding: 1.5rem;

            cursor: pointer;
            transition: background 200ms ease;
        }
        .btn:hover{
            --bg: #FFEFFC;
            --text-strong: #64024C;
            --text-subtle: #64024C;
        }
        .label{
            font-size: 0.8rem;
            color: var(--text-subtle);
            font-weight: 400;

            transition: color 200ms ease;
        }
        .value{
            color: var(--text-strong);
            font-weight: 500;

            transition: color 200ms ease;
        }


        .calendar{
            padding: 0.5rem;
        }
        .header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;

            padding: 0 0.5rem;
        }
        .title{
            margin: 0;
            font-weight: 500;
            font-size: inherit;
        }
        .controls{
            display: flex;
            gap: 0.5rem;
        }


        .month{
            width: 100%;
            border-collapse: collapse;
            border: none;
        }
        .weekdays{

        }
        .weekday{
            text-align: center;
            color: #64748b;

            padding: 0.5rem;
        }

        .week{
            
        }
        .dateWrapper{
            cursor: pointer;

            --text: #0f172a;
            --bg: #fff;
            --border: #fff;
        }
        .dateWrapper.out-of-month{
            opacity: 0;
            pointer-events: none;
        }
        .dateWrapper:hover{
            --bg: #FFEFFC;
            -text: #8E0076;
        }
        .dateWrapper.selected{
            --text: #fff;
            --bg: #8E0076;
        }
        .dateWrapper.today{
            --border: #8E0076;
        }
        .date{
            background: var(--bg);
            color: var(--text);
            border: 1px solid var(--border);

            transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

            display: flex;
            align-items: center;
            justify-content: center;
            width: 3rem;
            height: 3rem;

            border-radius: 5rem;
        }


        .reset{
            background: none;
            border: none;

            display: block;
            width: fit-content;
            padding: 0.5rem;
            margin: 0;

            cursor: pointer;
            transition: color 0.2s ease;

            font-size: 1rem;
            font-weight: 400;
            font-family: inherit;
            color: #D204B0;
        }
        .reset:hover{
            color: #8E0076;
        }
    `;
}

customElements.define('date-picker', DatePicker);

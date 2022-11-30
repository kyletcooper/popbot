import { LitElement, css, html } from 'lit';

export class ToolTip extends LitElement {
    static properties = {
        _hidden: { state: true, type: Boolean },

        _start: { state: true },
        _end: { state: true },
        _move: { state: true },

        _x: { state: true, type: Number },
        _y: { state: true, type: Number },

        disabled: { type: Boolean },
        label: {},
        mode: {},
    };

    constructor() {
        super();

        this._hidden = true;

        this.mode = "tooltip"; // 'tooltip' or 'contextmenu' or 'dropdown'

        this._x = 0;
        this._y = 0;
    }

    firstUpdated() {
        this._start = "mouseenter";
        this._end = "mouseleave";
        this._move = "mousemove";

        if (this.mode == "contextmenu") {
            this._start = "contextmenu";
            this._end = "";
            this._move = "";

            this._addClickOffEventListener();
        }
        else if (this.mode == "dropdown") {
            this._start = "click";
            this._end = "";
            this._move = "";

            this._addClickOffEventListener();
        }

        const container = this.renderRoot.querySelector(".container");

        container.addEventListener(this._start, this._onStart.bind(this));
        container.addEventListener(this._end, this._onEnd.bind(this));
        container.addEventListener(this._move, this._onMove.bind(this));
    }

    _addClickOffEventListener() {
        window.addEventListener("click", e => {

            let found = false;

            e.composedPath()?.forEach(el => {
                if (el == this) {
                    found = true;
                    return;
                }
            });

            if (!found) this._onEnd(e);
        });
    }

    _onMove(e) {
        let tooltip = this.renderRoot?.querySelector(".tooltip");
        let offset = 10;

        if (!tooltip) {
            this._x = e.clientX + offset;
            this._y = e.clientY + offset;
            return;
        };

        let prevDisplay = tooltip.style.display;
        tooltip.style.display = "block";

        let elLeft = e.clientX + offset;
        let elRight = tooltip.offsetWidth + elLeft + offset;
        let screenWidth = document.body.clientWidth;
        let dstOffScreenRight = screenWidth - elRight;

        if (dstOffScreenRight < 0) {
            elLeft -= Math.abs(dstOffScreenRight);
        }

        let elTop = e.clientY + offset;
        let elBottom = tooltip.offsetHeight + elTop + offset;
        let screenHeight = document.body.clientHeight;
        let dstOffScreenBottom = screenHeight - elBottom;

        if (dstOffScreenBottom < 0) {
            elTop -= Math.abs(dstOffScreenBottom);
        }

        tooltip.style.display = prevDisplay;

        this._x = elLeft;
        this._y = elTop;
    }

    _onStart(e) {
        if (this._hidden) {
            this._hidden = false;
            this._onMove(e);
        }

        if (this.mode == "contextmenu") {
            e.preventDefault();
        }
    }

    _onEnd(e) {
        this._hidden = true;
    }

    render() {
        return html`
            <div class="container">
                <slot></slot>

                <div class="tooltip" ?hidden="${this._hidden || this.disabled}" style="--x: ${this._x}px; --y: ${this._y}px">
                    ${this.label ? html`<div class="label">${this.label}</div>` : null}
                    <slot name="tooltip"></slot>
                </div>
            </div>
        `;
    }

    static styles = css`
        [hidden]{
            display: none;
        }

        .tooltip{
            --x: 0;
            --y: 0;

            position: fixed;
            top: var(--y);
            left: var(--x);
            z-index: 9999999999;

            border-radius: 0.5rem;
            border: 1px solid #f8fafc;
            background: #fff;
            box-shadow:
            1.9px 1.9px 10px rgba(0, 0, 0, 0.025),
            15px 15px 80px rgba(0, 0, 0, 0.05)
            ;
        }

        .tooltip[hidden]{
            display: none;
        }

        .label{
            font-size: 0.8rem;

            padding: 0.4rem 0.8rem;
        }
    `;
}

customElements.define('tool-tip', ToolTip);

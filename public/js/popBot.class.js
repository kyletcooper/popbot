class popBot {
    /**
     * @param string          ID            Unique name for the popBot.
     * @param HTMLElement     element       Element to show when triggered.
     * @param string          trigger       Name of the event to trigger on.
     * @param conditionRule[] conditions    Array of all conditions that must be met.
     */
    constructor(ID, trigger, conditions) {
        var element = document.getElementById(ID);

        this.ID = ID;
        this.element = element;
        this.trigger = trigger;
        this.conditions = conditions;

        this.cookie = `pb_status_${this.ID}`;

        this.element.popBot = this;

        this._hide();

        window.addEventListener(this.trigger, event => {
            this._trigger(event);
        });
    }

    _trigger(event) {
        for (const condition of this.conditions) {
            if (!condition.check()) {
                return false; // A condition failed.
            }
        }

        if (window.popBot.cookie.get(this.cookie)) {
            return false; // Already shown to user.
        }

        if (window.popBot.bots.isShowing()) {
            return false; // Pop-up is showing.
        }

        if (Date.now() - window.popBot.bots.lastShown > window.popBot.config.timeBetweenPopups) {
            return false; // Last pop-up was too soon ago.
        }

        element.hidden = false;
        element.inert = false;
        this.showing = true;

        window.popBot.bots.lastShown = Date.now();

        window.popBot.message.send("show", { id: this.ID });
    }

    _hide() {
        element.hidden = true;
        element.inert = true;
        this.showing = false;
    }

    convert() {
        this._hide();

        window.popBot.cookie.set(this.cookie, "convert");

        window.popBot.message.send("convert", { id: this.ID });
    }

    dismiss() {
        this._hide();

        window.popBot.cookie.set(this.cookie, "dismiss");

        window.popBot.message.send("dismiss", { id: this.ID });
    }
}
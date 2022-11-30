import { debug, api, cookie } from './utils';

import './triggers';
import './conditions';
import './comparisons';

export class PopbotManager {
    constructor() {
        this.lastShown = 0;
        this.loadTime = Date.now();
        this.store = [];
    }

    /**
     * Gets a popBot by it's ID.
     * 
     * The popBot must have been created via popBot.bots.create().
     * 
     * @return popBot|false
     */
    get(botID) {
        for (const bot of this.store) {
            if (bot.ID == botID) {
                return bot;
            }
        }

        return false;
    }

    /**
     * Checks if any popBots are showing.
     * 
     * The popBot must have been created via popBot.bots.create().
     * 
     * @return bool
     */
    isShowing() {
        for (const bot of this.store) {
            if (bot.showing) {
                return true
            }
        }

        return false;
    }

    /**
     * Creates and adds a Popbot
     */
    create(opts) {
        let pBot = new Popbot(opts);
        this.add(pBot);
        return pBot;
    }

    /**
     * Stores a popBot.
     */
    add(Popbot) {
        Popbot.setManager(this);
        this.store.push(Popbot);
    }
}

export class Popbot {
    /**
     * @param object opts
     *      @param string          id                 Unique name for the popBot. Also used to get the HTMLElement
     *      @param string          trigger            Object containing the trigger name and threshold.
     *      @param array           conditions         Array of all conditions that must be met. Each object must have a "condition", "value" and "comparison" key.
     */
    constructor(opts) {
        if (!opts) return false;

        var element = document.getElementById(opts.id);

        if (!element) {
            // throw `PopBot: Element not found (#${opts.id}). Ensure popBot is not created before it is rendered.`;
            return false;
        }


        this.id = opts.id;
        this.opts = opts;
        this.cookie = `popBot_status_${this.id}`;
        this.element = element;
        this.trigger = opts.trigger;
        this.conditions = opts.conditions;
        this.inline = this.element.classList.contains("popbot-inline");
        this.manager = false;

        // Find the trigger
        this.triggerObject = window.popbot.triggers.find(trig => trig.id == this.trigger.trigger);
        this.triggerObject?.setupTrigger(this, this.trigger.threshold);

        this.element.popBot = this;

        // Add event listeners to template
        this.element.addEventListener("click", e => {
            const dismissSelector = "[data-popbot='dismiss']";
            const convertSelector = "a, btn, [data-popbot='convert']";

            if (e.target.matches(dismissSelector) || e.target.closest(dismissSelector)) {
                this.dismiss();
            }
            else if (e.target.matches(convertSelector) || e.target.closest(convertSelector)) {
                this.convert();
            }
        });
    }

    setManager(manager) {
        this.manager = manager;
    }

    _conditionsMet() {
        for (const conditionRules of this.conditions) {
            // Example value of 'condition':
            // { condition: "url.search", comparison: "contains", value: "utm" }
            const comparison = window.popbot.comparisons.find(o => o.id === conditionRules.comparison); // Has the implimentation details of the comparitor.
            const condition = window.popbot.conditions.find(o => o.id === conditionRules.condition); // The condition global relating to this rule.

            if (!comparison || !condition) {
                // Incomplete conditions shouldn't stop the bot from showing.
                continue;
            }

            const given = condition.value; // The actual value of the condition.
            const threshold = conditionRules.value; // The value we want to compare against.

            if (!comparison.compare(given, threshold)) {
                debug.popAttempt(this, false, `Condition not met (${condition.label} ${comparison.label.toLowerCase()} '${threshold}', '${given}' given).`);
                return false; // Comparison failed, don't continue;
            }
        }

        // No comparisons failed.
        return true;
    }

    pop() {
        if (this.showing) {
            return false;
        }

        if (cookie.get(this.cookie)) {
            if (!window.popbot.config.allowReshow || cookie.get(this.cookie) != "shown") {
                debug.popAttempt(this, false, `This PopBot has already shown.`);
                return false;
            }
        }

        // If a PopBot is displayed inline, we don't need to check if other bots are showing.
        if (this.manager.isShowing() && !this.inline) {
            debug.popAttempt(this, false, `A PopBot is already showing.`);
            return false;
        }

        if (Date.now() - this.manager.loadTime < window.popbot.config.timeBeforeFirstPopup && !this.inline) {
            debug.popAttempt(this, false, `Not long enough since page load.`);
            return false;
        }

        if (Date.now() - this.manager.lastShown < window.popbot.config.timeBetweenPopups && !this.inline) {
            debug.popAttempt(this, false, `Not long enough since last PopBot.`);
            return false;
        }

        if (!this._conditionsMet()) {
            return false;
        }

        this._show();
        return true;
    }

    _show() {
        this.element.hidden = false;
        this.element.inert = false;
        this.showing = true;
        this.element.classList.add("entering");

        setTimeout(() => {
            this.element.classList.remove("entering");
        }, 500);

        cookie.set(this.cookie, "shown");

        debug.popAttempt(this, true, `PopBot now showing!`);

        // Dispatch event for GTM or other code.
        const event = new CustomEvent('popBotShow', this._getEventOptions());
        this.element.dispatchEvent(event);

        // Report event to server
        api("/popbot/v1/analytics", { event_type: "shown", uuid: this.id, url: location.href }, 'POST');
    }

    _hide() {
        this.manager.lastShown = Date.now();

        this.element.classList.add("leaving");

        setTimeout(() => {
            this.element.classList.remove("leaving");

            this.element.hidden = true;
            this.element.inert = true;
            this.showing = false;
        }, 500);
    }

    _getEventOptions() {
        return {
            bubbles: true,

            details: {
                id: this.id,
                element: this.element,
            }
        };
    }

    convert() {
        this._hide();

        cookie.set(this.cookie, "converted");

        api("/popbot/v1/analytics", { event_type: "converted", uuid: this.id, url: location.href }, 'POST');

        debug.popAttempt(this, false, `Converted on by user.`);

        const event = new CustomEvent('popBotConvert', this._getEventOptions());
        this.element.dispatchEvent(event);
    }

    dismiss() {
        this._hide();

        cookie.set(this.cookie, "dismissed");

        api("/popbot/v1/analytics", { event_type: "dismissed", uuid: this.id, url: location.href }, 'POST');

        debug.popAttempt(this, false, `Dismissed by user.`);

        const event = new CustomEvent('popBotDismiss', this._getEventOptions());
        this.element.dispatchEvent(event);
    }
}
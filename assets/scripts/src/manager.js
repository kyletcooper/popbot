class popBot {
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

    _conditionsMet() {
        for (const conditionRules of this.conditions) {
            // Example value of 'condition':
            // { condition: "url.search", comparison: "contains", value: "utm" }
            let comparison = window.popbot.comparisons.find(o => o.id === conditionRules.comparison); // Has the implimentation details of the comparitor.
            let condition = window.popbot.conditions.find(o => o.id === conditionRules.condition); // The condition global relating to this rule.

            let given = condition.value; // The actual value of the condition.
            let threshold = conditionRules.value; // The value we want to compare against.

            if (!comparison || !threshold || !condition) {
                // Incomplete conditions shouldn't stop the bot from showing.
                continue;
            }

            if (!comparison.compare(given, threshold)) {
                window.popbot.manager.debug.popAttempt(this, false, `Condition not met (${condition.label} ${comparison.label.toLowerCase()} '${threshold}', '${given}' given).`);
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

        if (window.popbot.manager.cookie.get(this.cookie)) {
            if (!window.popbot.config.allowReshow || window.popbot.manager.cookie.get(this.cookie) != "shown") {
                window.popbot.manager.debug.popAttempt(this, false, `This PopBot has already shown.`);
                return false;
            }
        }

        // If a PopBot is displayed inline, we don't need to check if other bots are showing.
        if (window.popbot.manager.bots.isShowing() && !this.inline) {
            window.popbot.manager.debug.popAttempt(this, false, `A PopBot is already showing.`);
            return false;
        }

        if (Date.now() - window.popbot.manager.bots.loadTime < window.popbot.config.timeBeforeFirstPopup && !this.inline) {
            window.popbot.manager.debug.popAttempt(this, false, `Not long enough since page load.`);
            return false;
        }

        if (Date.now() - window.popbot.manager.bots.lastShown < window.popbot.config.timeBetweenPopups && !this.inline) {
            window.popbot.manager.debug.popAttempt(this, false, `Not long enough since last PopBot.`);
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

        window.popbot.manager.cookie.set(this.cookie, "shown");

        window.popbot.manager.debug.popAttempt(this, true, `PopBot now showing!`);

        // Dispatch event for GTM or other code.
        const event = new CustomEvent('popBotShow', this._getEventOptions());
        this.element.dispatchEvent(event);

        // Report event to server
        window.popbot.manager.fetch.send("popbotAnalytics", { event: "shown", id: this.id });
    }

    _hide() {
        window.popbot.manager.bots.lastShown = Date.now();

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

        window.popbot.manager.cookie.set(this.cookie, "converted");

        window.popbot.manager.fetch.send("popbotAnalytics", { event: "converted", id: this.id });

        window.popbot.manager.debug.popAttempt(this, false, `Converted on by user.`);

        const event = new CustomEvent('popBotConvert', this._getEventOptions());
        this.element.dispatchEvent(event);
    }

    dismiss() {
        this._hide();

        window.popbot.manager.cookie.set(this.cookie, "dismissed");

        window.popbot.manager.fetch.send("popbotAnalytics", { event: "dismissed", id: this.id });

        window.popbot.manager.debug.popAttempt(this, false, `Dismissed by user.`);

        const event = new CustomEvent('popBotDismiss', this._getEventOptions());
        this.element.dispatchEvent(event);
    }
}

window.popbot.manager = {
    debug: {
        store: [],

        popAttempt(bot, success, message) {
            let data = {
                bot: bot,
                success: success,
                message: message,
            };

            this.store.push({
                type: "popAttempt",
                time: Date.now(),
                data: data
            });

            const event = new CustomEvent("popbot-debug", {
                bubbles: true,
                detail: data
            });
            bot.element.dispatchEvent(event);
        }
    },

    fetch: {
        /**
         * Sends a message to the back-end.
         * 
         * @return Promise
         */
        send: async function (action, data) {
            data = {
                ...data,
                action: action,
            };

            let formdata = new FormData();

            for (let key in data) {
                formdata.append(key, data[key]);
            }

            const response = await fetch(window.popbot.fetch.ajax_url, {
                method: 'POST',
                body: formdata
            });

            const responseJSON = await response.json();
            return responseJSON;
        },

        api: async function (endpoint, args = {}, method = "GET") {
            let url = new URL(`${popbot.wp.home_url}/wp-json/${endpoint}`);

            let opts = {
                method: method,
                headers: new Headers({
                    'X-WP-Nonce': window.popbot.fetch.rest_nonce
                })
            }

            if (method == "GET") {
                for (const key in args) {
                    url.searchParams.append(key, args[key]);
                }
            }
            else {
                if (args instanceof FormData) {
                    opts.body = args;
                }
                else {
                    opts.body = new FormData();

                    for (const key in args) {
                        opts.body.append(key, args[key]);
                    }
                }
            }

            return await fetch(url.href, opts).then(res => res.json())
        }
    },

    cookie: {
        /**
         * Gets the value of a cookie.
         * 
         * Returns null if the cookie does not exist.
         * 
         * @param string
         * 
         * @return mixed|null
         */
        get: function (name) {
            var cookies = document.cookie.split(";");

            for (var i = 0; i < cookies.length; i++) {
                var cookieArr = cookies[i].split("=");
                if (name == cookieArr[0].trim()) {
                    return decodeURIComponent(cookieArr[1]);
                }
            }

            return null;
        },

        /**
         * Sets the value of a cookie.
         * 
         * @param string cookie
         * @param mixed  value
         * 
         * @return null
         */
        set: function (name, value) {
            var cookie = name + "=" + encodeURIComponent(value) + ";path=/;expires=max-age";
            document.cookie = cookie;
        }
    },

    bots: {
        /**
         * Gets a popBot by it's ID.
         * 
         * The popBot must have been created via popBot.bots.create().
         * 
         * @return popBot|false
         */
        get: function (botID) {
            for (const bot of this.store) {
                if (bot.ID == botID) {
                    return bot;
                }
            }

            return false;
        },

        /**
         * Checks if any popBots are showing.
         * 
         * The popBot must have been created via popBot.bots.create().
         * 
         * @return bool
         */
        isShowing: function () {
            for (const bot of this.store) {
                if (bot.showing) {
                    return true
                }
            }

            return false;
        },

        /**
         * Stores a popBot.
         */
        add: function (popBot) {
            this.store.push(popBot);
        },

        setupCustomConditions: async function () {
            const conditions = await popbot.manager.fetch.api('/wp/v2/popbot_condition/', { context: 'edit', _fields: ["id", "slug", "title", "content"] });

            for (const condition of conditions) {
                try {
                    let func = new Function(condition.content.raw);

                    window.popbot.conditions.push({
                        category: "Custom",
                        id: `custom.${condition.slug}`,
                        label: condition.title.rendered,
                        value: func(),
                    });
                }
                catch (e) {
                    console.error(e);
                }
            }
        },

        /**
         * Creates all the popBots sent by the server.
         */
        init: function () {
            for (const opts of window.popbot.bots) {
                try {
                    let pBot = new popBot(opts);
                    this.add(pBot);
                }
                catch (e) {
                    console.error(null, e);
                }
            }
        },

        lastShown: 0,
        loadTime: Date.now(),
        store: []
    },
};

document.addEventListener("DOMContentLoaded", () => {
    window.popbot.manager.bots.init();
    window.popbot.manager.bots.setupCustomConditions();

    // For the gutenberg Conditions format type.
    // It isn't a block type so it can't have it's own script file easily
    document.querySelectorAll(".popbot-condition").forEach(el => {
        if (document.body.classList.contains('block-editor-page')) return;

        const tag = el.textContent;
        const condition = window.popbot.conditions.find(cond => cond.id == tag);

        el.textContent = condition?.value;
        el.style.opacity = 1;
    });
}, { once: true });
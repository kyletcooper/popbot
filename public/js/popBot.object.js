window.popBot = {

    config: {
        pro: false,             // If this is the pro version of the plugin.
        timeBetweenPopups: 120, // Minimum time (in seconds) between two pop-ups showing and between opening the page and seeing a pop-up.
    },

    message: {
        /**
         * Sends a message to the back-end.
         * 
         * @return Promise
         */
        send: async function (endpoint, data) {
            let body = {
                endpoint: endpoint,
                data: data,
            };

            const response = await fetch(window.popBotPHP.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            return response.json();
        },
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
            var cookie = name + "=" + encodeURIComponent(value);
            document.cookie = cookie;
        }
    },

    conditions: {
        // #TODO: Add support for arbitary JS global scoped variables.

        /**
         * Gets the value of a condition.
         */
        get: function (key) {
            return window.popBot.conditions[key];
        },

        /**
         * Sets the value of a condition.
         */
        set: function (key, value) {
            window.popBot.conditions[key] = value;
        },

        /**
         * Initialises the conditions object based on what was sent by the server.
         * 
         * Merges with the server-side values, sets the client-side values.
         * 
         * @return null
         */
        init: function () {
            let clientConditions = {
                "url.pathname": window.location.pathname,
                "url.hash": window.location.hash,
                "url.host": window.location.host,
                "url.href": window.location.href,
                "url.protocol": window.location.protocol,
                "url.search": window.location.search,

                "user.device.isMobile": navigator.userAgentData.mobile,
                "user.device.lang": navigator.language,
                "user.device.os": navigator.userAgentData.platform,

                "math.random": Math.floor(Math.random() * 100),
            };

            let serverConditions = window.popBotPHP.conditions;

            let conditions = { ...serverConditions, ...clientConditions };

            conditions.forEach((value, key) => {
                window.popBot.conditions.set(key, value);
            });
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
            for (const bot of window.popBot.bots.store) {
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
            for (const bot of window.popBot.bots.store) {
                if (bot.showing) {
                    return true
                }
            }

            return false;
        },

        /**
         * Creates and stores a popBot.
         */
        create: function (id, trigger, conditions) {
            let popBot = new popBot(id, trigger, conditions);
            window.popBot.bots.store.push(popBot);
        },

        /**
         * Creates all the popBots sent by the server.
         */
        init: function () {
            for (const bot of window.popBotPHP.bots) {
                let conditions = [];

                for (const condition of bot.conditions) {
                    conditions.push(new ConditionRule(condition.condition, condition.compare, condition.value));
                }

                window.popBot.bots.create(bot.id, bot.trigger, conditions);
            }
        },

        lastShown: Date.now(),
        store: []
    }
};
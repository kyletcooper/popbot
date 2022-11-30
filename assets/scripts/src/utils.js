export const debug = {
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
}

export const api = async function (endpoint, args = {}, method = "GET") {
    let url = new URL(`${window.popbot.home_url}/wp-json/${endpoint}`);

    let opts = {
        method: method,
        headers: new Headers({
            'X-WP-Nonce': window.popbot.rest_nonce
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
            opts.headers.append('Content-Type', 'application/json');
            opts.body = JSON.stringify(args);
        }
    }

    return await fetch(url.href, opts).then(res => res.json())
}

export const cookie = {
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
}

export const setupCustomConditions = async () => {
    window.popbot.conditions = window.popbot.conditions || [];
    const customConditions = await api('/popbot/v1/custom-conditions/');

    // Remove all existing custom conditions so we don't have duplicates
    window.popbot.conditions = window.popbot.conditions.filter(cond => cond.category !== "Custom");

    for (const condition of customConditions) {
        try {
            let func = new Function(condition.callback);

            window.popbot.conditions.push({
                category: "Custom",
                id: `custom.${condition.id}`,
                label: condition.title,
                value: func(),
            });
        }
        catch (e) {
            console.error(e);
        }
    }
}

export const categorise = (items, key) => {
    var result = [];

    if (!items || !items.length) {
        return result;
    }

    items.forEach(item => {
        let found = false;

        result.forEach(cat => {
            if (cat.label == item[key]) {
                cat.items.push(item);
                found = true;
            }
        })

        if (!found) {
            result.push({
                label: item[key],
                items: [item]
            });
        }
    });

    return result;
}
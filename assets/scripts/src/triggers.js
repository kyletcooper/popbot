window.popbot.triggers = [
    /*      ENGAGEMENT       */
    {
        id: "click",
        label: "Click Element",

        icon: "ads_click",
        category: "Engagement",
        color: "#85A700",

        options: [
            {
                default: "#id",
                label: "Element Selector"
            }
        ],

        setupTrigger: function (popBot, trigger_threshold) {
            window.addEventListener("click", e => {
                if (trigger_threshold) {
                    // If we have a threshold selector.
                    if (!e.target.matches(trigger_threshold) && !e.target.closest(trigger_threshold)) {
                        // If the target and none of it's ancestors match the selector.
                        return false;
                    }
                }

                popBot.pop();
            })
        }
    },
    {
        id: "exit_intent",
        label: "Go to Exit",

        icon: "meeting_room",
        category: "Engagement",
        color: "#85A700",

        setupTrigger: function (popBot) {
            document.addEventListener('mouseout', e => {
                if (!e.toElement && !e.relatedTarget) {
                    popBot.pop();
                }
            });
        }
    },
    {
        id: "scroll",
        label: "Scroll Depth",

        icon: "open_with",
        category: "Engagement",
        color: "#85A700",

        options: [
            {
                default: 75,
                type: "number",
                label: "Scroll Depth"
            }
        ],

        setupTrigger: function (popBot, trigger_threshold) {
            window.addEventListener("scroll", e => {
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100; // Not 100% accurate but close enough

                if (trigger_threshold && scrollPercent < trigger_threshold) {
                    // If we have a threshold percentage and it's not met
                    return false;
                }

                popBot.pop();
            })
        }
    },
    {
        id: "submit",
        label: "Form Submission",

        icon: "playlist_add_check",
        category: "Engagement",
        color: "#85A700",

        options: [
            {
                default: "#id",
                label: "Form Selector"
            }
        ],

        setupTrigger: function (popBot, trigger_threshold) {
            window.addEventListener("submit", e => {
                if (trigger_threshold) {
                    // If we have a threshold selector.
                    if (!e.submitter.matches(trigger_threshold)) {
                        // If the target and none of it's ancestors match the selector.
                        return false;
                    }
                }

                popBot.pop();
            })
        }
    },

    /*      TIME        */
    {
        id: "idle",
        label: "Idle Time",

        icon: "hourglass_bottom",
        category: "Time",
        color: "#1E92F8",

        options: [
            {
                default: 30,
                type: "number",
                label: "Idle Duration"
            }
        ],

        setupTrigger: function (popBot, trigger_threshold) {
            const activityEvents = ['mousedown', 'mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
            let timer;

            function resetTimer(e) {
                clearTimeout(timer);

                timer = setTimeout(() => {
                    popBot.pop();
                }, trigger_threshold * 1000) // Trigger threshold is in seconds
            }

            activityEvents.forEach(function (name) {
                document.addEventListener(name, resetTimer, true);
            });
        }
    },
    {
        id: "duration",
        label: "Time on Page",

        icon: "schedule",
        category: "Time",
        color: "#1E92F8",

        options: [
            {
                default: 60,
                type: "number",
                label: "Duration Time"
            }
        ],

        setupTrigger: function (popBot, trigger_threshold) {
            setTimeout(() => {
                popBot.pop();
            }, trigger_threshold * 1000) // Trigger threshold is in seconds
        }
    },

    /*      OTHER        */
    {
        id: "event",
        label: "JavaScript Event",

        icon: "code",
        category: "Other",
        color: "#F8A11E",

        options: [
            {
                default: "click",
                label: "Event Type"
            }
        ],

        setupTrigger: function (popBot, trigger_threshold) {
            window.addEventListener(trigger_threshold, e => {
                popBot.pop();
            })
        }
    },
];
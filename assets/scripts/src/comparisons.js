window.popbot.comparisons = [
    {
        id: "equal",
        label: "Equals",

        compare: function (given, threshold) {
            return given == threshold;
        }
    },

    {
        id: "not-equal",
        label: "Not equals",

        compare: function (given, threshold) {
            return given != threshold;
        }
    },

    {
        id: "greater-than",
        label: "Greater Than",

        compare: function (given, threshold) {
            return parseFloat(given) > parseFloat(threshold);
        }
    },

    {
        id: "less-than",
        label: "Less Than",

        compare: function (given, threshold) {
            return parseFloat(given) < parseFloat(threshold);
        }
    },
    {
        id: "contains",
        label: "Contains",

        compare: function (given, threshold) {
            return given.includes(threshold);
        }
    },
    {
        id: "not-contains",
        label: "Doesn't Contain",

        compare: function (given, threshold) {
            return !threshold.includes(given);
        }
    }
];
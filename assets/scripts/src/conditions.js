window.popbot.conditions = [
    {
        id: "url.href",
        label: "Full URL",
        category: "URL",
        value: window.location.href,
    },
    {
        id: "url.pathname",
        label: "Path",
        category: "URL",
        value: window.location.pathname,
    },
    {
        id: "url.host",
        label: "Domain",
        category: "URL",
        value: window.location.host,
    },
    {
        id: "url.hash",
        label: "Hash",
        category: "URL",
        value: window.location.hash,
    },
    {
        id: "url.search",
        label: "Query Params",
        category: "URL",
        value: window.location.search,
    },
    {
        id: "url.protocol",
        label: "Protocol",
        category: "URL",
        value: window.location.protocol,
    },

    {
        id: "user.device.isMobile",
        label: "Is Mobile",
        category: "Device",
        value: navigator.userAgentData.mobile,
    },
    {
        id: "user.device.lang",
        label: "Language Code",
        category: "Device",
        value: navigator.language,
    },
    {
        id: "user.device.os",
        label: "Operating System",
        category: "Device",
        value: navigator.userAgentData.platform,
    },

    {
        id: "user.location.region",
        label: "Region",
        category: "Geolocation",
        value: window.popbot?.condition_values['user.location.region'],
    },
    {
        id: "user.location.continent",
        label: "Continent",
        category: "Geolocation",
        value: window.popbot?.condition_values['user.location.continent'],
    },
    {
        id: "user.location.country",
        label: "Country",
        category: "Geolocation",
        value: window.popbot?.condition_values['user.location.country'],
    },
    {
        id: "user.location.city",
        label: "City",
        category: "Geolocation",
        value: window.popbot?.condition_values['user.location.city'],
    },

    {
        id: "user.journey.referrer",
        label: "Referrer",
        category: "User Journey",
        value: window.popbot?.condition_values['user.journey.referrer'],
    },
    {
        id: "user.journey.returning",
        label: "Is Returning",
        category: "User Journey",
        value: window.popbot?.condition_values['user.journey.returning'],
    },
    {
        id: "user.journey.landing",
        label: "Is First Page",
        category: "User Journey",
        value: window.popbot?.condition_values['user.journey.landing'],
    },
    {
        id: "user.journey.pageCount",
        label: "Pages Visited",
        category: "User Journey",
        value: window.popbot?.condition_values['user.journey.pageCount'],
    },

    {
        id: "post.ID",
        label: "Post ID",
        category: "Post",
        value: window.popbot?.condition_values['post.ID'],
    },
    {
        id: "post.title",
        label: "Title",
        category: "Post",
        value: window.popbot?.condition_values['post.title'],
    },
    {
        id: "post.type",
        label: "Post Type",
        category: "Post",
        value: window.popbot?.condition_values['post.type'],
    },
    {
        id: "post.author",
        label: "Author",
        category: "Post",
        value: window.popbot?.condition_values['post.author'],
    },

    {
        id: "date.time",
        label: "Unix Time",
        category: "Time",
        value: window.popbot?.condition_values['date.time'],
    },
    {
        id: "date.dayOfWeek",
        label: "Day of the Week",
        category: "Time",
        value: window.popbot?.condition_values['date.dayOfWeek'],
    },
    {
        id: "date.date",
        label: "Date",
        category: "Time",
        value: window.popbot?.condition_values['date.date'],
    },
    {
        id: "date.month",
        label: "Month",
        category: "Time",
        value: window.popbot?.condition_values['date.month'],
    },
    {
        id: "date.year",
        label: "Year",
        category: "Time",
        value: window.popbot?.condition_values['date.year'],
    },

    {
        id: "user.wp.isLoggedIn",
        label: "Is Logged In",
        category: "WordPress User",
        value: window.popbot?.condition_values["user.wp.isLoggedIn"],
    },
    {
        id: "user.wp.login",
        label: "Username",
        category: "WordPress User",
        value: window.popbot?.condition_values["user.wp.login"],
    },
    {
        id: "user.wp.roles",
        label: "Roles",
        category: "WordPress User",
        value: window.popbot?.condition_values["user.wp.roles"],
    },

    {
        id: "math.random",
        label: "Random Number",
        category: "Maths",
        value: Math.floor(Math.random() * 100)
    },

    {
        id: "user.optimise.group",
        label: "A/B Group",
        category: "Optimisation",
        value: localStorage.getItem("popbot.optimise.group"),
    },
];
import { cookie } from './utils';

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
        value: navigator.userAgentData.mobile ? 1 : 0,
        options: [
            {
                id: '0',
                label: 'False'
            },
            {
                id: '1',
                label: 'True'
            }
        ]
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

    // {
    //     id: "user.location.region",
    //     label: "Region",
    //     category: "Geolocation",
    //     value: cookie.get('popBot_geolocation_region'),
    // },
    // {
    //     id: "user.location.continent",
    //     label: "Continent",
    //     category: "Geolocation",
    //     value: cookie.get('popBot_geolocation_continent'),
    // },
    // {
    //     id: "user.location.country",
    //     label: "Country",
    //     category: "Geolocation",
    //     value: cookie.get('popBot_geolocation_country'),
    // },
    // {
    //     id: "user.location.city",
    //     label: "City",
    //     category: "Geolocation",
    //     value: cookie.get('popBot_geolocation_city'),
    // },

    {
        id: "user.journey.referrer",
        label: "Referrer",
        category: "User Journey",
        value: cookie.get("popBot_journey_referrer"),
    },
    {
        id: "user.journey.returning",
        label: "Is Returning",
        category: "User Journey",
        value: cookie.get("popBot_journey_returning"),
        options: [
            {
                id: '0',
                label: 'False'
            },
            {
                id: '1',
                label: 'True'
            }
        ]
    },
    {
        id: "user.journey.landing",
        label: "Is First Page",
        category: "User Journey",
        value: cookie.get("popBot_journey_landing"),
        options: [
            {
                id: '0',
                label: 'False'
            },
            {
                id: '1',
                label: 'True'
            }
        ]
    },
    {
        id: "user.journey.pageCount",
        label: "Pages Count",
        category: "User Journey",
        value: cookie.get("popBot_journey_pageCount"),
    },

    {
        id: "post.isFrontPage",
        label: "Is Front Page",
        category: "Post",
        value: window.popbot.serverConditions['post.isFrontPage'] ? 1 : 0,
        options: [
            {
                id: '0',
                label: 'False'
            },
            {
                id: '1',
                label: 'True'
            }
        ]
    },

    {
        id: "post.ID",
        label: "Post ID",
        category: "Post",
        value: window.popbot.serverConditions['post.ID'],
    },
    {
        id: "post.title",
        label: "Title",
        category: "Post",
        value: window.popbot.serverConditions['post.title'],
    },
    {
        id: "post.type",
        label: "Post Type",
        category: "Post",
        value: window.popbot.serverConditions['post.type'],
    },
    {
        id: "post.author",
        label: "Author",
        category: "Post",
        value: window.popbot.serverConditions['post.author'],
    },

    {
        id: "date.time",
        label: "Unix Time",
        category: "Time",
        value: window.popbot.serverConditions['date.time'],
    },
    {
        id: "date.dayOfWeek",
        label: "Day of the Week",
        category: "Time",
        value: window.popbot.serverConditions['date.dayOfWeek'],
    },
    {
        id: "date.date",
        label: "Date",
        category: "Time",
        value: window.popbot.serverConditions['date.date'],
    },
    {
        id: "date.month",
        label: "Month",
        category: "Time",
        value: window.popbot.serverConditions['date.month'],
    },
    {
        id: "date.year",
        label: "Year",
        category: "Time",
        value: window.popbot.serverConditions['date.year'],
    },

    {
        id: "user.wp.isLoggedIn",
        label: "Is Logged In",
        category: "WordPress User",
        value: window.popbot.serverConditions["user.wp.isLoggedIn"] ? 1 : 0,
        options: [
            {
                id: '0',
                label: 'False'
            },
            {
                id: '1',
                label: 'True'
            }
        ]
    },
    {
        id: "user.wp.login",
        label: "Username",
        category: "WordPress User",
        value: window.popbot.serverConditions["user.wp.login"],
    },
    {
        id: "user.wp.roles",
        label: "Roles",
        category: "WordPress User",
        value: window.popbot.serverConditions["user.wp.roles"],
    },

    {
        id: "math.random",
        label: "Random Number",
        category: "Maths",
        value: Math.floor(Math.random() * 100)
    },
];
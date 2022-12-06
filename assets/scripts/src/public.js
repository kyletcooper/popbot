import { PopbotManager } from './popbot';
import { setupCustomConditions, api } from './utils';

window.api = api;

(() => {
    window.popbot.manager = new PopbotManager();

    if (window.popbot.bots) {
        for (const opts of window.popbot.bots) {
            try {
                window.popbot.manager.create(opts);
            } catch (e) {
                console.error(null, e);
            }
        }
    }

    setupCustomConditions();
})()

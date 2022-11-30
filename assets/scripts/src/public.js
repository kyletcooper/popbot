import { PopbotManager } from './popbot';
import { setupCustomConditions, setupServerConditions, api } from './utils';

window.api = api;

(() => {
    window.popbot.manager = new PopbotManager();

    if (window.popbot.bots) {
        for (const opts of window.popbot.bots) {
            try {
                window.popbot.manager.create(opts);
            }
            catch (e) {
                console.error(null, e);
            }
        }
    }

    setupCustomConditions();
})()

// For the gutenberg Conditions format type.
// It isn't a block type so it can't have it's own script file easily
// document.querySelectorAll(".popbot-condition").forEach(el => {
//     if (document.body.classList.contains('block-editor-page')) return;

//     const tag = el.textContent;
//     const condition = conditions.find(cond => cond.id == tag);

//     el.textContent = condition?.value;
//     el.style.opacity = 1;
// });
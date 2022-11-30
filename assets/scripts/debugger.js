class pobBotDebugger {
    static checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`;
    static closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

    constructor() {
        this.element = this.createContainerElement();

        document.body.append(this.element);

        // Set up event listeners
        window.addEventListener("popbot-debug", e => {
            this.setAttemptStatus(e.detail.bot.id, e.detail.success, e.detail.message);
        });
    }

    close() {
        this.element.remove();
    }

    setAttemptStatus(bot_id, success, message) {
        let element = this.getBotElement(bot_id);
        let messageElement = element.querySelector(".popbot-debugger-bot-msg");
        let icon = element.querySelector(".popbot-debugger-bot-icon");

        messageElement.textContent = message;

        if (success) {
            element.classList.add("popbot-debugger-bot__success");
            icon.innerHTML = pobBotDebugger.checkIcon;

            this.animAttemptPop(bot_id, "#10b981");
        }
        else {
            element.classList.remove("popbot-debugger-bot__success");
            icon.innerHTML = pobBotDebugger.closeIcon;

            this.animAttemptPop(bot_id, "#f43f5e");
        }
    }

    animAttemptPop(bot_id, color) {
        let element = this.getBotElement(bot_id);
        let icon = element.querySelector(".popbot-debugger-bot-icon");

        icon.animate([
            {
                outline: "0px solid " + color
            },
            {
                transform: "scale(0.9)",
            },
            {
                outline: "0.75rem solid rgba(255, 255, 255, 0)"
            }
        ], {
            duration: 500,
            easing: "ease-out"
        });
    }

    animBtnSuccess(btn) {
        btn.animate([
            {
                background: "#10b981",
                outline: "0px solid #bbf7d0",
            },
            {
                outline: "0.75rem solid rgba(255, 255, 255, 0)"
            }
        ], {
            duration: 1200,
            easing: "ease-out"
        });
    }


    createContainerElement() {
        // Container
        let container = document.createElement("div");

        container.classList.add("popbot-debugger");

        // Header
        let header = document.createElement("header");

        let title = document.createElement("h2");
        let close = document.createElement("button");

        header.classList.add("popbot-debugger-header");

        // Title
        title.textContent = "PopBot Debugger";
        title.classList.add("popbot-debugger-title");

        // Close
        close.innerHTML = "&times;";
        close.classList.add("popbot-debugger-close");
        close.setAttribute("type", "button");

        close.addEventListener("click", this.close.bind(this));

        // Body
        let body = document.createElement("div");
        body.classList.add("popbot-debugger-body");

        // Footer
        let footer = document.createElement("footer");
        footer.classList.add("popbot-debugger-footer");

        // Clear Cookies Button
        let cookiesBtn = document.createElement("button");
        cookiesBtn.textContent = "Clear Cookies";
        cookiesBtn.setAttribute("type", "button");
        cookiesBtn.classList.add("popbot-debugger-btn");
        cookiesBtn.addEventListener("click", this.clearCookies.bind(this));
        footer.append(cookiesBtn);

        // Structure
        header.append(close, title);
        container.append(header);
        container.append(body);

        window.popbot.bots.forEach(bot => {
            let botHTML = this.createBotElement(bot);
            if (botHTML) body.append(botHTML);
        });

        container.append(footer);

        let styles = this.createStyleElement();
        container.append(styles);

        // Return
        return container;
    }

    createStyleElement() {
        let styles = document.createElement("style");

        styles.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

            .popbot-debugger{
                position: fixed;
                bottom: 2rem;
                left: 2rem;
                z-index: 999;

                width: 50ch;
                max-width: 75vw;
            
                background: #fff;
                border: #e2e8f0 solid 1px;
                border-radius: 0.4rem;
                box-shadow: 0.5rem 0.5rem 1.5rem rgb(0 0 0 / 10%);
            
                font-family: "Poppins", Poppins;
                font-weight: 400;
            }
            
            .popbot-debugger-header{
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1.5rem;
                padding-left: 0.5rem;
            
                border-bottom: #e2e8f0 solid 1px;
            }
            .popbot-debugger-close{
                border: none;
            
                width: 3rem;
                height: 3rem;
            
                font-size: 2rem;
            
                display: flex;
                align-items: center;
                justify-content: center;
            
                background: transparent;
                border-radius: 100%;
            
                cursor: pointer;
            }
            .popbot-debugger-close:hover{
                background: #eee;
            }
            .popbot-debugger-title{
                padding: 0;
                margin: 0;
            
                font-size: 1.3rem;
                font-weight: 500;
                font-family: inherit;
            }

            .popbot-debugger-body{
                padding: 1.5rem;

                display: grid;
                gap: 1.5rem;

                max-height: 70vh;
                overflow-y: auto;
            }
            
            .popbot-debugger-bot{
            }
            .popbot-debugger-bot-name{
                font-family: inherit;
                font-size: 1.2rem;
                font-weight: 500;
                
                margin: 0;
            }
            .popbot-debugger-bot-cause{
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .popbot-debugger-bot-icon{
                font-size: 1rem;

                padding: 0.5rem;
            
                display: flex;
                align-items: center;
                justify-content: center;
                
                border-radius: 100%;
            
                color: #be123c;
                background: #ffe4e6;
            }
            .popbot-debugger-bot-icon svg{
                fill: currentColor;
            }
            .popbot-debugger-bot-msg{
                color: #64748b;
            }
            .popbot-debugger-footer{
                display: flex;
                gap: 1rem;
                padding: 0.75rem 1.5rem;
                
                border-top: #e2e8f0 solid 1px;
            }
            
            .popbot-debugger-btn{
                padding: 0.4rem 0.8rem;
            
                background: #D204B0;
                color: white;
            
                border: none;
                border-radius: 0.2rem;
            
                cursor: pointer;
                
                font-size: 0.9rem;
                font-weight: inherit;
                font-family: inherit;
            
                transition: background 0.2s ease;
            }
            .popbot-debugger-btn:hover,
            .popbot-debugger-btn:focus{
                background: #8E0076;
            }
            
            .popbot-debugger-bot__success .popbot-debugger-bot-icon{
                background: #d1fae5;
                color: #047857;
            }
        `;

        return styles;
    }

    createBotElement(bot) {
        if (!bot) return false;

        let container = document.createElement("div");

        let cause = document.createElement("div");
        let icon = document.createElement("div");
        let message = document.createElement("p");

        // Container
        container.classList.add("popbot-debugger-bot");
        container.setAttribute("data-popbot-id", bot.id);

        // Title
        let title = document.createElement("h3");
        title.textContent = bot.title;
        title.classList.add("popbot-debugger-bot-name");
        container.append(title);

        // Cause
        cause.classList.add("popbot-debugger-bot-cause");
        container.append(cause);

        // Icon
        icon.innerHTML = pobBotDebugger.closeIcon;
        icon.classList.add("popbot-debugger-bot-icon");
        cause.append(icon);

        // Message
        message.textContent = "Trigger not fired.";
        message.classList.add("popbot-debugger-bot-msg");
        cause.append(message);

        return container;
    }

    getBotElement(bot_id) {
        return this.element.querySelector(`[data-popbot-id="${bot_id}"]`);
    }

    clearCookies(e) {
        const cookies_prefix = "popBot_";
        let cookies = document.cookie.split(';').map(i => i.trim()).filter(c => c.startsWith(cookies_prefix));

        cookies.forEach(c => {
            const name = c.split("=")[0];
            document.cookie = `${name}=;`;
        });

        this.animBtnSuccess(e.target);
    }
}

function popbotDebuggerSetup() {
    window.addEventListener("click", e => {
        if (e.target.matches(".popbot-debugger-opener") || e.target.closest(".popbot-debugger-opener")) {
            if (window.popBotDebugger) {
                window.popBotDebugger.close();
            }

            window.popBotDebugger = new pobBotDebugger();
        }
    })
}
popbotDebuggerSetup();
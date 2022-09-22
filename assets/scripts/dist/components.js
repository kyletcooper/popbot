/*! For license information please see components.js.LICENSE.txt */
(()=>{var e={943:()=>{},266:(e,t,i)=>{"use strict";var s=i(392),r=i(830),n=i(803);class o extends n.I{static properties={value:{type:String,reflect:!0},_iframeLoading:{state:!0}};static key="template";static defaultValue="";constructor(){super(),this._iframeLoading=!0}async _chooseTemplate(){let e=this.renderRoot.getElementById("changeTemplatePanel");WRDSelectPanelChoose(e).then((e=>{e.length>0&&this.requestUpdate("value")})).catch((()=>{}))}async save(){this.renderRoot.querySelector(".editor")?.contentWindow?.wp?.data?.dispatch("core/editor")?.savePost(),super.save()}_openSettings(){this.renderRoot.querySelector("#templateSettingsPanel")?.openPanel()}_onLoad(e){this._iframeLoading=!1}static styles=s.iv`
        .container{
            height: 100%;

            position: relative;
        }

        .editor{
            display: block;
            width: 100%;
            height: 100%;

            border: none;
        }

        .loading{
            position: absolute;
            inset: 0;

            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            justify-content: center;

            font-size: 0.8rem;
            color: #64748b;

            background: rgba(255, 255, 255, 0.75);

            pointer-events: none;
            transition: opacity 0.2s ease;
        }

        .spinner {
            width: 2.5rem;
            height: 2.5rem;

            border-radius: 50%;
            border: 0.2rem solid currentColor;
            border-color: currentColor currentColor currentColor transparent;

            animation: spinner 1.2s linear infinite;
            transition: opacity 0.4s ease;
        }

        @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
        }

        .loading[hidden]{
            opacity: 0;
        }

        .options{
            display: grid;
            grid-template-columns: auto auto 1fr;
            align-items: center;
            justify-items: end;
            gap: 0.5rem;
        }
    `;render(){return s.dy`
            <wrd-panel id="panel" header="Customise Appearance">

                <wrd-template-settings-panel id="templateSettingsPanel"></wrd-template-settings-panel>
                
                <div class="container">
                    <wrd-select-panel id="changeTemplatePanel" max="1" header="Choose a Template">
                        ${(0,r.r)(window.popbot.templates,(e=>e.part_name),(e=>s.dy`<wrd-part-preview key="${e.part_name}" part="${e.part_name}" name="${e.details.name}"></wrd-part-preview>`))}
                    </wrd-select-panel>

                    <div class="loading" ?hidden="${!this._iframeLoading}">
                        <div class="spinner"></div>
                        Loading...
                    </div>

                    <iframe class="editor" @load="${this._onLoad}" src="${`${window.popbot.wp.admin_url}post.php?post=${window.popbot.wp.post_id}&action=edit`}"></iframe>
                </div >


                <div slot="options" class="options">
                    <wrd-button @click="${this._chooseTemplate}" secondary > Change Template</wrd-button>
                    
                    <wrd-icon icon="settings" button @click="${this._openSettings}"></wrd-icon>
                
                    <wrd-button id="button" @click="${this.save}">Save Changes</wrd-button>
                </div>

            </wrd-panel>
    `}}customElements.define("wrd-appearance-panel",o)},451:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={post_id:{type:Number},bot:{state:!0}};connectedCallback(){super.connectedCallback(),this._fetchPost()}async _fetchPost(){let e=await window.popbot.manager.fetch.send("popbotGetBotDetails",{post_id:this.post_id});e.success&&(this.bot=e.data)}static styles=s.iv`
        .container{
            width: 20rem;
            
            background: white;

            padding: 1rem;
            border-radius: 0.375rem;
            box-shadow: 0 10px 15px -3px rgb(254 206 246 / 0.3), 0 4px 6px -4px rgb(254 206 246 / 0.3);
        }

        .preview{
            height: 14rem;
        }

        .header{
            display: flex;
            align-items: center;
            gap: 1rem;

            margin-top: 1rem;
        }

        .dot{
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 2rem;

            background: #f43f5e;
        }
        .dot.enabled{
            background: #10b981;
        }

        .link{
            color: rgb(15 23 42);
            font-weight: 500;
            font-size: 1.125rem;
            line-height: 1.75rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
        }

        .icon{
            margin-left: auto;
        }
    `;render(){return s.dy`
            <article class="container">

                <div class="preview">
                    <wrd-bot-preview post="${this.post_id}" scale="0.5"></wrd-bot-preview>
                </div>

                <header class="header">
                    <div class="dot ${this.bot?.enabled?"enabled":"disabled"}" title="${this.bot?.enabled?"Enabled":"Disabled"}"></div>


                    <a href="${this.bot?.edit_link}" class="link">
                        ${this.bot?.title}
                    </a>


                    <wrd-icon icon="more_vert" button class="icon"></wrd-icon>
                </header>
            </article>
            `}}customElements.define("wrd-bot",r)},987:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={post:{type:Number},errors:{state:!0},scale:{type:Number},showErrors:{attribute:"show-errors",type:Boolean}};constructor(){super(),this.showErrors=!1,this.scale=1,this.post=-1,this.errors=[],this.refreshErrors(),document.addEventListener("wrd-panel-interface-saved",(e=>{this.refreshPreview(),this.refreshErrors()})),document.addEventListener("wrd-visibility-toggle-change",(e=>{this.refreshErrors()}))}_onLoad(e){e.target.classList.remove("loading")}refreshPreview(){let e=this.renderRoot.querySelector("iframe");e.classList.add("loading"),e.contentWindow.location.reload()}async refreshErrors(){var e=new FormData;e.append("action","getErrors"),e.append("post_id",window.popbot.wp.post_id),e.append("nonce",window.popbot.fetch.nonce);const t=await fetch(window.popbot.fetch.ajax_url,{method:"POST",body:e}),i=await t.json();t.ok&&i.success&&(this.errors=i.data.data)}static styles=s.iv`
        *{
            box-sizing: border-box;
        }

        .iframeWrapper{
            position: relative;

            background: #f8fafc;

            overflow: hidden;

            padding: 1rem;

            height: 100%;

            border-radius: 0.25rem;
        }

        .iframe{
            display: block;

            border: none;
            padding: 0;
            margin: 0;

            pointer-events: none;

            width: 100%;
            height: 100%;
        }

        .iframeLoader {
            width: 2.5rem;
            height: 2.5rem;

            position: absolute;
            top: calc(50% - 1.25rem);
            left: calc(50% - 1.25rem);

            border-radius: 50%;
            border: 0.2rem solid currentColor;
            border-color: currentColor currentColor currentColor transparent;

            animation: spinner 1.2s linear infinite;
            transition: opacity 0.4s ease;

            opacity: 0;
        }

        .iframe.loading{
            opacity: 0.5;
        }

        .iframe.loading ~ .iframeLoader{
            opacity: 1;
        }

        @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
        }
        
        .ol{
            list-style: none;
            margin: 0;
            padding: 0;

            margin-top: 1rem;
        }

        .li{
            display: flex;
            align-items: center;
            font-weight: 500;
        }
    `;render(){return s.dy`
            <div class="iframeWrapper">
                <iframe loading="eager" src="${window.popbot.wp.home_url}/popBotPreview?post=${this.post}&scale=${this.scale}" class="iframe loading" @load="${this._onLoad}"></iframe>
                <div class="iframeLoader"></div>
            </div>

            ${this.showErrors?s.dy`
            <ol class="ol">
                ${this.errors.map((e=>s.dy`
                        <li class="li">
                            <wrd-icon icon="error" style="--size: 35px; --fill: #f43f5e"></wrd-icon>
                            ${e}
                        </li>`))}
            </ol>`:null}
            `}}customElements.define("wrd-bot-preview",r)},411:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={icon:{},secondary:{type:Boolean},loading:{type:Boolean,reflect:!0}};constructor(){super(),this.disabled=!1,this.loading=!1}static styles=s.iv`
        :host{
            --text: white;
            --bg: #AF0092;
            --load-1: #E615C3;
            --load-2: #F15AD7;
            --outline: #FECEF6;

            display: block;
            width: fit-content;
        }
        
        .button{
            border: none;
            margin: 0;

            display: flex;
            align-items: center;
            justify-content: start;
            gap: 1rem;

            width: fit-content;

            padding: 0.5rem 1rem;
            border: 1px solid transparent; /* Helps it line up with inputs */

            color: var(--text);
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            font-size: inherit;
            font-family: inherit;
            text-overflow: ellipsis;

            cursor: pointer;

            border-radius: 0.2rem;
            background: var(--bg);
            box-shadow: inset 0 0 0 0px rgba(0, 0, 0, 0);
            transition: box-shadow 0.1s ease-in, outline 0.2s ease;

            position: relative;
        }
        .button:hover,
        .button:focus{
            box-shadow: inset 0 0 0 3rem rgba(0, 0, 0, 0.25);
        }

        .button:focus-visible{
            outline: 0.3rem solid var(--outline);
            outline-offset: none;
        }

        .icon{
            --fill: var(--text);
        }

        .button[disabled]{
            background: gray;
            pointer-events: none;
        }

        .button.loading{
            box-shadow: inset 0 0 0 0px rgba(0, 0, 0, 0);
            background: repeating-linear-gradient(
                45deg,
                var(--load-1),
                var(--load-1) 1.5rem,
                var(--load-2) 1.5rem,
                var(--load-2) 3rem
              );
            background-size: 200% 200%;
            animation: loading 2s linear infinite;
        }
        @keyframes loading{
            100% {
                background-position: 100% 100%;
            }
        }

        .button.secondary{
            color: var(--bg);
            background: transparent;
            outline-offset: -2px;
            outline: 2px solid var(--bg);
            transition: filter 0.2s ease;
        }
        .button.secondary:hover,
        .button.secondary:focus{
            box-shadow: none;
            filter: brightness(1.25);
        }
    `;render(){return s.dy`
            <button class="button ${this.loading?"loading":null} ${this.secondary?"secondary":null}" role="button" onclick="${this.btnOnclick}" ?disabled=${this.loading||this.disabled}>
                ${this.icon?s.dy`<wrd-icon class="icon" icon="${this.icon}">`:null}
                
                <slot></slot>
            </button>
        `}}customElements.define("wrd-button",r)},635:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={condition:{relect:!0},comparison:{relect:!0},value:{relect:!0}};_onUpdateValue(e){let t=this.renderRoot.querySelector(`[name="${e}"]`);if(!t)return;this[e]=t.value,this.requestUpdate();const i=new CustomEvent("wrd-condition-change",{bubbles:!0,cancelable:!0});this.dispatchEvent(i)}static styles=s.iv`
        :host{
            --border: #ADBAC2;

            --primary: #D204B0;
            --highlight: #FFEFFC;

            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        select,
        input{
            flex: 1;
            width: 100%;
            min-width: none;

            font-size: 1rem;
            font-family: inherit;
            font-weight: inherit;

            margin: none;
            padding: 0.5rem;

            background: none;
            border: none;
            
            border-bottom: 2px solid var(--border);
            border-radius: 2px;

            transition: border-bottom-color 0.2s ease;
        }
        select optgroup,
        select option{
            background: #fff;
        }

        select:focus,
        input:focus{
            outline: none;
            background: var(--highlight);
            border-bottom-color: var(--primary);
        }
    `;render(){let e=(t=window.popbot.conditions,i="category",r=[],t.forEach((e=>{let t=!1;r.forEach((s=>{s.label==e[i]&&(s.items.push(e),t=!0)})),t||r.push({label:e[i],items:[e]})})),r);var t,i,r,n,o;return s.dy`
            <select name="condition" @input="${()=>{this._onUpdateValue("condition")}}">
                ${n=e,o=this.condition,n.map((e=>s.dy`
            <optgroup label="${e.label}">
                ${e.items.map((e=>s.dy`<option value="${e.id}" ?selected=${o==e.id}>${e.label}</option>`))}
            </optgroup>
        `))}
            </select>

            <select name="comparison" @input="${()=>{this._onUpdateValue("comparison")}}">
                ${((e,t)=>e.map((e=>s.dy`<option value="${e.id}" ?selected=${t==e.id}>${e.label}</option>`)))(window.popbot.comparisons,this.comparison)}
            </select>

            <input name="value" @input="${()=>{this._onUpdateValue("value")}}" .value="${this.value}" placeholder="Value" />
        `}}customElements.define("wrd-condition",r)},255:(e,t,i)=>{"use strict";var s=i(392),r=i(803);class n extends r.I{static properties={value:{type:Array,reflect:!0}};static key="conditions";static defaultValue=[];connectedCallback(){super.connectedCallback(),this._onChangeHandler=this._onChange.bind(this),this.renderRoot.addEventListener("wrd-condition-change",this._onChangeHandler)}_onChange(e){let t=[];this.renderRoot.querySelectorAll("wrd-condition").forEach((e=>{t.push({condition:e.condition,comparison:e.comparison,value:e.value})})),this.value=t,this.requestUpdate()}remove(){this.value.pop(),this.requestUpdate()}add(){this.value=[...this.value,{condition:"",comparison:"",value:""}]}static styles=s.iv`
        .wrapper{
            padding: 1.5rem;
        }

        .info{
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: #586C77;

            margin: 0;
            margin-bottom: 2.5rem;
        }

        .info a{
            text-decoration: none;
            color: #D204B0;
        }

        wrd-condition{
            margin-bottom: 1.5rem;
        }

        .options{
            display: flex;
            justify-content: end;
        }
    `;render(){return s.dy`
            <wrd-panel id="panel" header="Manage Conditions">
                <div class="wrapper">
                    <p class="info">
                        The PopBot will display when the Trigger fires and all these conditions are met. <a href="#">Learn more about Conditions</a>.
                    </p>

                    ${this.value.map((e=>s.dy`<wrd-condition condition="${e.condition}" comparison="${e.comparison}" value="${e.value}"></wrd-condition>`))}

                    <wrd-icon class="remove" icon="remove" button @click=${this.remove}></wrd-icon>
        
                    <wrd-icon class="add" icon="add" button @click=${this.add}></wrd-icon>

                </div>

                <div slot="options" class="options">
                    <wrd-button id="button" @click=${this.save}>Save Changes</wrd-button>
                </div>
            </wrd-panel>
    `}}customElements.define("wrd-conditions-panel",n)},201:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static styles=s.iv`
        :host {
            display: block;
            box-sizing: border-box;
            width: 100%;
            margin-right: auto;
            margin-left: auto;
            padding-right: 1rem/* 16px */;
            padding-left: 1rem/* 16px */;
        }
        @media (min-width: 640px) {
            :host {
                max-width: 640px;
                padding-right: 1.5rem/* 24px */;
                padding-left: 1.5rem/* 24px */;
            }
        }
        @media (min-width: 768px) {
            :host {
                max-width: 768px;
            }
        }
        @media (min-width: 1024px) {
            :host {
                max-width: 1024px;
                padding-right: 2rem/* 32px */;
                padding-left: 2rem/* 32px */;
            }
        }
        @media (min-width: 1280px) {
            :host {
                max-width: 1280px;
                padding-right: 2.5rem/* 40px */;
                padding-left: 2.5rem/* 40px */;
            }
        }
        @media (min-width: 1536px) {
            :host {
                max-width: 1536px;
                padding-right: 4rem/* 64px */;
                padding-left: 4rem/* 64px */;
            }
        }
    `;render(){return s.dy`
                <slot></slot>
        `}}customElements.define("wrd-container",r)},966:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={_points:{state:!0,type:Array},event_type:{},date_start:{},date_end:{},post_id:{}};constructor(){super();var e=new Date,t=e.getFullYear(),i=e.getMonth()+1,s=new Date(t,i,0).getDate();this.event_type="shown",this.date_start=`${t}-${i}-01`,this.date_end=`${t}-${i}-${s}`,this.post_id=0,this._points=[]}connectedCallback(){super.connectedCallback(),this._getPoints()}get max(){return Math.max(...this._points.map((e=>e.count)))}get min(){return Math.min(...this._points.map((e=>e.count)))}get typeLabel(){return{shown:"Total Views",dismissed:"Dismissed",converted:"Conversions"}[this.event_type]??"-"}get dateLabel(){const e=new Date(this.date_start),t=new Date(this.date_end);return e.getFullYear()==t.getFullYear()?e.getMonth()==t.getMonth()?`${e.toLocaleString("default",{month:"long"})}, ${e.getFullYear()}`:`${e.toLocaleString("default",{month:"short"})} - ${t.toLocaleString("default",{month:"short"})}, ${e.getFullYear()}`:`${e.toLocaleString("default",{month:"short"})}, ${e.getFullYear()} - ${t.toLocaleString("default",{month:"short"})}, ${t.getFullYear()}`}async _getPoints(){const e=await window.popbot.manager.fetch.send("popbotGetAnalytics",{type:"plot",date_start:this.date_start,date_end:this.date_end,event_type:this.event_type,post_id:this.post_id});this._points=e.data,console.log(this._points),this._proccessPoints(),console.log(this._points)}_proccessPoints(){if(!this._points.length)return;let e=[],t=new Date(this.date_start),i=new Date(this.date_end);for(var s=t;s<=i;){let t=this._points.find((e=>{const t=new Date(e.day);return t.getFullYear()==s.getFullYear()&&t.getMonth()==s.getMonth()&&t.getDate()==s.getDate()}));e.push({count:t?.count??0,day:new Date(s)}),s=new Date(s.setDate(s.getDate()+1))}this._points=e}static styles=s.iv`
        .labels{
            text-align: right;
        }

        .title{
            color: #0f172a;
            font-weight: 500;
            font-size: 1.1rem;

            margin: 0;
            padding: 0;
            margin-bottom: -0.25rem;
        }

        .subtitle{
            color: #475569;
            font-weight: 300;
            font-size: 0.85rem;
        }

        .graph{
            display: grid;
            grid-auto-flow: column;

            height: 30vh;
            padding-bottom: 2rem;
        }

        .point{
            height: 100%;
            max-width: 3ch;

            position: relative;
        }

        .bar{
            background: #C60295;
            border: 1px solid white;
            border-radius: 0.4rem;

            min-height: 0.25rem;

            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .bar.empty{
            background: #cbd5e1;
        }

        .date{
            display: none;

            position: absolute;
            top: calc(100% + 0.5rem);
            left: 0;
            right: 0;
            width: 100%;

            text-align: center;
            font-size: 0.75rem;
            color: #94a3b8;
        }

        @media (min-width: 992px){
            .date{
                display: block;
            }
        }
    `;render(){return s.dy`
            <div class="container">
                <div class="labels">
                    <h3 class="title">${this.typeLabel}</h3>
                    <span class="subtitle">${this.dateLabel}</span>
                </div>

                <div class="graph">
                    ${function*(e,t){if(void 0!==e){let i=0;for(const s of e)yield t(s,i++)}}(this._points,(e=>s.dy`
                        <div class="point">
                            <div class="bar ${0==e.count?"empty":"not-empty"}" title="${e.count}" style="height: ${(e.count-this.min)/(this.max-this.min)*100}%"></div>
                            
                            <div class="date">
                                ${this._points.length<32?e.day.getDate():null}
                            </div>
                        </div>
                    `))}
                </div>
            </div>
        `}}customElements.define("wrd-graph",r)},827:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={back:{type:Boolean},label:{}};static styles=s.iv`
        .header{
            position: sticky;
            top: 32px;
            z-index: 10;

            height: 85px;

            background: white;
            box-shadow: 0 10px 15px -3px rgb(254 206 246 / 0.3), 0 4px 6px -4px rgb(254 206 246 / 0.3);
        }

        .container{
            display: flex;
            align-items: center;
            gap: 1.5rem;
            height: 100%;
        }

        .title{
            font-size: 1.25rem;
            line-height: 1.75rem;
            font-weight: 500;
            color: rgb(15 23 42);
        }

        .slot{
            margin-left: auto;
        }
    `;render(){return s.dy`
            <header class="header">
                <wrd-container class="container">
                        
                        ${this.back?s.dy`
                            <a href="${window.popbot.wp.plugin_home_url}">
                                <wrd-icon icon="arrow_back" button></wrd-icon>
                            </a>`:null}
                
                        <h1 class="title">
                            <slot name="title"></slot>
                            ${this.label}
                        </h1>

                        <div class="slot">
                            <slot></slot>
                        </div>
                        
                </wrd-container>
            </header>
        `}}customElements.define("wrd-header",r)},762:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={label:{},icon:{},button:{type:Boolean}};constructor(){super(),this.label="",this.icon="done",this.button=!1}static styles=s.iv`
        :host{
            --fill: black;
            --text: black;
            --bg: transparent;
            --size: 48px;

            display: inline-block;
        }

        :host([tabindex]){
            cursor: pointer;
        }

        .container{
            display: flex;
            align-items: center;
            justify-content: start;
            gap: 0.5rem;

            background: none;
            padding: 0;
            margin: 0;
            border: 0;

            transition: all 0.2s ease;
        }

        button.container{
            cursor: pointer;
        }
        button.container:focus-visible{
            outline: none;
        }

        .icon{
            display: flex;
            align-items: center;
            justify-content: center;

            width: var(--size);
            height: var(--size);

            border-radius: 20rem;

            background: var(--bg);
            color: var(--fill);

            box-shadow: inset 0 0 0 0px rgba(0, 0, 0, 0);
            transition: all 0.2s ease;

            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            font-size: calc(var(--size) / 2);  /* Preferred icon size */
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;

            /* Support for all WebKit browsers. */
            -webkit-font-smoothing: antialiased;
            /* Support for Safari and Chrome. */
            text-rendering: optimizeLegibility;

            /* Support for Firefox. */
            -moz-osx-font-smoothing: grayscale;

            /* Support for IE. */
            font-feature-settings: 'liga';
        }

        button.container:hover .icon,
        button.container:focus .icon{
            box-shadow: inset 0 0 0 calc(var(--size) / 2) rgba(0, 0, 0, 0.1);
        }

        .label{
            color: var(--text);
        }
    `;render(){return this.button?s.dy`
                <button class="container">

                    <div class="icon">
                        ${this.icon}
                    </div>

                    ${this.label?s.dy`
                            <div class="label">
                                ${this.label}
                            </div>
                            `:null}
                </button>
            `:s.dy`
                <div class="container">

                    <div class="icon">
                        ${this.icon}
                    </div>

                    ${this.label?s.dy`
                            <div class="label">
                                ${this.label}
                            </div>
                            `:null}
                </div>
            `}}customElements.define("wrd-icon",r)},955:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={value:{type:String,reflect:!0},key:{},saving:{state:!0}};firstUpdated(){super.firstUpdated(),this.resize()}focus(){this.renderRoot?.querySelector("#input").focus()}async save(){this.saving=!0;var e=new FormData;e.append("action","inlineSave"),e.append("post_id",window.popbot.wp.post_id),e.append("nonce",window.popbot.fetch.nonce),e.append("key",this.key),e.append("value",this.value);const t=await fetch(window.popbot.fetch.ajax_url,{method:"POST",body:e});this.saving=!1;try{const e=await t.json();t.ok&&e.success?WRDToast("Saved."):WRDToast("An error occured.")}catch(e){WRDToast("An error occured.")}}_onBlur(e){this.save()}_onInput(e){this.value=e.target.value,this.resize()}_onFocus(e){this.resize()}resize(){this.renderRoot.querySelector(".input").style.width=this.value.length+"ch"}static styles=s.iv`
        :host{
            display: block;
            width: fit-content;
        }

        .container{
            display: flex;
            align-items: center;
            gap: 0.5rem;

            border-bottom: 2px solid transparent;
            border-radius: 2px;

            padding: 0.25rem 0.5rem;
            margin-left: -0.5rem;
        }

        .container:focus-within{
            border-bottom: 2px solid #cbd5e1;
        }

        .input{
            border: none;
            padding: 0px;
            margin: 0px;

            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: inherit;
        }
        .input:focus,
        .input:focus-visible{
            outline: none;
        }

        .spinner {
            width: 0.75rem;
            height: 0.75rem;

            border-radius: 50%;
            border: 0.15rem solid #64748b;
            border-color: #64748b #64748b #64748b transparent;

            animation: spinner 1.2s linear infinite;
            transition: opacity 0.2s ease;
        }
        
        .spinner[data-hidden]{
            opacity: 0;
        }

        @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
        }
        
    `;render(){return s.dy`
            <div class="container">
                <input id="input" class="input" @blur="${this._onBlur}" @focus="${this._onFocus}" @input="${this._onInput}" .value="${this.value||""}"/>
                <div class="spinner" ?data-hidden="${!this.saving}"></div>
            </div>
        `}}customElements.define("wrd-inline-editable",r)},8:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={label:{},required:{type:Boolean},range:{},hideErrors:{type:Boolean,attribute:"hide-errors"},_value:{reflect:!0,attribute:"value"},_type:{attribute:"type"},_name:{attribute:"name"}};static formAssociated=!0;constructor(){super(),this._internals=this.attachInternals(),this._value="",this.addEventListener("focus",(e=>{this._onFocus()})),this.addEventListener("invalid",(e=>{e.preventDefault(),this._container.animate([{outline:"0px solid #fecdd3",borderColor:"#ADBAC2"},{offset:.2,borderColor:"#f43f5e"},{outline:"0.75rem solid transparent",borderColor:"#ADBAC2"}],300)}))}firstUpdated(){this._onInput(),this.setAttribute("tabindex",0)}get value(){return"string"==typeof this._value?this._value.trim():String(this._value).trim()}set value(e){this._value=e}get form(){return this._internals.form}get name(){return this._name}get type(){return this._type}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}get _input(){return this.renderRoot?.querySelector("#input")}get _container(){return this.renderRoot?.querySelector(".container")}_checkValidity(){return this._input.willValidate?this.required&&this._value.length<1?(this._internals.setValidity({customError:!0},"This field is required."),!1):(this._internals.setValidity({}),!0):(this._internals.setValidity({customError:!0},this._input.validationMessage),!1)}_onInput(){this._value=this._input.value;const e=new CustomEvent("wrd-input-input",{bubbles:!0,cancelable:!1,detail:{input:this._input,value:this._input.value}});this.dispatchEvent(e),this._internals.setFormValue(this._value),this._checkValidity()}_onChange(){const e=new CustomEvent("wrd-input-change",{bubbles:!0,cancelable:!1,detail:{input:this._input,value:this._input.value}});this.dispatchEvent(e)}_onFocus(){this._input.focus()}static styles=s.iv`
        .container{
            position: relative;

            display: flex;
            flex-direction: column-reverse;

            border: 1px solid #ADBAC2;
            border-radius: 0.2rem;

            background: #fff;

            outline: 0px solid transparent;
            transition: outline 0.2s ease;

            cursor: text;
        }
        .container:focus-within{
            border-color: #D204B0;
            outline: 0.35rem solid #FECEF6;
        }

        .input{
            border: none;
            padding: 0px;
            margin: 0px;
            background: none;

            color: #0E2533;
            font-size: 1rem;
            font-weight: 400;
            font-family: inherit;

            padding: 0.5rem 0.75rem;
        }
        .input::placeholder{
            color: transparent;
        }
        .input:focus{
            outline: none;
        }

        .label{
            font-size: 0.9rem;
            font-weight: 400;

            /* Shrunk */
            color: #7E8E97;
            transform-origin: top left;
            transform: translate(0, -1.2rem) scale(0.75);
            transition: transform 0.2s ease, color 0.2s ease;
            background: #fff;

            padding: 0rem 0.5rem;

            position: absolute;
            top: 0.6rem;
            left: 0.25rem;
        }

        .container:focus-within .label{
            color: #D204B0;
        }

        .input:placeholder-shown:not(:focus) + .label{
            /* Full Size */
            color: #0E2533;
            transform: translate(0, 0) scale(1);
        }

        .error{
            color: red;
            font-weight: 500;
            font-size: 0.9rem;

            min-height: 1.35rem;

            margin-top: 0.5rem;
        }
    `;render(){return s.dy`
            <label class="container">
                <input id="input" class="input" type="${this.type}" name="${this.name}" value="${this.value}" placeholder="${this.label}" @input=${this._onInput} @change=${this._onChange} />

                <div class="label">${this.label}</div>
            </label>

            ${this.hideErrors?null:s.dy`<div class="error">${this.validationMessage}</div>`}
        `}}customElements.define("wrd-input",r)},216:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={header:{},accept:{attribute:"accept"},reject:{attribute:"reject"}};constructor(){super()}hide(){setTimeout((()=>{this.remove()}),300),this.renderRoot.querySelector(".backdrop").classList.add("out")}_onAccept(){this.hide();const e=new CustomEvent("wrd-modal-accept");this.dispatchEvent(e)}_onReject(){this.hide();const e=new CustomEvent("wrd-modal-reject");this.dispatchEvent(e)}static styles=s.iv`
        .backdrop{
            position: fixed;
            inset: 0;
            z-index: 999999;

            background: rgba(0,0,0,0.4);

            animation: fadeIn 300ms ease;
        }

        .modal{
            background: #fff;
            border-radius: 0.25rem;

            overflow: auto;

            width: 80vw;
            max-width: 45ch;

            padding: 1.5rem;

            margin: 10vh auto 0;

            animation: dropIn 300ms ease;
        }

        .backdrop.out{
            animation: fadeOut 300ms ease forwards;
        }
        .backdrop.out .modal{
            animation: dropOut 300ms ease forwards;
        }

        .title{
            font-size: 1.5rem;
            font-family: inherit;
            color: inherit;
            font-weight: 500;

            margin-top: 0;
            margin-bottom: 1rem;
        }

        .buttons{
            margin-top: 2rem;

            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .accept{
            --bg: #10b981;
            --outline: #d1fae5;
        }

        .reject{
            --bg: #f43f5e;
            --outline: #ffe4e6;
        }

        @keyframes fadeIn{
            0%{
                background: rgba(0,0,0,0);
            }
            100%{
                background: rgba(0,0,0,0.4);
            }
        }

        @keyframes dropIn{
            0%{
                opacity: 0;
                transform: translateY(-1rem);
            }
        }

        @keyframes fadeOut{
            0%{
                background: rgba(0,0,0,0.4);
            }
            100%{
                background: rgba(0,0,0,0);
            }
        }

        @keyframes dropOut{
            100%{
                opacity: 0;
                transform: translateY(-1rem);
            }
        }
    `;render(){return s.dy`
            
            <div class="backdrop">
                <div class="modal">
                    <h2 class="title">
                        ${this.header}
                    </h2>

                    <slot></slot>

                    <div class="buttons">
                        <wrd-button @click=${this._onAccept} class="accept">${this.accept}</wrd-button>

                        <wrd-button @click=${this._onReject} class="reject">${this.reject}</wrd-button>
                    </div>
                </div>
            </div>
        `}}window.WRDModal=async function(e,t="",i="Accept",s="Cancel"){const r=document.createElement("wrd-modal");return r.setAttribute("header",e),r.setAttribute("accept",i),r.setAttribute("reject",s),r.append(t),document.getElementById("wpcontent").append(r),new Promise(((e,t)=>{r.addEventListener("wrd-modal-accept",(function(){e()})),r.addEventListener("wrd-modal-reject",(function(){t("User rejected")}))}))},customElements.define("wrd-modal",r)},391:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={value:{},name:{},label:{},_loading:{state:!0}};constructor(){super(),this._loading=!1}_onChange(e){this._loading=!0,setTimeout((()=>{this._loading=!1,this.renderRoot.querySelector(".spinner").succeed()}),1e3)}async save(){}static styles=s.iv`
        .container{
            display: flex;
            align-items: start;
            gap: 1rem;
        }
    `;render(){return s.dy`
            <div class="container">
                <wrd-input id="input" label="${this.label}" name="${this.name}" .value="${this.value||""}" @wrd-input-change="${this._onChange}"></wrd-input>

                <wrd-spinner class="spinner" ?active="${this._loading}"></wrd-spinner>
            </div>
        `}}customElements.define("wrd-option",r)},414:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={header:{},button:{},open:{type:Boolean,reflect:!0}};constructor(){super(),this.header="Panel",this.button="Save Changes",this.open=!1,window.addEventListener("keydown",(e=>{"Escape"==e.key&&this.open&&!this.getOpenChildPanels().length&&this.closePanel()}))}closePanel(){const e=new CustomEvent("wrd-panel-close",{bubbles:!0,cancelable:!0});this.dispatchEvent(e),e.defaultPrevented||(this.open=!1,document.body.style.overflowY="auto")}openPanel(){const e=new CustomEvent("wrd-panel-open",{bubbles:!0,cancelable:!0});this.dispatchEvent(e),e.defaultPrevented||(this.open=!0,document.body.style.overflowY="hidden")}togglePanel(){this.open?this.closePanel():this.openPanel()}getChildren(){return this.shadowRoot.querySelector("slot").assignedElements()}getChildPanels(){return this.getChildren().filter((e=>e.matches("wrd-panel")))}getOpenChildPanels(){return this.getChildren().filter((e=>e.matches("wrd-panel[open]")))}static styles=s.iv`
        :host{
            --width: min(35rem, 95vw);
        }

        .container{
            position: fixed;
            inset: 0;
            height: 100%;
            z-index: 999999;
        }

        .container[inert]{
            pointer-events: none;
        }

        .backdrop{
            border: none;
            background: none;

            display: block;
            margin: 0;
            padding: 0;

            opacity: 1;

            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            background: rgba(0, 0, 0, 0.6);
            transition: opacity 0.5s ease;
        }

        .container[inert] .backdrop{
            opacity: 0;
        }

        .panel{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;

            width: var(--width);
            height: 100%;

            background: #fff;

            display: grid;
            grid-template-rows: auto 1fr auto;

            transition: transform 0.5s ease;
        }

        .container[inert] .panel{
            transform: translateX(var(--width));
        }

        .header{
            padding: 0.75rem 1.5rem;

            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .title{
            font-size: 1.3rem;
            font-weight: bold;
            margin: 0;
        }

        .main{
            border: 1px solid #E4EBEF;
            border-left: none;
            border-right: none;

            overflow-y: auto;
        }

        .footer{
            padding: 1.5rem;
        }

        .submit{
            grid-column: 2;
        }
    `;render(){return s.dy`
            <div class="container" ?inert=${!this.open}>

                <div class="backdrop" @click="${this.closePanel}" >
                </div>

                <aside class="panel">
                    <header class="header">
                        <wrd-icon class="close" icon="close" button @click="${this.closePanel}"></wrd-icon>

                        <h2 class="title">
                            ${this.header}
                        </h2>
                    </header>

                    <main class="main">
                        <slot id="childrenSlot"></slot>
                    </main>

                    <footer class="footer">
                        <slot id="optionsSlot" name="options"></slot>
                    </footer >
                </aside >
            </div >
    `}}customElements.define("wrd-panel",r),document.addEventListener("click",(e=>{if(e.target.matches("[data-panel]")){let t=e.target.dataset.panel,i=document.querySelector(t);i&&void 0!==typeof i.togglePanel&&i.togglePanel()}}))},858:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={count:{state:!0},for:{},type:{},label:{}};constructor(){super(),this._hide=!1}connectedCallback(){super.connectedCallback(),this._updateLabels(),document.getElementById(this.for).addEventListener("wrd-panel-interface-saved",(e=>{this._updateLabels()}))}_updateLabels(){let e=document.getElementById(this.for).value;if(this.icon=e.length,this.color="#FECEF6","text"==this.type&&(this.color="#D204B0",this.icon="dashboard",this.label=e),"trigger"==this.type){let t=e.trigger,i=window.popbot.triggers.find((e=>e.id==t));i?(this.icon=i.icon,this.color=i.color,this.label=i.label):(this.icon="block",this.color="#ec4899",this.label="No trigger selected")}this.requestUpdate()}static styles=s.iv`
        :host{
            display: inline-block;
        }

        .container{
            display: flex;
            align-items: center;
            justify-content: start;
            gap: 1rem;
            padding-right: 1rem;

            color: #0f172a;
            font-weight: 500;
            font-size: 0.9rem;

            border-radius: 20rem;
            background: #f1f5f9;
        }

        .icon{
            --size: 42px;

            display: flex;
            align-items: center;
            justify-content: center;

            width: var(--size);
            height: var(--size);

            border-radius: inherit;
        }

        .icon.number{
            color: #8E0076;
            font-size: 1.2rem;
        }

        .icon.icon-font{
            color: white;

            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;

            /* Support for all WebKit browsers. */
            -webkit-font-smoothing: antialiased;
            /* Support for Safari and Chrome. */
            text-rendering: optimizeLegibility;

            /* Support for Firefox. */
            -moz-osx-font-smoothing: grayscale;

            /* Support for IE. */
            font-feature-settings: 'liga';
        }
    `;render(){return s.dy`
        <div class="container">
            <div class="icon ${Number.isInteger(this.icon)?"number":"icon-font"}" style="background: ${this.color}">
                ${this.icon}
            </div>
            ${this.label}
        </div>
            `}}customElements.define("wrd-panel-indicator",r)},803:(e,t,i)=>{"use strict";i.d(t,{I:()=>r});var s=i(392);class r extends s.oi{static properties={value:{type:Object,reflect:!0}};static key=void 0;static defaultValue={};constructor(){super(),this.value=this.constructor.defaultValue}connectedCallback(){super.connectedCallback(),this.value||(this.value=this.constructor.defaultValue)}createRenderRoot(){const e=super.createRenderRoot();return e.addEventListener("wrd-panel-open",(e=>this._onOpen(e))),e.addEventListener("wrd-panel-close",(e=>this._onClose(e))),e}openPanel(){this.renderRoot.querySelector("#panel").openPanel()}closePanel(){this.renderRoot.querySelector("#panel").closePanel()}togglePanel(){this.renderRoot.querySelector("#panel").togglePanel()}_hasChanges(){return!((e,t)=>{if(Object.is(e,t))return!0;if(typeof e!=typeof t)return!1;var i=Object.keys(e),s=Object.keys(t);if(i.length!==s.length)return!1;for(var r=0;r<i.length;r++)if(!Object.prototype.hasOwnProperty.call(t,i[r])||!Object.is(e[i[r]],t[i[r]]))return!1;return!0})(this._savedState,this.value)}_onOpen(e){this._saveState()}_onClose(e){this._hasChanges()&&(e.preventDefault(),WRDModal("You have unsaved changes!","Leaving now will revert all the changes you've made. Are you sure you don't want to save?","Go Back","Discard Changes").then((()=>{}),(()=>{this.discard(),this.closePanel()})))}_saveState(){Array.isArray(this.value)?this._savedState=Object.assign([],this.value):"string"==typeof this.value?this._savedState=(" "+this.value).slice(1):this._savedState=Object.assign({},this.value)}_restoreState(){this._savedState&&(this.value=this._savedState,this.requestUpdate())}discard(){this._restoreState()}async save(){let e=this.renderRoot.querySelector("#button");e&&(e.loading=!0);var t=new FormData;t.append("action","panelSave"),t.append("post_id",window.popbot.wp.post_id),t.append("nonce",window.popbot.fetch.nonce),t.append("key",this.constructor.key),"object"==typeof this.value?t.append("value",JSON.stringify(this.value)):t.append("value",this.value);const i=await fetch(window.popbot.fetch.ajax_url,{method:"POST",body:t});try{const e=await i.json();if(i.ok&&e.success){this._saveState();const e=new CustomEvent("wrd-panel-interface-saved",{bubbles:!0,cancelable:!0});this.dispatchEvent(e)}i.ok||(console.error("Fetch connection failed."),WRDToast("A connection could not be established to the server.")),e.data.message&&WRDToast(e.data.message)}catch(e){console.error("Fetch connection returned malformed response."),WRDToast("A connection could not be established to the server.")}e&&(e.loading=!1)}}},446:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={part:{},name:{},scale:{type:Number}};constructor(){super(),this.scale=.5,this.name="",this.part=""}static styles=s.iv`
        :host{
            --bg: #f1f5f9;
            --text: #0f172a;

            display: block;
        }

        *{
            box-sizing: border-box;
        }

        .container{

        }

        

        .iframe-wrapper{
            padding: 1rem;
            margin-bottom: 0.5rem;
            
            background: var(--bg);
            border-radius: 0.5rem;

            transition: background 0.2s ease;
        }

        iframe{
            pointer-events: none;
            
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                supported by Chrome, Edge, Opera and Firefox */


            width: 100%;
            height: 100%;

            border: none;
            margin: 0;
            padding: 0;
        }

        .name{
            font-size: 1rem;
            font-weight: 500;
            color: var(--text);

            margin: 0;

            transition: color 0.2s ease;
        }


        :host(.selected){
            --bg: #FECEF6;
            --text: #AF0092;
        }
    `;render(){return s.dy`
            <div class="container">
                <div class="iframe-wrapper">
                    <iframe loading="lazy" src="${`${window.popbot.wp.home_url}/popBotPreview?part=${this.part}&scale=${this.scale}`}"></iframe>
                </div>

                <h3 class="name">${this.name}</h3>
            </div>
        `}}customElements.define("wrd-part-preview",r)},528:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static styles=s.iv`
        .scroller{
            position: absolute;
            right: 0;
            left: 0;

            overflow-x: auto;

            padding-left: var(--container-distance);
            padding-bottom: 1rem;
        }

        .grid{
            display: grid;
            grid-auto-flow: column;
            grid-template-rows: 1fr;
            grid-template-columns: repeat(20rem, auto);
            gap: 1rem;
        }
        .grid::after {
            content: "";
            display: block;
            width: 2rem;
            height: 1px;
        }

        ::-webkit-scrollbar {
            height: 0.5em;
        }
        ::-webkit-scrollbar-track {
            background: none;
        }
        ::-webkit-scrollbar-thumb {
            background-color: rgb(71, 85, 105, 0.2);
            border-radius: 100vw;
            transition: background-color 0.2s ease;
        }
        ::-webkit-scrollbar-thumb:hover{
            background-color: rgb(210, 4, 176, 0.2);
        }
        ::-webkit-scrollbar-thumb:active{
            background-color: #D204B0;
        }

        .spacer{
            pointer-events: none;
        }

        .scroller {
            --container-width: 100%;
            --container-padding: 1rem;
            --padding-left: 2rem;
            /* (Half of the page width - container width) plus padding */
            --container-distance: calc(  ((100% - var(--container-width)) / 2) + var(--container-padding) + var(--padding-left) );
        }
        @media (min-width: 640px) {
            .scroller {
                --container-width: 640px;
                --container-padding: 1.5rem;
            }
        }
        @media (min-width: 768px) {
            .scroller {
                --container-width: 768px;
            }
        }
        @media (min-width: 1024px) {
            .scroller {
                --container-width: 1024px;
                --container-padding: 2rem;
            }
        }
        @media (min-width: 1280px) {
            .scroller {
                --container-width: 1280px;
                --container-padding: 2.5rem;
            }
        }
        @media (min-width: 1536px) {
            .scroller {
                --container-width: 1536px;
                --container-padding: 4rem;
            }
        }
    `;constructor(){super(),window.addEventListener("resize",this._onResize)}updated(){this._onResize()}_onResize(e){let t=this.renderRoot.querySelector(".spacer"),i=this.renderRoot.querySelector(".scroller");t.style.height=i.offsetHeight+"px"}render(){return s.dy`
            <div class="scroller">
                <div class="grid">
                    <slot @slotchange="${this._onResize}"></slot>
                </div>
            </div>

            <div class="spacer"></div>
        `}}customElements.define("wrd-scroller",r)},891:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={max:{type:Number},selected:{type:Array,reflect:!0},header:{}};constructor(){super(),this.header="",this.selected=[],this.max=-1,this.addEventListener("click",(e=>{e.target.hasAttribute("key")&&this.toggleKey(e.target.getAttribute("key"))}))}get _slottedChildren(){const e=this.shadowRoot.querySelector("slot").assignedNodes({flatten:!0});return Array.prototype.filter.call(e,(e=>e.nodeType==Node.ELEMENT_NODE))}updated(){this._slottedChildren.forEach((e=>{e.hasAttribute("key")&&e.classList.toggle("selected",this.selected.includes(e.getAttribute("key")))}))}openPanel(){this.renderRoot.querySelector("#panel").openPanel()}closePanel(){this.renderRoot.querySelector("#panel").closePanel()}togglePanel(){this.renderRoot.querySelector("#panel").togglePanel()}toggleKey(e){this.selected.includes(e)?this.removeKey(e):this.addKey(e)}addKey(e){this.selected=[...this.selected,e],this.max>0&&this.selected.length>this.max&&(this.selected.shift(),this.requestUpdate())}removeKey(e){this.selected=this.selected.filter((function(t){return t!=e}))}_onClose(){const e=new CustomEvent("wrd-select-panel-cancel",{detail:{selected:this.selected,element:this}});this.dispatchEvent(e)}confirm(){const e=new CustomEvent("wrd-select-panel-confirm",{detail:{selected:this.selected,element:this}});this.dispatchEvent(e),this.closePanel()}static styles=s.iv`
        :host{
            background: red;
        }

        #slot{
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 1.5rem;
            padding: 1.5rem;
        }

        ::slotted(*){
            cursor: pointer;
        }

        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            gap: 1rem;
        }
        
        .counter{
            font-weight: 500;
            color: #64748b;
        }
    `;render(){return s.dy`
            <wrd-panel id="panel" header="${this.header}" @wrd-panel-close="${this._onClose}">

                <slot id="slot"></slot>

                <div slot="options" class="options">
                    <span class="counter">${this.selected.length} Selected</span>
                    <wrd-button id="button" @click=${this.confirm}>Confirm Changes</wrd-button>
                </div>
            </wrd-panel>
        `}}window.WRDSelectPanelChoose=async function(e){return e.openPanel(),new Promise(((t,i)=>{e.addEventListener("wrd-select-panel-confirm",(function(){t(e.selected)})),e.addEventListener("wrd-select-panel-cancel",(function(){i("close")}))}))},customElements.define("wrd-select-panel",r)},979:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={active:{type:Boolean}};succeed(){this.renderRoot.querySelector(".success").animate([{opacity:0},{opacity:1},{opacity:0}],{duration:1500,iterations:1})}fail(){this.renderRoot.querySelector(".fail").animate([{opacity:0},{opacity:1},{opacity:0}],{duration:1500,iterations:1})}static styles=s.iv`
        :host{
            --size: 1.25rem;
            --color: #64748b;

            position: relative;
        }

        .spinner {
            width: var(--size);
            height: var(--size);

            border-radius: 50%;
            border: calc(var(--size) / 5) solid var(--color);
            border-color: var(--color) var(--color) var(--color) transparent;

            animation: spinner 1.2s linear infinite;
            transition: opacity 0.2s ease;
        }
        
        .spinner.inactive{
            opacity: 0;
        }

        @keyframes spinner {
            0% {
            transform: rotate(0deg);
            }
            100% {
            transform: rotate(360deg);
            }
        }

        .fail{
            position: absolute;
            top: 10%;
            left: -20%;

            width: var(--size);
            height: var(--size);

            opacity: 0;
        }
        .fail::after,
        .fail::before{
            content: '';

            display: block;
            position: absolute;

            width: var(--size);
            height: calc(var(--size) / 5);

            background: #f43f5e;
        }
        .fail::before{
            top: 50%;
            left: 50%;
            transform: rotate(45deg);
        }
        .fail::after{
            top: 50%;
            left: 50%;
            transform: rotate(-45deg);
        }

        .success{
            position: absolute;
            top: 10%;
            left: -20%;

            width: var(--size);
            height: var(--size);

            opacity: 0;
        }
        .success::after,
        .success::before{
            content: '';

            display: block;
            position: absolute;
            height: calc(var(--size) / 5);

            background: #10b981;
        }
        .success::before{
            top: 50%;
            left: 65%;
            transform: rotate(-45deg);

            width: var(--size);
        }
        .success::after{
            top: 60%;
            left: 50%;
            transform: rotate(45deg);

            width: calc(var(--size) / 3);
        }
    `;render(){return s.dy`
            <div class="spinner ${this.active?"active":"inactive"}"></div>

            <div class="success"></div>
            <div class="fail"></div>
        `}}customElements.define("wrd-spinner",r)},568:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={value:{type:Number},previous:{type:Number},date:{type:String}};constructor(){super();let e=new Date;this.date=e.toLocaleString("default",{month:"long",year:"numeric"}),this.value=0,this.previous=0}format(e){return(e=Math.round(10*e)/10).toLocaleString()}get _change(){let e=this.previous,t=this.value;if(0==e)return"-";let i=100*Math.abs((e-t)/((e+t)/2));return i=Math.round(10*i)/10,i}get _changedClass(){return 0==this.previous?"flat":this.value>this.previous?"increased":"decreased"}static styles=s.iv`
        .title{
            color: #0f172a;
            font-weight: 500;
            font-size: 1.25rem;

            margin: 0;
            padding: 0;
        }

        .subtitle{
            color: #475569;
            font-weight: 300;
            font-size: 1rem;

            margin-bottom: 0.5rem;
        }

        .value{
            color: #C60295;
            font-size: 3rem;
            font-weight: 500;
        }

        .change{
            --color: #059669;

            color: var(--color);
            font-size: 0.9rem;
            font-weight: 500;

            display: flex;
            align-items: center;
            gap: 0.5rem;

            margin-top: -0.5rem;
        }
        .change::before{
            --width: 0.4rem;

            content: '';
            display: block;

            width: 0; 
            height: 0; 
            border-left: var(--width) solid transparent;
            border-right: var(--width) solid transparent;
            
            border-bottom: var(--width) solid var(--color);
        }

        .change.flat{
            color: #94a3b8;
        }
        .change.flat::before{
            content: none;
        }

        .change.decreased{
            --color: #e11d48;
        }
        .change.decreased::before{
            border-bottom: none;
            border-top: var(--width) solid var(--color);
        }

    `;render(){return s.dy`
            <div class="container">
                <h3 class="title">
                    <slot></slot>
                </h3>

                <div class="subtitle">${this.date}</div>

                <div class="stat">
                    <span class="value">${this.format(this.value)}</span>

                    <div class="change ${this._changedClass}">${this._change}</div>
                </div>
            </div>
        `}}customElements.define("wrd-statistic",r)},618:(e,t,i)=>{"use strict";var s=i(392),r=i(830),n=i(803);class o extends n.I{static properties={value:{type:Object,reflect:!0},settings:{state:!0,type:Array},_loading:{state:!0,type:Boolean}};static key="template_settings";static defaultValue={};constructor(){super(),this.settings=[],this._getCurrentSettings(!0)}createRenderRoot(){const e=super.createRenderRoot();return e.addEventListener("wrd-input-change",(e=>this._onChange())),e}openPanel(){super.openPanel(),this._getCurrentSettings()}_onChange(){let e={},t=this.renderRoot.querySelector("#form").elements;for(let i of t)e[i.name]=i.value;this.value=e,this.requestUpdate("value")}_getValue(e){return this.value.hasOwnProperty(e.name)?this.value[e.name]:e.default??""}async _getCurrentSettings(e=!1){var t=new FormData;this._loading=!0,t.append("action","templateSettings"),t.append("post_id",window.popbot.wp.post_id),t.append("nonce",window.popbot.fetch.nonce);const i=await fetch(window.popbot.fetch.ajax_url,{method:"POST",body:t});try{const t=await i.json();i.ok&&t.success&&(this.settings=t.data.settings,e&&(this.value={...t.data.values}))}catch(e){console.error(e)}this._loading=!1}static styles=s.iv`
        .wrapper{
            position: relative;
            padding: 1.5rem;
        }

        .wrapper.loading{
            background: red;
        }

        .options{
            display: flex;
            justify-content: end;
        }

        .loading{
            position: absolute;
            inset: 0;

            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            justify-content: center;

            font-size: 0.8rem;
            color: #64748b;

            background: rgba(255, 255, 255, 0.75);

            pointer-events: none;
            transition: opacity 0.2s ease;
        }

        .spinner {
            width: 2.5rem;
            height: 2.5rem;

            border-radius: 50%;
            border: 0.2rem solid currentColor;
            border-color: currentColor currentColor currentColor transparent;

            animation: spinner 1.2s linear infinite;
            transition: opacity 0.4s ease;
        }

        @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
        }

        .loading[hidden]{
            opacity: 0;
        }
    `;render(){return s.dy`
            <wrd-panel id="panel" header="Template Settings">
                <form id="form" class="wrapper">
                    
                    ${(0,r.r)(this.settings,(e=>s.dy`<wrd-input type="${e.type}" name="${e.name}" value="${this._getValue(e)}" label="${e.label??e.name}"></wrd-input>`))}

        <div class="loading" ?hidden="${!this._loading}">
                        <div class="spinner"></div>
                        Loading...
                    </div>
                
                </form>

                <div slot="options" class="options">
                    <wrd-button id="button" @click=${this.save}>Save Changes</wrd-button>
                </div>
            </wrd-panel>
    `}}customElements.define("wrd-template-settings-panel",o)},470:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{constructor(){super(),setTimeout((()=>{this.hide()}),3e3)}hide(){setTimeout((()=>{this.remove()}),300),this.renderRoot.querySelector(".toast").classList.add("out")}static styles=s.iv`
        .toast{
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            z-index: 9999995;

            background: #354955;
            border-radius: 0.2rem;

            padding: 0.5rem 1rem;

            color: white;
            font-family: inherit;
            font-size: 1rem;
            font-weight: inherit;

            box-shadow:
                1.8px 1.8px 10px rgba(0, 0, 0, 0.03),
                14px 14px 80px rgba(0, 0, 0, 0.06)
            ;

            animation: in 300ms ease;
        }

        .toast.out{
            animation: out 300ms ease forwards;
        }

        @keyframes in{
            0%{
                opacity: 0;
                transform: translateY(10%);
            }
            100%{
                opacity: 1;
                transform: translateY(0%);
            }
        }

        @keyframes out{
            0%{
                opacity: 1;
                transform: translateY(0%);
            }
            100%{
                opacity: 0;
                transform: translateY(10%);
            }
        }
    `;render(){return s.dy`
            <div class="toast">
                <slot></slot>
            </div>
        `}}window.WRDToast=function(e=""){const t=document.createElement("wrd-toast");return t.append(e),document.getElementById("wpcontent").append(t),t},customElements.define("wrd-toast",r)},437:(e,t,i)=>{"use strict";var s=i(392),r=i(830),n=i(803);class o extends n.I{static key="trigger";static defaultValue={trigger:null,threshold:null};firstUpdated(){this.renderRoot.querySelector(".options").addEventListener("wrd-input-change",(e=>{this.value={...this.value,threshold:e.detail.value}}))}_getTrigger(e){for(let t of window.popbot.triggers)if(t.id==e)return t;return!1}get trigger(){return this._getTrigger(this.value.trigger)}set trigger(e){let t=this._getTrigger(e);if(!t)return!1;let i=t.options?.[0];this.value={trigger:t.id,threshold:i?.default??""}}get threshold(){return this.value.threshold}set threshold(e){this.value={...this.value,threshold:e},this.requestUpdate()}_getOptionsHTML(){if(!this.trigger?.options)return s.dy`<div></div>`;var e={type:"text",default:"",label:"Option",name:"trigger_threshold"};return this.trigger.options.map((t=>(t={...e,...t},this.threshold&&(t.default=this.threshold),s.dy`<wrd-input name="${t.name}" value="${t.default}" type="${t.type}" label="${t.label}" hide-errors></wrd-input>`)))}static styles=s.iv`
        .group{
            margin-top: 0.75rem;
            margin-bottom: 2.25rem;
        }

        .info{
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: #586C77;

            margin: 0;
            padding: 1.5rem;
        }
        .info a{
            text-decoration: none;
            color: #D204B0;
        }

        .groupTitle{
            margin: 0;
            padding: 0.75rem 1.5rem;

            text-transform: uppercase;
            font-family: inherit;
            color: #7E8E97;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .trigger{
            --bg: inherit;
            --selected: #D204B0;
            --highlight: #FECEF6;

            display: block;
            box-sizing: border-box;
            width: 100%;

            padding: 0.5rem 1.5rem;

            border: none;
            background: none;
            font-family: inherit;
            font-weight: inherit;
            font-size: inherit;
            text-align: left;

            position: relative;
            overflow: hidden;

            cursor: pointer;

            transition: background 0.2s ease;
        }

        .trigger:hover,
        .trigger:focus-within{
            background: #FFEFFC;
        }

        .trigger.selected{
            background: var(--highlight);
        }

        .trigger wrd-icon{
            --fill: #fff;
            --bg: inherit;

            font-weight: 500;
        }

        .trigger.selected wrd-icon{
            --bg: var(--selected);
            --text: var(--selected);
        }

        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }
    `;render(){let e=(t=window.popbot.triggers,i="category",n=[],t.forEach((e=>{let t=!1;n.forEach((s=>{s.label==e[i]&&(s.items.push(e),t=!0)})),t||n.push({label:e[i],items:[e]})})),n);var t,i,n;return s.dy`
            <wrd-panel id="panel" header="Choose a Trigger">

                <p class="info">
                    When a trigger fires the PopBot will be displayed, so long as all conditions are met. PopBots with the same trigger are fired in order of priority. <a href="#">Learn more about Triggers</a>.
                </p>


                ${(0,r.r)(e,(e=>e.label),(e=>s.dy`
            
                <div class="group" style="--bg: ${e.items[0].color};">
                    <h3 class="groupTitle">
                        ${e.label}
                    </h3>

                    ${(0,r.r)(e.items,(e=>e.id),(e=>s.dy`

                        <button type="button" class="trigger ${e.id==this.trigger?.id?"selected":"unselected"}" @click="${()=>this.trigger=e.id}">
                            <wrd-icon icon="${e.icon}" label="${e.label}"></wrd-icon>
                        </button>

                    `))}

                </div>

                `))}


                <div slot="options" class="options">
                    ${this._getOptionsHTML()}
                
                    <wrd-button id="button" @click=${this.save}>Save Changes</wrd-button>
                </div>

            </wrd-panel>
        `}}customElements.define("wrd-trigger-panel",o)},754:(e,t,i)=>{"use strict";var s=i(392);class r extends s.oi{static properties={post:{type:Number},value:{type:String}};get _icon(){return"publish"==this.value?"visibility":"visibility_off"}toggle(){"publish"==this.value?this.value="draft":this.value="publish",this.save()}async save(){var e=new FormData;e.append("action","inlineSave"),e.append("post_id",this.post),e.append("nonce",window.popbot.fetch.nonce),e.append("key","post_status"),e.append("value",this.value);const t=await fetch(window.popbot.fetch.ajax_url,{method:"POST",body:e});try{const e=await t.json();if(!t.ok||!e.success)throw"Error";"publish"==this.value?WRDToast("PopBot now enabled."):WRDToast("PopBot now disabled.");const i=new CustomEvent("wrd-visibility-toggle-change",{bubbles:!0,cancelable:!0});this.dispatchEvent(i)}catch(e){WRDToast("An error occured.")}}static styles=s.iv`
        
    `;render(){return s.dy`
            <wrd-icon icon="${this._icon}" aria-label="Toggle Visibility" title="Toggle Visibility" button @click="${this.toggle}"></wrd-icon>
        `}}customElements.define("wrd-visibility-toggle",r)},692:(e,t,i)=>{"use strict";var s;i.d(t,{Al:()=>M,Jb:()=>x,dy:()=>$,sY:()=>k});const r=globalThis.trustedTypes,n=r?r.createPolicy("lit-html",{createHTML:e=>e}):void 0,o=`lit$${(Math.random()+"").slice(9)}$`,a="?"+o,l=`<${a}>`,d=document,c=(e="")=>d.createComment(e),h=e=>null===e||"object"!=typeof e&&"function"!=typeof e,p=Array.isArray,u=e=>p(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]),g=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,m=/-->/g,v=/>/g,f=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),b=/'/g,w=/"/g,y=/^(?:script|style|textarea|title)$/i,_=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),$=_(1),x=(_(2),Symbol.for("lit-noChange")),E=Symbol.for("lit-nothing"),A=new WeakMap,k=(e,t,i)=>{var s,r;const n=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:t;let o=n._$litPart$;if(void 0===o){const e=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:null;n._$litPart$=o=new T(t.insertBefore(c(),e),e,void 0,null!=i?i:{})}return o._$AI(e),o},S=d.createTreeWalker(d,129,null,!1),C=(e,t)=>{const i=e.length-1,s=[];let r,a=2===t?"<svg>":"",d=g;for(let t=0;t<i;t++){const i=e[t];let n,c,h=-1,p=0;for(;p<i.length&&(d.lastIndex=p,c=d.exec(i),null!==c);)p=d.lastIndex,d===g?"!--"===c[1]?d=m:void 0!==c[1]?d=v:void 0!==c[2]?(y.test(c[2])&&(r=RegExp("</"+c[2],"g")),d=f):void 0!==c[3]&&(d=f):d===f?">"===c[0]?(d=null!=r?r:g,h=-1):void 0===c[1]?h=-2:(h=d.lastIndex-c[2].length,n=c[1],d=void 0===c[3]?f:'"'===c[3]?w:b):d===w||d===b?d=f:d===m||d===v?d=g:(d=f,r=void 0);const u=d===f&&e[t+1].startsWith("/>")?" ":"";a+=d===g?i+l:h>=0?(s.push(n),i.slice(0,h)+"$lit$"+i.slice(h)+o+u):i+o+(-2===h?(s.push(void 0),t):u)}const c=a+(e[i]||"<?>")+(2===t?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==n?n.createHTML(c):c,s]};class P{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,l=0;const d=e.length-1,h=this.parts,[p,u]=C(e,t);if(this.el=P.createElement(p,i),S.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(s=S.nextNode())&&h.length<d;){if(1===s.nodeType){if(s.hasAttributes()){const e=[];for(const t of s.getAttributeNames())if(t.endsWith("$lit$")||t.startsWith(o)){const i=u[l++];if(e.push(t),void 0!==i){const e=s.getAttribute(i.toLowerCase()+"$lit$").split(o),t=/([.?@])?(.*)/.exec(i);h.push({type:1,index:n,name:t[2],strings:e,ctor:"."===t[1]?D:"?"===t[1]?U:"@"===t[1]?B:L})}else h.push({type:6,index:n})}for(const t of e)s.removeAttribute(t)}if(y.test(s.tagName)){const e=s.textContent.split(o),t=e.length-1;if(t>0){s.textContent=r?r.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],c()),S.nextNode(),h.push({type:2,index:++n});s.append(e[t],c())}}}else if(8===s.nodeType)if(s.data===a)h.push({type:2,index:n});else{let e=-1;for(;-1!==(e=s.data.indexOf(o,e+1));)h.push({type:7,index:n}),e+=o.length-1}n++}}static createElement(e,t){const i=d.createElement("template");return i.innerHTML=e,i}}function z(e,t,i=e,s){var r,n,o,a;if(t===x)return t;let l=void 0!==s?null===(r=i._$Cl)||void 0===r?void 0:r[s]:i._$Cu;const d=h(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===d?l=void 0:(l=new d(e),l._$AT(e,i,s)),void 0!==s?(null!==(o=(a=i)._$Cl)&&void 0!==o?o:a._$Cl=[])[s]=l:i._$Cu=l),void 0!==l&&(t=z(e,l._$AS(e,t.values),l,s)),t}class R{constructor(e,t){this.v=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(e){var t;const{el:{content:i},parts:s}=this._$AD,r=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:d).importNode(i,!0);S.currentNode=r;let n=S.nextNode(),o=0,a=0,l=s[0];for(;void 0!==l;){if(o===l.index){let t;2===l.type?t=new T(n,n.nextSibling,this,e):1===l.type?t=new l.ctor(n,l.name,l.strings,this,e):6===l.type&&(t=new j(n,this,e)),this.v.push(t),l=s[++a]}o!==(null==l?void 0:l.index)&&(n=S.nextNode(),o++)}return r}m(e){let t=0;for(const i of this.v)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class T{constructor(e,t,i,s){var r;this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$C_=null===(r=null==s?void 0:s.isConnected)||void 0===r||r}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$C_}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=z(this,e,t),h(e)?e===E||null==e||""===e?(this._$AH!==E&&this._$AR(),this._$AH=E):e!==this._$AH&&e!==x&&this.T(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.k(e):u(e)?this.S(e):this.T(e)}j(e,t=this._$AB){return this._$AA.parentNode.insertBefore(e,t)}k(e){this._$AH!==e&&(this._$AR(),this._$AH=this.j(e))}T(e){this._$AH!==E&&h(this._$AH)?this._$AA.nextSibling.data=e:this.k(d.createTextNode(e)),this._$AH=e}$(e){var t;const{values:i,_$litType$:s}=e,r="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=P.createElement(s.h,this.options)),s);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===r)this._$AH.m(i);else{const e=new R(r,this),t=e.p(this.options);e.m(i),this.k(t),this._$AH=e}}_$AC(e){let t=A.get(e.strings);return void 0===t&&A.set(e.strings,t=new P(e)),t}S(e){p(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new T(this.j(c()),this.j(c()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$C_=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class L{constructor(e,t,i,s,r){this.type=1,this._$AH=E,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=E}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,i,s){const r=this.strings;let n=!1;if(void 0===r)e=z(this,e,t,0),n=!h(e)||e!==this._$AH&&e!==x,n&&(this._$AH=e);else{const s=e;let o,a;for(e=r[0],o=0;o<r.length-1;o++)a=z(this,s[i+o],t,o),a===x&&(a=this._$AH[o]),n||(n=!h(a)||a!==this._$AH[o]),a===E?e=E:e!==E&&(e+=(null!=a?a:"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.P(e)}P(e){e===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class D extends L{constructor(){super(...arguments),this.type=3}P(e){this.element[this.name]=e===E?void 0:e}}const O=r?r.emptyScript:"";class U extends L{constructor(){super(...arguments),this.type=4}P(e){e&&e!==E?this.element.setAttribute(this.name,O):this.element.removeAttribute(this.name)}}class B extends L{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){var i;if((e=null!==(i=z(this,e,t,0))&&void 0!==i?i:E)===x)return;const s=this._$AH,r=e===E&&s!==E||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==E&&(s===E||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==i?i:this.element,e):this._$AH.handleEvent(e)}}class j{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){z(this,e)}}const M={A:"$lit$",C:o,M:a,L:1,R:C,V:R,D:u,I:z,H:T,N:L,U,B,F:D,W:j},F=window.litHtmlPolyfillSupport;null==F||F(P,T),(null!==(s=globalThis.litHtmlVersions)&&void 0!==s?s:globalThis.litHtmlVersions=[]).push("2.2.7")},830:(e,t,i)=>{"use strict";i.d(t,{r:()=>h});var s=i(692);const{H:r}=s.Al,n=()=>document.createComment(""),o=(e,t,i)=>{var s;const o=e._$AA.parentNode,a=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=o.insertBefore(n(),a),s=o.insertBefore(n(),a);i=new r(t,s,e,e.options)}else{const t=i._$AB.nextSibling,r=i._$AM,n=r!==e;if(n){let t;null===(s=i._$AQ)||void 0===s||s.call(i,e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==r._$AU&&i._$AP(t)}if(t!==a||n){let e=i._$AA;for(;e!==t;){const t=e.nextSibling;o.insertBefore(e,a),e=t}}}return i},a=(e,t,i=e)=>(e._$AI(t,i),e),l={},d=e=>{var t;null===(t=e._$AP)||void 0===t||t.call(e,!1,!0);let i=e._$AA;const s=e._$AB.nextSibling;for(;i!==s;){const e=i.nextSibling;i.remove(),i=e}},c=(e,t,i)=>{const s=new Map;for(let r=t;r<=i;r++)s.set(e[r],r);return s},h=(p=class extends class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}{constructor(e){if(super(e),2!==e.type)throw Error("repeat() can only be used in text expressions")}ht(e,t,i){let s;void 0===i?i=t:void 0!==t&&(s=t);const r=[],n=[];let o=0;for(const t of e)r[o]=s?s(t,o):o,n[o]=i(t,o),o++;return{values:n,keys:r}}render(e,t,i){return this.ht(e,t,i).values}update(e,[t,i,r]){var n;const h=e._$AH,{values:p,keys:u}=this.ht(t,i,r);if(!Array.isArray(h))return this.ut=u,p;const g=null!==(n=this.ut)&&void 0!==n?n:this.ut=[],m=[];let v,f,b=0,w=h.length-1,y=0,_=p.length-1;for(;b<=w&&y<=_;)if(null===h[b])b++;else if(null===h[w])w--;else if(g[b]===u[y])m[y]=a(h[b],p[y]),b++,y++;else if(g[w]===u[_])m[_]=a(h[w],p[_]),w--,_--;else if(g[b]===u[_])m[_]=a(h[b],p[_]),o(e,m[_+1],h[b]),b++,_--;else if(g[w]===u[y])m[y]=a(h[w],p[y]),o(e,h[b],h[w]),w--,y++;else if(void 0===v&&(v=c(u,y,_),f=c(g,b,w)),v.has(g[b]))if(v.has(g[w])){const t=f.get(u[y]),i=void 0!==t?h[t]:null;if(null===i){const t=o(e,h[b]);a(t,p[y]),m[y]=t}else m[y]=a(i,p[y]),o(e,h[b],i),h[t]=null;y++}else d(h[w]),w--;else d(h[b]),b++;for(;y<=_;){const t=o(e,m[_+1]);a(t,p[y]),m[y++]=t}for(;b<=w;){const e=h[b++];null!==e&&d(e)}return this.ut=u,((e,t=l)=>{e._$AH=t})(e,m),s.Jb}},(...e)=>({_$litDirective$:p,values:e}));var p},392:(e,t,i)=>{"use strict";i.d(t,{oi:()=>_,iv:()=>l,dy:()=>y.dy});const s=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),n=new WeakMap;class o{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(t,e))}return e}toString(){return this.cssText}}const a=e=>new o("string"==typeof e?e:e+"",void 0,r),l=(e,...t)=>{const i=1===e.length?e[0]:t.reduce(((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1]),e[0]);return new o(i,e,r)},d=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return a(t)})(e):e;var c;const h=window.trustedTypes,p=h?h.emptyScript:"",u=window.reactiveElementPolyfillSupport,g={toAttribute(e,t){switch(t){case Boolean:e=e?p:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},m=(e,t)=>t!==e&&(t==t||e==e),v={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:m};class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(e){var t;null!==(t=this.h)&&void 0!==t||(this.h=[]),this.h.push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,i)=>{const s=this._$Ep(i,t);void 0!==s&&(this._$Ev.set(s,i),e.push(s))})),e}static createProperty(e,t=v){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const i="symbol"==typeof e?Symbol():"__"+e,s=this.getPropertyDescriptor(e,i,t);void 0!==s&&Object.defineProperty(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(s){const r=this[e];this[t]=s,this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const i of t)this.createProperty(i,e[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(d(e))}else void 0!==e&&t.push(d(e));return t}static _$Ep(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}u(){var e;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,i;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(i=e.hostConnected)||void 0===i||i.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{s?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const i=document.createElement("style"),s=window.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=t.cssText,e.appendChild(i)}))})(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EO(e,t,i=v){var s,r;const n=this.constructor._$Ep(e,i);if(void 0!==n&&!0===i.reflect){const o=(null!==(r=null===(s=i.converter)||void 0===s?void 0:s.toAttribute)&&void 0!==r?r:g.toAttribute)(t,i.type);this._$El=e,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(e,t){var i,s;const r=this.constructor,n=r._$Ev.get(e);if(void 0!==n&&this._$El!==n){const e=r.getPropertyOptions(n),o=e.converter,a=null!==(s=null!==(i=null==o?void 0:o.fromAttribute)&&void 0!==i?i:"function"==typeof o?o:null)&&void 0!==s?s:g.fromAttribute;this._$El=n,this[n]=a(t,e.type),this._$El=null}}requestUpdate(e,t,i){let s=!0;void 0!==e&&(((i=i||this.constructor.getPropertyOptions(e)).hasChanged||m)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===i.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((e,t)=>this[t]=e)),this._$Ei=void 0);let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(i)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach(((e,t)=>this._$EO(t,this[t],e))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}}f.finalized=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:f}),(null!==(c=globalThis.reactiveElementVersions)&&void 0!==c?c:globalThis.reactiveElementVersions=[]).push("1.3.4");var b,w,y=i(692);class _ extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const i=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=i.firstChild),i}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=(0,y.sY)(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!1)}render(){return y.Jb}}_.finalized=!0,_._$litElement$=!0,null===(b=globalThis.litElementHydrateSupport)||void 0===b||b.call(globalThis,{LitElement:_});const $=globalThis.litElementPolyfillSupport;null==$||$({LitElement:_}),(null!==(w=globalThis.litElementVersions)&&void 0!==w?w:globalThis.litElementVersions=[]).push("3.2.2")}},t={};function i(s){var r=t[s];if(void 0!==r)return r.exports;var n=t[s]={exports:{}};return e[s](n,n.exports,i),n.exports}i.d=(e,t)=>{for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i(943),i(266),i(451),i(987),i(411),i(635),i(255),i(201),i(966),i(827),i(762),i(955),i(8),i(216),i(391),i(414),i(858),i(803),i(446),i(528),i(891),i(979),i(568),i(618),i(470),i(437),i(754)})();
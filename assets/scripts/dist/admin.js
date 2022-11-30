/*! For license information please see admin.js.LICENSE.txt */
(()=>{var e={878:()=>{window.popbot.triggers=[{id:"click",label:"Click Element",icon:"ads_click",category:"Engagement",color:"#85A700",options:[{placeholder:"#id",label:"Element Selector"}],setupTrigger:function(e,t){window.addEventListener("click",(i=>{if(t&&!i.target.matches(t)&&!i.target.closest(t))return!1;e.pop()}))}},{id:"exit_intent",label:"Go to Exit",icon:"meeting_room",category:"Engagement",color:"#85A700",setupTrigger:function(e){document.addEventListener("mouseout",(t=>{t.toElement||t.relatedTarget||e.pop()}))}},{id:"scroll",label:"Scroll Depth",icon:"open_with",category:"Engagement",color:"#85A700",options:[{placeholder:75,type:"number",label:"Scroll Depth"}],setupTrigger:function(e,t){window.addEventListener("scroll",(i=>{const o=window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;if(t&&o<t)return!1;e.pop()}))}},{id:"submit",label:"Form Submission",icon:"playlist_add_check",category:"Engagement",color:"#85A700",options:[{placeholder:"#id",label:"Form Selector"}],setupTrigger:function(e,t){window.addEventListener("submit",(i=>{if(t&&!i.submitter.matches(t))return!1;e.pop()}))}},{id:"instant",label:"Instant",icon:"bolt",category:"Time",color:"#1E92F8",setupTrigger:function(e){e.pop(),setTimeout((()=>e.pop()),window.popbot.config.timeBeforeFirstPopup+1)}},{id:"idle",label:"Idle Time",icon:"hourglass_bottom",category:"Time",color:"#1E92F8",options:[{placeholder:30,type:"number",label:"Idle Duration"}],setupTrigger:function(e,t){let i;function o(o){clearTimeout(i),i=setTimeout((()=>{e.pop()}),1e3*t)}["mousedown","mousemove","keydown","click","scroll","touchstart"].forEach((function(e){document.addEventListener(e,o,!0)}))}},{id:"duration",label:"Time on Page",icon:"schedule",category:"Time",color:"#1E92F8",options:[{placeholder:60,type:"number",label:"Duration Time"}],setupTrigger:function(e,t){setTimeout((()=>{e.pop()}),1e3*t)}},{id:"event",label:"JavaScript Event",icon:"code",category:"Other",color:"#F8A11E",options:[{placeholder:"click",label:"Event Type"}],setupTrigger:function(e,t){window.addEventListener(t,(t=>{e.pop()}))}}]}},t={};function i(o){var s=t[o];if(void 0!==s)return s.exports;var n=t[o]={exports:{}};return e[o](n,n.exports,i),n.exports}(()=>{"use strict";const e=window,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;class n{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=s.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&s.set(i,e))}return e}toString(){return this.cssText}}const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce(((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1]),e[0]);return new n(i,e,o)},a=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,o))(t)})(e):e;var l;const c=window,d=c.trustedTypes,h=d?d.emptyScript:"",p=c.reactiveElementPolyfillSupport,u={toAttribute(e,t){switch(t){case Boolean:e=e?h:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},g=(e,t)=>t!==e&&(t==t||e==e),f={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:g};class m extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(e){var t;this.finalize(),(null!==(t=this.h)&&void 0!==t?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,i)=>{const o=this._$Ep(i,t);void 0!==o&&(this._$Ev.set(o,i),e.push(o))})),e}static createProperty(e,t=f){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const i="symbol"==typeof e?Symbol():"__"+e,o=this.getPropertyDescriptor(e,i,t);void 0!==o&&Object.defineProperty(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(o){const s=this[e];this[t]=o,this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||f}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),void 0!==e.h&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const i of t)this.createProperty(i,e[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Ep(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}u(){var e;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,i;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(i=e.hostConnected)||void 0===i||i.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var i;const o=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,o)=>{t?i.adoptedStyleSheets=o.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):o.forEach((t=>{const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=t.cssText,i.appendChild(o)}))})(o,this.constructor.elementStyles),o}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EO(e,t,i=f){var o;const s=this.constructor._$Ep(e,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==(null===(o=i.converter)||void 0===o?void 0:o.toAttribute)?i.converter:u).toAttribute(t,i.type);this._$El=e,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$El=null}}_$AK(e,t){var i;const o=this.constructor,s=o._$Ev.get(e);if(void 0!==s&&this._$El!==s){const e=o.getPropertyOptions(s),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null===(i=e.converter)||void 0===i?void 0:i.fromAttribute)?e.converter:u;this._$El=s,this[s]=n.fromAttribute(t,e.type),this._$El=null}}requestUpdate(e,t,i){let o=!0;void 0!==e&&(((i=i||this.constructor.getPropertyOptions(e)).hasChanged||g)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===i.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,i))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((e,t)=>this[t]=e)),this._$Ei=void 0);let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(i)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach(((e,t)=>this._$EO(t,this[t],e))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}}var b;m.finalized=!0,m.elementProperties=new Map,m.elementStyles=[],m.shadowRootOptions={mode:"open"},null==p||p({ReactiveElement:m}),(null!==(l=c.reactiveElementVersions)&&void 0!==l?l:c.reactiveElementVersions=[]).push("1.4.2");const v=window,y=v.trustedTypes,_=y?y.createPolicy("lit-html",{createHTML:e=>e}):void 0,w=`lit$${(Math.random()+"").slice(9)}$`,$="?"+w,x=`<${$}>`,k=document,E=(e="")=>k.createComment(e),C=e=>null===e||"object"!=typeof e&&"function"!=typeof e,A=Array.isArray,S=e=>A(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]),T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,P=/>/g,z=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),O=/'/g,D=/"/g,R=/^(?:script|style|textarea|title)$/i,U=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),L=U(1),F=(U(2),Symbol.for("lit-noChange")),B=Symbol.for("lit-nothing"),q=new WeakMap,N=k.createTreeWalker(k,129,null,!1),H=(e,t)=>{const i=e.length-1,o=[];let s,n=2===t?"<svg>":"",r=T;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===T?"!--"===l[1]?r=M:void 0!==l[1]?r=P:void 0!==l[2]?(R.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=z):void 0!==l[3]&&(r=z):r===z?">"===l[0]?(r=null!=s?s:T,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?z:'"'===l[3]?D:O):r===D||r===O?r=z:r===M||r===P?r=T:(r=z,s=void 0);const h=r===z&&e[t+1].startsWith("/>")?" ":"";n+=r===T?i+x:c>=0?(o.push(a),i.slice(0,c)+"$lit$"+i.slice(c)+w+h):i+w+(-2===c?(o.push(void 0),t):h)}const a=n+(e[i]||"<?>")+(2===t?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==_?_.createHTML(a):a,o]};class V{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let s=0,n=0;const r=e.length-1,a=this.parts,[l,c]=H(e,t);if(this.el=V.createElement(l,i),N.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(o=N.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes()){const e=[];for(const t of o.getAttributeNames())if(t.endsWith("$lit$")||t.startsWith(w)){const i=c[n++];if(e.push(t),void 0!==i){const e=o.getAttribute(i.toLowerCase()+"$lit$").split(w),t=/([.?@])?(.*)/.exec(i);a.push({type:1,index:s,name:t[2],strings:e,ctor:"."===t[1]?Y:"?"===t[1]?J:"@"===t[1]?X:W})}else a.push({type:6,index:s})}for(const t of e)o.removeAttribute(t)}if(R.test(o.tagName)){const e=o.textContent.split(w),t=e.length-1;if(t>0){o.textContent=y?y.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],E()),N.nextNode(),a.push({type:2,index:++s});o.append(e[t],E())}}}else if(8===o.nodeType)if(o.data===$)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=o.data.indexOf(w,e+1));)a.push({type:7,index:s}),e+=w.length-1}s++}}static createElement(e,t){const i=k.createElement("template");return i.innerHTML=e,i}}function j(e,t,i=e,o){var s,n,r,a;if(t===F)return t;let l=void 0!==o?null===(s=i._$Co)||void 0===s?void 0:s[o]:i._$Cl;const c=C(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===c?l=void 0:(l=new c(e),l._$AT(e,i,o)),void 0!==o?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[o]=l:i._$Cl=l),void 0!==l&&(t=j(e,l._$AS(e,t.values),l,o)),t}class I{constructor(e,t){this.u=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(e){var t;const{el:{content:i},parts:o}=this._$AD,s=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:k).importNode(i,!0);N.currentNode=s;let n=N.nextNode(),r=0,a=0,l=o[0];for(;void 0!==l;){if(r===l.index){let t;2===l.type?t=new Z(n,n.nextSibling,this,e):1===l.type?t=new l.ctor(n,l.name,l.strings,this,e):6===l.type&&(t=new G(n,this,e)),this.u.push(t),l=o[++a]}r!==(null==l?void 0:l.index)&&(n=N.nextNode(),r++)}return s}p(e){let t=0;for(const i of this.u)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Z{constructor(e,t,i,o){var s;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cm=null===(s=null==o?void 0:o.isConnected)||void 0===s||s}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cm}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=j(this,e,t),C(e)?e===B||null==e||""===e?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==F&&this.g(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):S(e)?this.k(e):this.g(e)}O(e,t=this._$AB){return this._$AA.parentNode.insertBefore(e,t)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}g(e){this._$AH!==B&&C(this._$AH)?this._$AA.nextSibling.data=e:this.T(k.createTextNode(e)),this._$AH=e}$(e){var t;const{values:i,_$litType$:o}=e,s="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=V.createElement(o.h,this.options)),o);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===s)this._$AH.p(i);else{const e=new I(s,this),t=e.v(this.options);e.p(i),this.T(t),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new V(e)),t}k(e){A(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const s of e)o===t.length?t.push(i=new Z(this.O(E()),this.O(E()),this,this.options)):i=t[o],i._$AI(s),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cm=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class W{constructor(e,t,i,o,s){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,i,o){const s=this.strings;let n=!1;if(void 0===s)e=j(this,e,t,0),n=!C(e)||e!==this._$AH&&e!==F,n&&(this._$AH=e);else{const o=e;let r,a;for(e=s[0],r=0;r<s.length-1;r++)a=j(this,o[i+r],t,r),a===F&&(a=this._$AH[r]),n||(n=!C(a)||a!==this._$AH[r]),a===B?e=B:e!==B&&(e+=(null!=a?a:"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class Y extends W{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}const K=y?y.emptyScript:"";class J extends W{constructor(){super(...arguments),this.type=4}j(e){e&&e!==B?this.element.setAttribute(this.name,K):this.element.removeAttribute(this.name)}}class X extends W{constructor(e,t,i,o,s){super(e,t,i,o,s),this.type=5}_$AI(e,t=this){var i;if((e=null!==(i=j(this,e,t,0))&&void 0!==i?i:B)===F)return;const o=this._$AH,s=e===B&&o!==B||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,n=e!==B&&(o===B||s);s&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==i?i:this.element,e):this._$AH.handleEvent(e)}}class G{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){j(this,e)}}const Q={P:"$lit$",A:w,M:$,C:1,L:H,R:I,D:S,V:j,I:Z,H:W,N:J,U:X,B:Y,F:G},ee=v.litHtmlPolyfillSupport;var te,ie;null==ee||ee(V,Z),(null!==(b=v.litHtmlVersions)&&void 0!==b?b:v.litHtmlVersions=[]).push("2.4.0");class oe extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const i=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=i.firstChild),i}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{var o,s;const n=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:t;let r=n._$litPart$;if(void 0===r){const e=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:null;n._$litPart$=r=new Z(t.insertBefore(E(),e),e,void 0,null!=i?i:{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!1)}render(){return F}}oe.finalized=!0,oe._$litElement$=!0,null===(te=globalThis.litElementHydrateSupport)||void 0===te||te.call(globalThis,{LitElement:oe});const se=globalThis.litElementPolyfillSupport;null==se||se({LitElement:oe}),(null!==(ie=globalThis.litElementVersions)&&void 0!==ie?ie:globalThis.litElementVersions=[]).push("3.2.2");class ne{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const{I:re}=Q,ae=()=>document.createComment(""),le=(e,t,i)=>{var o;const s=e._$AA.parentNode,n=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=s.insertBefore(ae(),n),o=s.insertBefore(ae(),n);i=new re(t,o,e,e.options)}else{const t=i._$AB.nextSibling,r=i._$AM,a=r!==e;if(a){let t;null===(o=i._$AQ)||void 0===o||o.call(i,e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==r._$AU&&i._$AP(t)}if(t!==n||a){let e=i._$AA;for(;e!==t;){const t=e.nextSibling;s.insertBefore(e,n),e=t}}}return i},ce=(e,t,i=e)=>(e._$AI(t,i),e),de={},he=e=>{var t;null===(t=e._$AP)||void 0===t||t.call(e,!1,!0);let i=e._$AA;const o=e._$AB.nextSibling;for(;i!==o;){const e=i.nextSibling;i.remove(),i=e}},pe=(e,t,i)=>{const o=new Map;for(let s=t;s<=i;s++)o.set(e[s],s);return o},ue=(me=class extends ne{constructor(e){if(super(e),2!==e.type)throw Error("repeat() can only be used in text expressions")}ht(e,t,i){let o;void 0===i?i=t:void 0!==t&&(o=t);const s=[],n=[];let r=0;for(const t of e)s[r]=o?o(t,r):r,n[r]=i(t,r),r++;return{values:n,keys:s}}render(e,t,i){return this.ht(e,t,i).values}update(e,[t,i,o]){var s;const n=(e=>e._$AH)(e),{values:r,keys:a}=this.ht(t,i,o);if(!Array.isArray(n))return this.ut=a,r;const l=null!==(s=this.ut)&&void 0!==s?s:this.ut=[],c=[];let d,h,p=0,u=n.length-1,g=0,f=r.length-1;for(;p<=u&&g<=f;)if(null===n[p])p++;else if(null===n[u])u--;else if(l[p]===a[g])c[g]=ce(n[p],r[g]),p++,g++;else if(l[u]===a[f])c[f]=ce(n[u],r[f]),u--,f--;else if(l[p]===a[f])c[f]=ce(n[p],r[f]),le(e,c[f+1],n[p]),p++,f--;else if(l[u]===a[g])c[g]=ce(n[u],r[g]),le(e,n[p],n[u]),u--,g++;else if(void 0===d&&(d=pe(a,g,f),h=pe(l,p,u)),d.has(l[p]))if(d.has(l[u])){const t=h.get(a[g]),i=void 0!==t?n[t]:null;if(null===i){const t=le(e,n[p]);ce(t,r[g]),c[g]=t}else c[g]=ce(i,r[g]),le(e,n[p],i),n[t]=null;g++}else he(n[u]),u--;else he(n[p]),p++;for(;g<=f;){const t=le(e,c[f+1]);ce(t,r[g]),c[g++]=t}for(;p<=u;){const e=n[p++];null!==e&&he(e)}return this.ut=a,((e,t=de)=>{e._$AH=t})(e,c),F}},(...e)=>({_$litDirective$:me,values:e})),ge=async function(e,t={},i="GET"){let o=new URL(`${window.popbot.home_url}/wp-json${e}`),s={method:i,headers:new Headers({"X-WP-Nonce":window.popbot.rest_nonce})};if("GET"==i)for(const e in t)o.searchParams.append(e,t[e]);else t instanceof FormData?s.body=t:(s.headers.append("Content-Type","application/json"),s.body=JSON.stringify(t));return await fetch(o.href,s).then((e=>e.json()))},fe=async()=>{window.popbot.conditions=window.popbot.conditions||[];const e=await ge("/popbot/v1/custom-conditions/");window.popbot.conditions=window.popbot.conditions.filter((e=>"Custom"!==e.category));for(const t of e)try{let e=new Function(t.callback);window.popbot.conditions.push({category:"Custom",id:`custom.${t.id}`,label:t.title,value:e()})}catch(e){console.error(e)}};var me;class be extends oe{constructor(){super(),setTimeout((()=>{this.hide()}),3e3)}hide(){setTimeout((()=>{this.remove()}),300),this.renderRoot.querySelector(".toast").classList.add("out")}render(){return L`
            <div class="toast">
                <slot></slot>
            </div>
        `}static styles=r`
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
    `}const ve=function(e=""){const t=document.createElement("snack-bar");return t.append(e),document.getElementById("wpcontent").append(t),t};customElements.define("snack-bar",be);class ye extends oe{static properties={header:{},accept:{attribute:"accept"},reject:{attribute:"reject"}};constructor(){super()}hide(){setTimeout((()=>{this.remove()}),300),this.renderRoot.querySelector(".backdrop").classList.add("out")}_onAccept(){this.hide();const e=new CustomEvent("modal-accept");this.dispatchEvent(e)}_onReject(){this.hide();const e=new CustomEvent("modal-reject");this.dispatchEvent(e)}render(){return L`
            
            <div class="backdrop">
                <div class="modal">
                    <h2 class="title">
                        ${this.header}
                    </h2>

                    <slot></slot>

                    <div class="buttons">
                        <icon-button @click=${this._onAccept} class="accept">${this.accept}</icon-button>

                        <icon-button @click=${this._onReject} class="reject" secondary>${this.reject}</icon-button>
                    </div>
                </div>
            </div>
        `}static styles=r`
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
    `}customElements.define("dialog-box",ye);class _e extends oe{static properties={uuid:{type:String},value:{type:Object,state:!0}};static route="/popbot/v1/popbots/";static key=void 0;static defaultValue={};constructor(){super(),this.value=this.constructor.defaultValue}connectedCallback(){super.connectedCallback(),this._getValueFromServer()}createRenderRoot(){const e=super.createRenderRoot();return e.addEventListener("panel-open",this._onOpen.bind(this)),e.addEventListener("panel-close",this._onClose.bind(this)),e}getChip(){return!1}get opened(){return this.renderRoot.querySelector("#panel").opened}open(){return this.renderRoot.querySelector("#panel").open()}close(){return this.renderRoot.querySelector("#panel").close()}toggle(){return this.renderRoot.querySelector("#panel").toggle()}async _getValueFromServer(){if(this.uuid<0||!this.uuid)return;const e=this.constructor.key?{_fields:this.constructor.key}:{},t=await ge(`${this.constructor.route}${this.uuid}`,e);this.value=this.constructor.key?t[this.constructor.key]:t,this.dispatchEvent(new CustomEvent("panel-interface-loaded",{bubbles:!0,cancelable:!1}))}_hasChanges(){return!((e,t)=>{if(Object.is(e,t))return!0;if(typeof e!=typeof t)return!1;var i=Object.keys(e),o=Object.keys(t);if(i.length!==o.length)return!1;for(var s=0;s<i.length;s++)if(!Object.prototype.hasOwnProperty.call(t,i[s])||!Object.is(e[i[s]],t[i[s]]))return!1;return!0})(this._savedState,this.value)}_onOpen(e){this._saveState()}_onClose(e){if(this._hasChanges()){e.preventDefault();(async function(e,t="",i="Accept",o="Cancel"){const s=document.createElement("dialog-box");return s.setAttribute("header",e),s.setAttribute("accept",i),s.setAttribute("reject",o),s.append(t),document.getElementById("wpcontent").append(s),new Promise(((e,t)=>{s.addEventListener("modal-accept",(function(){e()})),s.addEventListener("modal-reject",(function(){t("User rejected")}))}))})("You have unsaved changes!","Leaving now will revert all the changes you've made. Are you sure you don't want to save?","Go Back","Discard Changes").then((()=>{}),(()=>{this.discard(),this.close()}))}}_saveState(){Array.isArray(this.value)?this._savedState=Object.assign([],this.value):"string"==typeof this.value?this._savedState=(" "+this.value).slice(1):this._savedState=Object.assign({},this.value)}_restoreState(){this._savedState&&(this.value=this._savedState,this.requestUpdate())}discard(){this._restoreState(),this.dispatchEvent(new CustomEvent("panel-interface-discarded",{bubbles:!0,cancelable:!1}))}async save(){let e=this.renderRoot.querySelector("#button");if(e&&(e.loading=!0),this.uuid<0)var t=await this.create();else if(this.uuid){const e=this.constructor.key?{[this.constructor.key]:this.value}:this.value;t=await ge(this.constructor.route+this.uuid,e,"POST")}t?.uuid||t?.id?(this._saveState(),ve("Changed saved."),this.dispatchEvent(new CustomEvent("panel-interface-saved",{bubbles:!0,cancelable:!1}))):ve("An error occurred."),e&&(e.loading=!1)}async create(){const e=this.constructor.key?{[this.constructor.key]:this.value}:this.value,t=await ge(this.constructor.route,e,"POST");return(t.uuid||t.id)&&(this.uuid=t.uuid||t.id),t}}class we extends oe{static properties={header:{},button:{},_isOpen:{type:Boolean,reflect:!0,attribute:"open"}};constructor(){super(),this.header="Panel",this.button="Save Changes",this._isOpen=!1,this.isPanel=!0,window.addEventListener("keydown",(e=>{"Escape"==e.key&&this._isOpen&&this._getOpenChildPanels().length<1&&this.close()}))}get opened(){return this._isOpen}close(){const e=new CustomEvent("panel-close",{bubbles:!0,cancelable:!0});this.dispatchEvent(e),e.defaultPrevented||(this._isOpen=!1,document.body.style.overflowY="auto")}open(){const e=new CustomEvent("panel-open",{bubbles:!0,cancelable:!0});this.dispatchEvent(e),e.defaultPrevented||(this._isOpen=!0,document.body.style.overflowY="hidden")}toggle(){this._isOpen?this.close():this.open()}_getChildren(){let e=this.shadowRoot.querySelector("slot");return e?e.assignedElements():[]}_getChildPanels(){return this._getChildren().filter((e=>e.isPanel))}_getOpenChildPanels(){return this._getChildPanels().filter((e=>e.open))}render(){return L`
            <div class="container" ?inert=${!this._isOpen}>

                <div class="backdrop" @click="${this.close}" >
                </div>

                <aside class="panel">
                    <header class="header">
                        <icon-label class="close" icon="close" button @click="${this.close}"></icon-label>

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
        `}static styles=r`
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

            background: rgba(0, 0, 0, 0.333);
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

            box-shadow:
                -1.4px 0px 3.6px rgba(0, 0, 0, 0.024),
                -3.8px 0px 10px rgba(0, 0, 0, 0.035),
                -9px 0px 24.1px rgba(0, 0, 0, 0.046),
                -30px 0px 80px rgba(0, 0, 0, 0.07)
            ;

            transition: transform 0.5s ease, right 0.5s ease, box-shadow 0.5s ease;
        }

        .container[inert] .panel{
            transform: translateX(var(--width));
            box-shadow: none;
        }

        .header{
            padding: 0.75rem 1.5rem;

            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .title{
            font-size: 1.3rem;
            font-weight: 500;
            color: #0f172a;
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
    `}customElements.define("off-canvas",we);class $e extends oe{static properties={icon:{},secondary:{type:Boolean},loading:{type:Boolean,reflect:!0},disabled:{type:Boolean,reflect:!0}};constructor(){super(),this.disabled=!1,this.loading=!1}render(){return L`
            <button class="button ${this.loading?"loading":null} ${this.secondary?"secondary":null}" role="button" ?disabled=${this.loading||this.disabled}>
                ${this.icon?L`<wrd-icon class="icon" icon="${this.icon}">`:null}
                
                <slot></slot>
            </button>
        `}static styles=r`
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
    `}customElements.define("icon-button",$e);class xe extends oe{static properties={max:{type:Number},selected:{type:Array,reflect:!0},header:{}};constructor(){super(),this.header="",this.selected=[],this.max=-1,this.isPanel=!0,this.addEventListener("click",(e=>{e.target.hasAttribute("key")&&this.toggleKey(e.target.getAttribute("key"))}))}get _slottedChildren(){const e=this.shadowRoot.querySelector("slot").assignedNodes({flatten:!0});return Array.prototype.filter.call(e,(e=>e.nodeType==Node.ELEMENT_NODE))}updated(){this._slottedChildren.forEach((e=>{e.hasAttribute("key")&&e.classList.toggle("selected",this.selected.includes(e.getAttribute("key")))}))}get open(){return this.renderRoot.querySelector("#panel").open}open(){return this.renderRoot.querySelector("#panel").open()}close(){return this.renderRoot.querySelector("#panel").close()}toggle(){return this.renderRoot.querySelector("#panel").toggle()}toggleKey(e){this.selected.includes(e)?this.removeKey(e):this.addKey(e)}addKey(e){this.selected=[...this.selected,e],this.max>0&&this.selected.length>this.max&&(this.selected.shift(),this.requestUpdate())}removeKey(e){this.selected=this.selected.filter((function(t){return t!=e}))}_onClose(){const e=new CustomEvent("panel-select-cancel",{detail:{selected:this.selected,element:this}});this.dispatchEvent(e)}confirm(){const e=new CustomEvent("panel-select-confirm",{detail:{selected:this.selected,element:this}});this.dispatchEvent(e),this.close()}async choose(){return this.open(),new Promise(((e,t)=>{this.addEventListener("panel-select-confirm",(function(){e(this.selected)})),this.addEventListener("panel-select-cancel",(function(){t("close")}))}))}render(){return L`
            <off-canvas id="panel" header="${this.header}" @panel-close="${this._onClose}">

                <slot id="slot"></slot>

                <div slot="options" class="options">
                    <span class="counter">${this.selected.length} Selected</span>
                    <icon-button id="button" @click=${this.confirm}>Confirm Changes</icon-button>
                </div>
            </off-canvas>
        `}static styles=r`
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
    `}customElements.define("panel-select",xe);class ke extends oe{static properties={template:{type:Object}};render(){return L`
            <div class="container">
                ${this.template?.image?L`
                    <div class="image" style="background-image: url(${this.template?.image})"></div>`:L`
                    <div class="iframe-wrapper">
                        <iframe loading="lazy" src="${this.template?.preview}"></iframe>
                    </div>
                `}

                <h3 class="name">${this.template?.details.name}</h3>
            </div>
        `}static styles=r`
        :host{
            --outline: 0px solid var(--theme-100);
            --text: #0f172a;

            display: block;
        }

        *{
            box-sizing: border-box;
        }
        
        .iframe-wrapper{
            padding: 1rem;
            margin-bottom: 0.5rem;
            
            background: #f1f5f9;
            outline: var(--outline);
            border-radius: 0.5rem;
            transition: outline 0.2s ease;
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
            height: 150px;

            border: none;
            margin: 0;
            padding: 0;
        }

        .image{
            width: 100%;
            height: 150px;
            margin-bottom: 0.5rem;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            background-color: #f1f5f9;
            border-radius: 0.5rem;
            outline: var(--outline);
            transition: outline 0.2s ease;
        }

        .name{
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;
            color: var(--text);

            margin: 0;

            transition: color 0.2s ease;
        }


        :host(.selected){
            --outline: 5px solid var(--theme-100);
            --text: var(--theme-700);
        }
    `}customElements.define("partial-template",ke);class Ee extends oe{static properties={_hidden:{state:!0,type:Boolean},_start:{state:!0},_end:{state:!0},_move:{state:!0},_x:{state:!0,type:Number},_y:{state:!0,type:Number},disabled:{type:Boolean},label:{},mode:{}};constructor(){super(),this._hidden=!0,this.mode="tooltip",this._x=0,this._y=0}firstUpdated(){this._start="mouseenter",this._end="mouseleave",this._move="mousemove","contextmenu"==this.mode?(this._start="contextmenu",this._end="",this._move="",this._addClickOffEventListener()):"dropdown"==this.mode&&(this._start="click",this._end="",this._move="",this._addClickOffEventListener());const e=this.renderRoot.querySelector(".container");e.addEventListener(this._start,this._onStart.bind(this)),e.addEventListener(this._end,this._onEnd.bind(this)),e.addEventListener(this._move,this._onMove.bind(this))}_addClickOffEventListener(){window.addEventListener("click",(e=>{let t=!1;e.composedPath()?.forEach((e=>{e!=this||(t=!0)})),t||this._onEnd(e)}))}_onMove(e){let t=this.renderRoot?.querySelector(".tooltip"),i=10;if(!t)return this._x=e.clientX+i,void(this._y=e.clientY+i);let o=t.style.display;t.style.display="block";let s=e.clientX+i,n=t.offsetWidth+s+i,r=document.body.clientWidth-n;r<0&&(s-=Math.abs(r));let a=e.clientY+i,l=t.offsetHeight+a+i,c=document.body.clientHeight-l;c<0&&(a-=Math.abs(c)),t.style.display=o,this._x=s,this._y=a}_onStart(e){this._hidden&&(this._hidden=!1,this._onMove(e)),"contextmenu"==this.mode&&e.preventDefault()}_onEnd(e){this._hidden=!0}render(){return L`
            <div class="container">
                <slot></slot>

                <div class="tooltip" ?hidden="${this._hidden||this.disabled}" style="--x: ${this._x}px; --y: ${this._y}px">
                    ${this.label?L`<div class="label">${this.label}</div>`:null}
                    <slot name="tooltip"></slot>
                </div>
            </div>
        `}static styles=r`
        [hidden]{
            display: none;
        }

        .tooltip{
            --x: 0;
            --y: 0;

            position: fixed;
            top: var(--y);
            left: var(--x);
            z-index: 9999999999;

            border-radius: 0.5rem;
            border: 1px solid #f8fafc;
            background: #fff;
            box-shadow:
            1.9px 1.9px 10px rgba(0, 0, 0, 0.025),
            15px 15px 80px rgba(0, 0, 0, 0.05)
            ;
        }

        .tooltip[hidden]{
            display: none;
        }

        .label{
            font-size: 0.8rem;

            padding: 0.4rem 0.8rem;
        }
    `}customElements.define("tool-tip",Ee);class Ce extends oe{static properties={label:{},icon:{},button:{type:Boolean},reverse:{type:Boolean},_fontLoaded:{type:Boolean,state:!0}};constructor(){super(),this.label="",this.icon="done",this.button=!1,this.reverse=!1,this._fontLoaded=document.fonts.check("24px Material Icons"),document.fonts.ready.then((()=>{this._fontLoaded=!0}))}render(){return this.button?L`
                <button class="container ${this.reverse?"reverse":null}">

                    <div class="icon ${this._fontLoaded?"loaded":"loading"}">
                        ${this.icon}
                    </div>

                    ${this.label?L`
                            <div class="label">
                                ${this.label}
                            </div>
                            `:null}
                </button>
            `:L`
                <div class="container ${this.reverse?"reverse":null}">

                    <div class="icon ${this._fontLoaded?"loaded":"loading"}">
                        ${this.icon}
                    </div>

                    ${this.label?L`
                            <div class="label">
                                ${this.label}
                            </div>
                            `:null}
                </div>
            `}static styles=r`
        :host{
            --fill: black;
            --text: black;
            --bg: transparent;
            --size: 48px;
            --gap: 0.5rem;

            display: inline-block;
        }

        :host([tabindex]){
            cursor: pointer;
        }

        .container{
            display: flex;
            align-items: center;
            justify-content: start;
            gap: var(--gap);

            background: none;
            padding: 0;
            margin: 0;
            border: 0;

            transition: all 0.2s ease;
        }
        .container.reverse{
            flex-direction: row-reverse;
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
            font-size: calc(var(--size) / 2);
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;

            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            /* Support for all WebKit browsers. */
            -webkit-font-smoothing: antialiased;
            /* Support for Safari and Chrome. */
            text-rendering: optimizeLegibility;

            /* Support for Firefox. */
            -moz-osx-font-smoothing: grayscale;

            /* Support for IE. */
            font-feature-settings: 'liga';
        }
        .icon.loading{
            opacity: 0;
        }

        button.container:hover .icon,
        button.container:focus .icon{
            box-shadow: inset 0 0 0 calc(var(--size) / 2) rgba(0, 0, 0, 0.1);
        }

        .label{
            color: var(--text);
        }
    `}customElements.define("icon-label",Ce);class Ae extends _e{static properties={uuid:{type:String},value:{type:String,state:!0},_iframeLoading:{state:!0},_templates:{type:Array,state:!0}};static key="template";static defaultValue="";getChip(){return!!this.value&&{label:this.value,icon:"dashboard",color:"#C60295"}}constructor(){super(),this._iframeLoading=!0,this._templates=[],this._getTemplates()}async _getTemplates(){this._templates=await ge("/popbot/v1/templates"),this.requestUpdate()}async _chooseTemplate(){this.renderRoot.getElementById("changeTemplatePanel").choose().then((e=>{e.length>0&&(this.value=e[0],this.requestUpdate("value"))})).catch((()=>{}))}_getEditorURL(e){let t=`${window.popbot.admin_url}post.php?post=${window.popbot.post_id}&action=edit`;return e&&(t+="&panelmode=true"),t}_openInFullEditor(){window.open(this._getEditorURL(!1),"_blank").focus()}async save(){this.renderRoot.querySelector(".editor")?.contentWindow?.wp?.data?.dispatch("core/editor")?.savePost(),super.save()}render(){return L`
            <off-canvas id="panel" header="Customise Appearance">
                
                <div class="container">
                    <panel-select id="changeTemplatePanel" max="1" header="Choose a Template">
                        ${ue(this._templates,(e=>e.slug),(e=>L`<partial-template key="${e.slug}" .template="${e}"></partial-template>`))}
                    </panel-select>

                    <div class="loading" ?hidden="${!this._iframeLoading}">
                        <div class="spinner"></div>
                        Loading...
                    </div>

                    <iframe class="editor" @load="${()=>this._iframeLoading=!1}" src="${this._getEditorURL(!0)}"></iframe>
                </div >


                <div slot="options" class="options">
                    <icon-button @click="${this._chooseTemplate}" secondary>Change Template</icon-button>
                    <tool-tip label="Open in Full Editor"><icon-label icon="open_in_new" button @click="${this._openInFullEditor}"></icon-label></tool-tip>
                
                    <icon-button id="button" @click="${this.save}">Save Changes</icon-button>
                </div>

            </off-canvas>
    `}static styles=r`
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
    `}customElements.define("panel-appearance",Ae);class Se extends oe{static properties={label:{},required:{type:Boolean},readonly:{type:Boolean},range:{},hideErrors:{type:Boolean,attribute:"hide-errors"},_value:{reflect:!0,attribute:"value"},_type:{attribute:"type"},_name:{attribute:"name"},_placeholder:{attribute:"placeholder"}};static formAssociated=!0;constructor(){super(),this._internals=this.attachInternals(),this._value="",this.addEventListener("focus",(e=>{this._onFocus()})),this.addEventListener("invalid",(e=>{e.preventDefault(),this._container.animate([{outline:"0px solid #fecdd3",borderColor:"#ADBAC2"},{offset:.2,borderColor:"#f43f5e"},{outline:"0.75rem solid transparent",borderColor:"#ADBAC2"}],300)}))}firstUpdated(){this._onInput(),this.setAttribute("tabindex",0)}get value(){return"string"==typeof this._value?this._value.trim():String(this._value).trim()}set value(e){this._value=e}get form(){return this._internals.form}get name(){return this._name}get type(){return this._type}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}get _input(){return this.renderRoot?.querySelector("#input")}get _container(){return this.renderRoot?.querySelector(".container")}_checkValidity(){return!this._input.willValidate&&this._input.validationMessage?(this._internals.setValidity({customError:!0},this._input.validationMessage),!1):this.required&&this._value.length<1?(this._internals.setValidity({customError:!0},"This field is required."),!1):(this._internals.setValidity({}),!0)}_onKeyDown(e){"Tab"==e.key&&"code"==this.type&&e.shiftKey&&(e.preventDefault(),e.target.setRangeText("\t",e.target.selectionStart,e.target.selectionStart,"end"))}_onInput(){this._value=this._input.value;const e=new CustomEvent("input",{bubbles:!0,cancelable:!1,detail:{input:this._input,value:this._input.value}});this.dispatchEvent(e),this._internals.setFormValue(this._value),this._checkValidity()}_onChange(){const e=new CustomEvent("change",{bubbles:!0,cancelable:!1,detail:{input:this._input,value:this._input.value}});this.dispatchEvent(e)}_onFocus(){this._input.focus()}_copyToClipboard(){navigator.clipboard.writeText(this.value).then((()=>{ve("Copied to clipboard")}))}render(){return"textarea"==this.type||"code"==this.type?this.renderTextarea():L`
            <label class="container">
                <div class="input-inline">
                    <input id="input" class="input ${this._placeholder?"hasPlaceholder":null}" type="${this.type}" name="${this.name}" value="${this.value}" placeholder="${this._placeholder??this.label}" ?readonly="${this.readonly}" @input=${this._onInput} @change=${this._onChange} @keydown=${this._onKeyDown} />
                    
                    ${this.readonly?L`<wrd-icon icon="content_paste" button @click="${this._copyToClipboard}" style="margin-left: auto"></wrd-icon>`:null}
                </div>

                <div class="label">${this.label}</div>
            </label>

            ${this.hideErrors?null:L`<div class="error">${this.validationMessage}</div>`}
        `}renderTextarea(){return L`
            <label class="container">
                <div class="input-inline">
                    <textarea id="input" class="input" name="${this.name}" @input=${this._onInput} @change=${this._onChange} @keydown=${this._onKeyDown} ${"code"==this.type?'spellcheck="false"':null}>${this.value}</textarea>
                </div>

                <div class="label">${this.label}</div>
            </label>

            ${this.hideErrors?null:L`<div class="error">${this.validationMessage}</div>`}
        `}static styles=r`
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

        .input-inline{
            display: flex;
            align-items: center;
            gap: 1rem;
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
            flex-grow: 1;
        }
        .input::placeholder{
            color: transparent;
        }
        .input.hasPlaceholder::placeholder{
            color: #CBD5E1;
        }
        .input:focus{
            outline: none;
        }
        textarea.input{
            min-height: 8em;
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
    `}customElements.define("floating-input",Se);class Te extends _e{static key="trigger";static defaultValue={trigger:null,threshold:null};getChip(){return!!this.trigger&&{label:this.trigger.label,icon:this.trigger.icon,color:this.trigger.color}}firstUpdated(){this.renderRoot.querySelector(".options").addEventListener("change",(e=>{this.treshold=e.detail.value}))}_getTrigger(e){if(!window.popbot?.triggers||!window.popbot?.triggers?.length)return!1;for(let t of window.popbot.triggers)if(t.id==e)return t;return!1}get trigger(){return this._getTrigger(this.value.trigger)}set trigger(e){let t=this._getTrigger(e);if(!t)return!1;let i=t.options?.[0];this.value={trigger:t.id,threshold:i?.default??""}}get threshold(){return this.value.threshold}set threshold(e){this.value={...this.value,threshold:e},this.requestUpdate()}_getOptionsHTML(){if(!this.trigger?.options)return L`<div></div>`;var e={type:"text",value:"",placeholder:"",label:"Option",name:"trigger_threshold"};return this.trigger.options.map((t=>(t={...e,...t},this.threshold&&(t.value=this.threshold),L`<floating-input name="${t.name}" value="${t.value}" placeholder="${t.placeholder}" type="${t.type}" label="${t.label}" hide-errors></floating-input>`)))}render(){let e=(t=window.popbot.triggers,i="category",o=[],t&&t.length?(t.forEach((e=>{let t=!1;o.forEach((o=>{o.label==e[i]&&(o.items.push(e),t=!0)})),t||o.push({label:e[i],items:[e]})})),o):o);var t,i,o;return L`
            <off-canvas id="panel" header="Choose a Trigger">

                <p class="info">
                    When a trigger fires the PopBot will be displayed, so long as all conditions are met.
                </p>


                ${ue(e,(e=>e.label),(e=>L`
            
                <div class="group" style="--bg: ${e.items[0].color};">
                    <h3 class="groupTitle">
                        ${e.label}
                    </h3>

                    ${ue(e.items,(e=>e.id),(e=>L`

                        <button type="button" class="trigger ${e.id==this.trigger?.id?"selected":"unselected"}" @click="${()=>this.trigger=e.id}">
                            <icon-label icon="${e.icon}" label="${e.label}"></icon-label>
                        </button>

                    `))}

                </div>

                `))}


                <div slot="options" class="options">
                    ${this._getOptionsHTML()}
                
                    <icon-button id="button" @click=${this.save}>Save Changes</icon-button>
                </div>

            </off-canvas>
        `}static styles=r`
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

        .trigger icon-label{
            --fill: #fff;
            --bg: inherit;
            --gap: 1rem;

            font-weight: 500;
        }

        .trigger.selected icon-label{
            --bg: var(--selected);
            --text: var(--selected);
        }

        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }
    `}function*Me(e,t){if(void 0!==e){let i=0;for(const o of e)yield t(o,i++)}}customElements.define("panel-trigger",Te);class Pe extends _e{static properties={uuid:{type:String,state:!0,reflect:!0},value:{type:Object,reflect:!0},error:{type:String,state:!0}};static key=!1;static route="/popbot/v1/custom-conditions/";static defaultValue={title:"New Custom Condition",callback:"return 1;"};_onChange(e){this.value[e.target.name]=e.target.value,this.requestUpdate()}async save(){await super.save(),fe()}async delete(){this.uuid>0&&await ge(`/popbot/v1/custom-conditions/${this.uuid}`,{},"DELETE"),this._saveState(),this.close(),this.dispatchEvent(new CustomEvent("panel-interface-saved",{bubbles:!0,cancelable:!1})),fe(),ve("Condition deleted."),setTimeout((()=>this.remove()),501)}render(){return L`
            <off-canvas id="panel" header="Edit Custom Condition">
                <div class="wrapper">
                    <p class="info">
                        The value of the condition is evaluated on every page by the result of your callback function.
                    </p>

                    <div class="group">
                        <floating-input name="title" label="Condition Name" value="${this.value.title}" hide-errors @input="${this._onChange}"></floating-input>
                    </div>
                    
                    <div class="group">
                        <floating-input name="callback" label="Callback Function" type="code" value="${this.value.callback}" hide-errors @input="${this._onChange}"></floating-input>
                        
                        <p class="info">
                            This JavaScript code should return the value of the condition. True/false should be converted to 1/0 respectively.
                        </p>
                    </div>

                    <icon-button class="delete" @click="${this.delete}">Delete Condition</icon-button>
                </div>

                <div slot="options" class="options">
                    ${this.error?L`<div class="error">${this.error}</div>`:L`<div></div>`}

                    <icon-button id="button" @click=${this.save}>Save Changes</icon-button>
                </div>
            </off-canvas>
        `}static styles=r`
        .wrapper{
            display: grid;
            gap: 2.5rem;
            padding: 1.5rem;
        }

        floating-input{
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .info{
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: #586C77;
            margin: 0;
        }

        .info a{
            text-decoration: none;
            color: #D204B0;
        }
        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }

        .delete{
            --bg: #EF3838;
            --outline: #FFD2D2;
        }

        .error{
            border-radius: 0.2rem;
            background: #FFD2D2;

            color: #4E0C0C;
            font-size: 0.9rem;
            font-weight: 500;
            font-family: inherit;

            width: fit-content;
            padding: 0.5rem 1rem;
        }
    `}customElements.define("panel-custom-condition",Pe);class ze extends oe{static properties={customConditions:{type:Array}};constructor(){super(),this.getCustomConditions()}get opened(){return this.renderRoot.querySelector("#panel").opened}open(){return this.renderRoot.querySelector("#panel").open()}close(){return this.renderRoot.querySelector("#panel").close()}toggle(){return this.renderRoot.querySelector("#panel").toggle()}openPanelCustomCondition(e){let t=this.renderRoot.querySelector("#container"),i=t.querySelector(`panel-custom-condition[uuid="${e}"]`);if(i)return void i.open();let o=document.createElement("panel-custom-condition");o.uuid=e,o.addEventListener("panel-interface-saved",(()=>this.getCustomConditions())),t.appendChild(o),setTimeout((()=>o.open()),10)}async getCustomConditions(){console.log("Refreshing custom conditions"),this.customConditions=await ge("/popbot/v1/custom-conditions/")}render(){return L`
                <off-canvas id="panel" header="Custom Conditions">
                    <div class="wrapper">
                        ${this.customConditions?.length>0?L`
                        <p class="info">
                            You can create your own conditions to better track users for your specific use-case.
                        </p>

                        <div class="conditions">
                            ${Me(this.customConditions,(e=>L`<button class="condition" @click="${()=>this.openPanelCustomCondition(e.id)}">${e.title}</button>`))}
                            
                            <icon-label icon="add" label="Create new Condition" button class="add_condition" @click="${()=>this.openPanelCustomCondition(-1)}"></icon-label>
                        </div>
                    `:L`
                        <div class="empty">
                            <svg xmlns="http://www.w3.org/2000/svg" width="659.94066" height="352.68794" viewBox="0 0 659.94066 352.68794" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M283.26243,41.81055h-19.12891c-3.41455,0-6.19287-2.77832-6.19287-6.19287V6.19287c0-3.41455,2.77832-6.19287,6.19287-6.19287h19.12891c3.41455,0,6.19287,2.77832,6.19287,6.19287v29.4248c0,3.41455-2.77832,6.19287-6.19287,6.19287Z" fill="#e6e6e6"/><path d="M325.13255,41.81055h-19.12939c-3.41455,0-6.19287-2.77832-6.19287-6.19287V6.19287c0-3.41455,2.77832-6.19287,6.19287-6.19287h19.12939c3.41455,0,6.19287,2.77832,6.19287,6.19287v29.4248c0,3.41455-2.77832,6.19287-6.19287,6.19287Z" fill="#ccc"/><path d="M369.74778,41.81055h-19.12891c-3.41455,0-6.19287-2.77832-6.19287-6.19287V6.19287c0-3.41455,2.77832-6.19287,6.19287-6.19287h19.12891c3.41455,0,6.19287,2.77832,6.19287,6.19287v29.4248c0,3.41455-2.77832,6.19287-6.19287,6.19287Z" fill="#e6e6e6"/><path id="uuid-4d2d9b01-4014-4a15-9fb7-c70aeb2aff54-85" d="M160.48646,137.30461c3.31476-3.37331,7.74218-4.39732,9.88862-2.28744,2.14645,2.10988,1.19897,6.55405-2.11742,9.92811-1.30628,1.36597-2.92068,2.39926-4.70815,3.01339l-14.22526,14.11547-6.48169-6.81669,14.71174-13.19163c.58312-1.79847,1.58855-3.4311,2.93215-4.76121Z" fill="#a0616a"/><path d="M114.99227,125.65307l14.91486,33.08772,23.81675-12.8919,8.52358,4.52378s-19.46968,32.54975-32.80056,28.84439c-13.33088-3.70537-37.00308-37.30309-32.73793-47.67236,4.26514-10.36927,18.2833-5.89163,18.2833-5.89163Z" fill="#3f3d56"/><polyline points="530.94066 14.81055 566.14787 14.81055 579.94066 24.81055 543.98003 26.81055 530.94066 14.81055" fill="#e6e6e6"/><path d="M0,346.99941c0,.66003,.53003,1.19,1.19006,1.19H595.48004c.65997,0,1.19-.52997,1.19-1.19,0-.65997-.53003-1.19-1.19-1.19H1.19006c-.66003,0-1.19006,.53003-1.19006,1.19Z" fill="#3f3d56"/><path d="M602.09852,93.83746l13.85543,6.56339c-5.68289-7.93086-10.5797-20.31709-13.2013-30.17328-4.43872,9.18109-11.59408,20.41482-18.6768,27.12515l14.64366-3.76722c-9.02334,44.22323-42.96249,75.97114-81.82754,75.97115l-.55017,1.59735c40.59555-.00001,76.54359-31.30785,85.75672-77.31655Z" fill="#3f3d56"/><path d="M316.09852,70.83746l13.85543,6.56339c-5.68289-7.93086-10.5797-20.31709-13.2013-30.17328-4.43872,9.18109-11.59408,20.41482-18.6768,27.12515l14.64366-3.76722c-9.02334,44.22323-42.96249,75.97114-81.82754,75.97115l-.55017,1.59735c40.59555-.00001,76.54359-31.30785,85.75672-77.31655Z" fill="#3f3d56"/><g><path d="M528.61237,203.91895c-1.96642-2.34222-4.32152-3.93386-6.43633-4.54649l-24.87304-28.11738s-2.07728-26.17378-3.73911-35.31383c-1.66183-9.14005-12.87916-6.64731-12.87916-6.64731l1.24637,26.17378,7.06277,28.25106,29.1052,24.71004c.50827,.92595,1.13135,1.8515,1.87767,2.74043,3.54092,4.21745,8.34454,6.01337,10.72925,4.01125,2.38462-2.00212,1.4473-7.0441-2.09361-11.26156Z" fill="#ffb6b6"/><path d="M409.13359,203.91895c1.96642-2.34222,4.32152-3.93386,6.43633-4.54649l24.87304-28.11738s2.07728-26.17378,3.73911-35.31383c1.66183-9.14005,12.87916-6.64731,12.87916-6.64731l-1.24637,26.17378-7.06277,28.25106-29.1052,24.71004c-.50827,.92595-1.13135,1.8515-1.87767,2.74043-3.54092,4.21745-8.34454,6.01337-10.72925,4.01125-2.38462-2.00212-1.4473-7.0441,2.09361-11.26156Z" fill="#ffb6b6"/><polygon points="463.85872 125.76256 466.74402 114.67044 477.98426 114.12977 481.34717 129.41989 463.85872 125.76256" fill="#ffb6b6"/><polygon points="463.85872 125.76256 466.74402 114.67044 477.98426 114.12977 481.34717 129.41989 463.85872 125.76256" opacity=".1"/><g><polygon points="435.15606 307.48163 424.62839 306.88021 426.00939 339.18953 433.14314 339.59753 435.15606 307.48163" fill="#ffb6b6"/><path d="M425.09709,328.97396l3.65553,1.66752-.00474,2.21591s.88192-2.56461,5.61584-3.12416l.56508,2.14847s1.836,2.10736,1.52109,5.91917l-1.20502,10.20785-3.5701-.0822-.57663-7.10316s-.98348-1.61184-5.51349,6.04724c0,0-4.99016,1.25773-12.71779-1.33333-1.06211-.35612-1.7999-1.34771-1.786-2.46785,.00767-.61816,.24929-1.18945,1.02444-1.39438,1.97309-.52164,3.89982,.13981,5.17402-1.43504,1.27419-1.57485,7.81777-11.26603,7.81777-11.26603Z" fill="#2f2e41"/></g><g><polygon points="491.65819 307.48163 481.13051 306.88021 482.51152 339.18953 489.64527 339.59753 491.65819 307.48163" fill="#ffb6b6"/><path d="M481.59922,328.97396l3.65553,1.66752-.00474,2.21591s.88192-2.56461,5.61584-3.12416l.56508,2.14847s1.836,2.10736,1.52109,5.91917l-1.20502,10.20785-3.5701-.0822-.57663-7.10316s-.98348-1.61184-5.51349,6.04724c0,0-4.99016,1.25773-12.71779-1.33333-1.06211-.35612-1.7999-1.34771-1.786-2.46785,.00767-.61816,.24929-1.18945,1.02444-1.39438,1.97309-.52164,3.89982,.13981,5.17402-1.43504,1.27419-1.57485,7.81777-11.26603,7.81777-11.26603Z" fill="#2f2e41"/></g><circle cx="472.50084" cy="108.73892" r="12.4637" fill="#ffb6b6"/><path d="M479.56879,110.81081s-5.47986-8.96632-10.96523-7.97667-8.34493,1.88317-8.34493,1.88317c0,0-2.23377-7.14889,5.26573-10.57871,0,0-10.61309-8.8859,.6981-14.58858s18.34986-.17586,18.34986-.17586c0,0,9.36195,7.93962-1.01783,15.28744,0,0,8.98381,10.23351-.09001,20.00884,0,0,1.60185-7.44336-.57721-5.91743-2.17907,1.52593-3.31847,2.0578-3.31847,2.0578Z" fill="#2f2e41"/><path d="M480.89245,126.59347l-17.03373-2.07728-13.08689,10.59415s-6.50863,18.13482-1.66183,29.08198c.11614,.26232,.20773,18.48783,.20773,18.48783h36.19054s-.03506-12.40528,1.34779-16.89822c.19755-.64185,.42404-1.12222,.6837-1.38188,2.07728-2.07728,7.06277-15.3719,4.57002-21.1883-2.49274-5.8164-11.21733-16.61827-11.21733-16.61827Z" fill="#e6e6e6"/><polygon points="449.11001 181.84923 426.25988 254.55417 421.2744 311.88721 435.19221 311.88721 447.03272 258.70874 463.33859 227.92568 479.43835 316.04177 493.48701 316.04177 493.14843 196.80567 485.47883 181.84923 449.11001 181.84923" fill="#2f2e41"/><circle cx="468.50206" cy="215.37449" r="55.87433" fill="#c60295"/></g><g><polygon points="108.4523 346.16934 119.32763 346.16828 124.50109 304.22009 108.45012 304.22122 108.4523 346.16934" fill="#a0616a"/><path d="M145.71256,345.92263h0c.33862,.5703,.51729,2.41097,.51729,3.07418h0c0,2.03853-1.65253,3.69113-3.69113,3.69113h-33.67964c-1.39068,0-2.51811-1.12736-2.51811-2.51811v-1.40219s-1.6661-4.21431,1.7641-9.40869c0,0,4.26328,4.06727,10.63372-2.30317l1.87859-3.4032,13.59838,9.94517,7.53738,.92778c1.64902,.20296,3.11104-.0315,3.95927,1.39709h.00013Z" fill="#2f2e41"/></g><polygon points="116.68168 127.77635 116.90165 113.10805 107.85614 107.46941 98.02023 119.50086 116.68168 127.77635" fill="#a0616a"/><polygon points="116.68168 127.77635 117.26716 113.47355 107.85614 107.46941 111.05354 125.16978 116.68168 127.77635" opacity=".1"/><circle cx="116.70989" cy="101.58551" r="16.08704" fill="#a0616a"/><path d="M138.64931,224.77043l-14.98579,101.97645h-18.80168l2.50008-58.21065,1.31582-30.60755-3.81589-14.5691s-1.73982-3.23841-3.2055-7.16395c-1.65208-4.42994-2.95694-9.74075-1.01976-12.2591,.71274-.9284,2.56587-1.61556,5.08419-2.12725,1.53879-.31433,3.32979-.55924,5.26331-.74928,11.11872-1.10018,26.93421-.41302,26.93421-.41302l.40205,13.2679,.22298,7.40883,.10599,3.44673Z" fill="#2f2e41"/><g><polygon points="89.29503 341.18207 100.05485 342.76292 111.27495 302.01338 95.39452 299.67977 89.29503 341.18207" fill="#a0616a"/><path d="M126.19489,346.35776h0c.25206,.61349,.1611,2.46057,.06463,3.11673h0c-.29652,2.01685-2.17186,3.4115-4.18878,3.11497l-33.32144-4.89894c-1.37589-.20228-2.32734-1.48165-2.12505-2.8576l.20396-1.38728s-1.03538-4.41184,3.1139-9.05202c0,0,3.62633,4.64414,10.85564-.73192l2.35363-3.09375,12.00716,11.81738,7.32226,2.01428c1.60196,.44066,3.08253,.42136,3.71395,1.95814l.00013,.00002Z" fill="#2f2e41"/></g><path d="M138.88517,207.76361l-2.05544,17.70145-11.20934,37.30172-18.45243,61.41143-18.59965-2.73338,16.69297-87.31793-1.65286-14.97266s-.53828-1.4883-1.15531-3.66717c-1.22475-4.31057-2.76087-11.33033-1.07089-14.91107,.22819-.48675,.51466-.90908,.86904-1.25104,.6647-.64462,2.01566-1.03607,3.82564-1.24371,7.56538-.85504,23.14582,1.59052,30.07871,2.79103l2.72954,6.89131Z" fill="#2f2e41"/><path d="M100.08833,116.39761l18.27535,8.77217s19.37187,57.3846,19.37187,60.30865c0,2.92406,5.4826,4.75159,2.19304,8.04115-3.28956,3.28956,6.12278,6.07547,1.0511,8.7031s-36.70961,17.00037-40.2276,15.70427c-9.7028-3.57472,.41117-16.71013,.41117-16.71013,0,0-7.28855-5.8697-6.19203-8.79375s-6.57913-58.84663-6.57913-58.84663l11.69622-17.17883Z" fill="#3f3d56"/><path d="M115.72746,105.43864l2.06912,4.13825s2.06912-7.44885,5.37972-9.10415c3.3106-1.6553,3.72442-4.13825,3.72442-4.13825,0,0,4.13825,5.37972,7.03502,4.13825,2.89677-1.24147,4.13825-2.06912,.82765-7.03502s-2.48295-2.48295-2.48295-2.48295c0,0-2.89677-4.13825-2.48295-2.89677,.41382,1.24147-2.48295-3.3106-2.48295-2.06912,0,1.24147-2.06912-2.48295-2.06912-1.24147,0,1.24147-8.69032-2.89677-7.44885-1.24147s-7.44885-3.3106-11.5871,3.3106c-4.13825,6.6212-9.8764,5.39674-7.83498,9.52648s1.21378,15.30301,1.21378,15.30301h5.7072s5.8799-11.17327,10.43197-6.20737Z" fill="#2f2e41"/><rect x="545.94066" y="24.81055" width="34" height="34" fill="#e6e6e6"/><path d="M659.94062,24.81055h.00003V58.81055h-34v-.00003c0-18.76509,15.23487-33.99997,33.99997-33.99997Z" fill="#e6e6e6"/><circle cx="602.94066" cy="42.81055" r="16" fill="#ccc"/><polyline points="545.94066 24.81055 530.94066 14.81055 530.94066 41.81055 545.94066 58.81055" fill="#f2f2f2"/><path d="M306.08532,13.76915l18.80925-.56863c1.30636-.03949,1.4317-2.08292,.11345-2.04307l-18.80925,.56863c-1.30636,.03949-1.4317,2.08292-.11345,2.04307h0Z" fill="#fff"/><path d="M306.08532,20.63306l18.80925-.56863c1.30636-.03949,1.4317-2.08292,.11345-2.04307l-18.80925,.56863c-1.30636,.03949-1.4317,2.08292-.11345,2.04307h0Z" fill="#fff"/><path d="M306.08532,27.49696l18.80925-.56863c1.30636-.03949,1.4317-2.08292,.11345-2.04307l-18.80925,.56863c-1.30636,.03949-1.4317,2.08292-.11345,2.04307h0Z" fill="#fff"/><path d="M263.83552,15.50926c3.1169-3.79637,8.75741,.01334,12.42558,.65665,2.14574,.37631,4.36044,.17766,6.1721-1.12305,1.60417-1.15174,2.75531-2.88544,3.05969-4.84883,.20097-1.2964-1.7829-1.85502-1.98562-.54741-.28628,1.84668-1.42513,3.46385-3.15666,4.23137-2.08975,.92632-4.48729,.18016-6.52072-.52759-3.62541-1.26184-8.52229-2.86366-11.45043,.7028-.83443,1.01633,.61426,2.48136,1.45605,1.45605h0Z" fill="#fff"/><path d="M263.83552,23.74595c3.1169-3.79637,8.75741,.01334,12.42558,.65665,2.14574,.37631,4.36044,.17766,6.1721-1.12305,1.60417-1.15174,2.75531-2.88544,3.05969-4.84883,.20097-1.2964-1.7829-1.85502-1.98562-.54741-.28628,1.84668-1.42513,3.46385-3.15666,4.23137-2.08975,.92632-4.48729,.18016-6.52072-.52759-3.62541-1.26184-8.52229-2.86366-11.45043,.7028-.83443,1.01633,.61426,2.48136,1.45605,1.45605h0Z" fill="#fff"/><path d="M209.16136,193.31055h-47.44141c-3.13916,0-5.69287-2.55371-5.69287-5.69336V120.00391c0-3.13965,2.55371-5.69336,5.69287-5.69336h47.44141c3.13916,0,5.69287,2.55371,5.69287,5.69336v67.61328c0,3.13965-2.55371,5.69336-5.69287,5.69336Z" fill="#c60295"/><path d="M352.0668,8.84107c.99094,8.38935,1.31299,16.85185,.9268,25.29134-.05985,1.30796,1.97152,1.65634,2.03208,.3329,.39475-8.6265,.10216-17.26688-.91089-25.84344-.15516-1.31362-2.20399-1.10148-2.04799,.2192h0Z" fill="#fff"/><path d="M358.9307,8.84107c.99094,8.38935,1.31299,16.85185,.9268,25.29134-.05985,1.30796,1.97152,1.65634,2.03208,.3329,.39475-8.6265,.10216-17.26688-.91089-25.84344-.15516-1.31362-2.20399-1.10148-2.04799,.2192h0Z" fill="#fff"/><path d="M365.79461,8.84107c.99094,8.38935,1.31299,16.85185,.9268,25.29134-.05985,1.30796,1.97152,1.65634,2.03208,.3329,.39475-8.6265,.10216-17.26688-.91089-25.84344-.15516-1.31362-2.20399-1.10148-2.04799,.2192h0Z" fill="#fff"/><g><path id="uuid-264cfc9b-ec7b-45c7-b901-d09aac5ec40c-86" d="M155.77513,166.96237c4.53556-1.33997,8.90339-.08589,9.75568,2.80071,.85229,2.8866-2.13351,6.31199-6.67086,7.65183-1.80515,.56007-3.71817,.6797-5.57902,.34887l-19.28905,5.4348-2.35746-9.10615,19.26587-4.39097c1.38288-1.28925,3.05446-2.2285,4.87483-2.7391Z" fill="#a0616a"/><path d="M121.65775,134.69035l-3.02326,36.16781,27.08051,.29119,5.25571,8.0928s-32.82312,19.00521-42.67896,9.29416c-9.85585-9.71105-14.24118-50.57605-5.47848-57.57094,8.7627-6.99488,18.84449,3.72498,18.84449,3.72498Z" fill="#3f3d56"/></g><path d="M166.755,140.08626l37.08585-1.12115c2.57572-.07787,2.82286-4.10685,.22369-4.02828l-37.08585,1.12115c-2.57572,.07787-2.82286,4.10685-.22369,4.02828h0Z" fill="#fff"/><path d="M166.755,153.53454l37.08585-1.12115c2.57572-.07787,2.82286-4.10685,.22369-4.02828l-37.08585,1.12115c-2.57572,.07787-2.82286,4.10685-.22369,4.02828h0Z" fill="#fff"/><path d="M166.755,166.98281l37.08585-1.12115c2.57572-.07787,2.82286-4.10685,.22369-4.02828l-37.08585,1.12115c-2.57572,.07787-2.82286,4.10685-.22369,4.02828h0Z" fill="#fff"/></svg>
                            <h3>Custom Conditions</h3>
                            <p>Custom conditions let you tailor your PopBots to your specific website. You can use JavaScript to return any value you'd like on every page and compare against it.</p>

                            <icon-button @click="${()=>this.openPanelCustomCondition(-1)}">Create new Condition</icon-button>
                        </div>
                    `}
                    </div>

                    <div id="container">
                    </div>
            </off-canvas>
        `}static styles=r`
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

        .conditions{
            display: grid;
            gap: 1rem;
        }

        .condition{
            background: none;
            border-radius: 10rem;
            border: 1px solid #e2e8f0;

            margin: 0;
            padding: 0.5rem 1rem;

            font-size: 1rem;
            font-family: inherit;
            font-weight: 500;
            color: #0f172a;

            cursor: pointer;
            transition: background 0.2s ease;
        }
        .condition:hover{
            background: #f8fafc;
        }

        .empty{
            text-align: center;
            margin-top: 3rem;
        }
        .empty svg{
            width: 60%;
            height: auto;
            margin-bottom: 2rem;
        }
        .empty h3{
            font-size: 1.5rem;
            font-weight: 500;
            color: #0F172A;
            margin: 0;
            margin-bottom: 0.5rem;
        }
        .empty p{
            color: #334155;
            font-weight: 400;
            font-size: 1rem;
            margin: 2rem;
            margin-top: 0;
        }
        .empty icon-button{
            margin: 0 auto;
        }
    `}customElements.define("panel-custom-conditions",ze);const Oe=(e,t)=>e.map((e=>L`<option value="${e.id}" ?selected=${t==e.id}>${e.label}</option>`));class De extends oe{static properties={condition:{relect:!0},comparison:{relect:!0},value:{relect:!0},error:{type:String,state:!0}};connectedCallback(){super.connectedCallback(),window.popbot.conditions.find((e=>e.id==this.condition))||(this.error=`Saved condition (${this.condition}) could not be found.`)}_onUpdateValue(e){let t=this.renderRoot.querySelector(`[name="${e}"]`);if(!t)return;if(this[e]=t.value,"condition"==e){let e=window.popbot.conditions.find((e=>e.id==this.condition));e.options&&!e.options.find((e=>e.id==this.value))&&(this.value=e.options[0].id)}this.requestUpdate();const i=new CustomEvent("change",{bubbles:!0,cancelable:!0});this.dispatchEvent(i)}render(){let e=(t=window.popbot.conditions,i="category",o=[],t.forEach((e=>{let t=!1;o.forEach((o=>{o.label==e[i]&&(o.items.push(e),t=!0)})),t||o.push({label:e[i],items:[e]})})),o);var t,i,o;let s=window.popbot.conditions.find((e=>e.id==this.condition));return L`
            <div class="row">
                <select name="condition" @input="${()=>{this._onUpdateValue("condition")}}" @focus="${e=>this.requestUpdate()}">
                    <option disabled selected hidden>Select a Condition</option>
                    ${n=e,r=this.condition,n.map((e=>L`
            <optgroup label="${e.label}">
                ${e.items.map((e=>L`<option value="${e.id}" ?selected=${r==e.id}>${e.label}</option>`))}
            </optgroup>
        `))}
                </select>

                <select name="comparison" @input="${()=>{this._onUpdateValue("comparison")}}">
                    ${Oe(window.popbot.comparisons,this.comparison)}
                </select>

                ${s?.options?L`<select name="value" @input="${()=>{this._onUpdateValue("value")}}" .value="${this.value}">
                    ${Oe(s?.options,this.value)}
                    </select>`:L`<input name="value" @input="${()=>{this._onUpdateValue("value")}}" .value="${this.value}" placeholder="Value" />`}
            </div>
            
            <output class="error">
                ${this.error}
            </output>
        `;var n,r}static styles=r`
        :host{
            display: block;

            --border: #ADBAC2;

            --primary: #D204B0;
            --highlight: #FFEFFC;
        }

        .row{
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .error:not(:empty){
            display: block; 
            margin-top: 0.5rem;
            font-size: small;
            color: var(--error-700);
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
    `}customElements.define("condition-rule",De);class Re extends _e{static properties={uuid:{type:String},value:{type:Array,state:!0}};static key="conditions";static defaultValue=[];getChip(){return!(!this.value||!this.value.length)&&{label:`${this.value.length} Conditions`,icon:"task_alt",color:"#C60295"}}connectedCallback(){super.connectedCallback(),this.renderRoot.addEventListener("change",this._onChange.bind(this))}_onChange(e){let t=[];this.renderRoot.querySelectorAll("condition-rule").forEach((e=>{t.push({condition:e.condition,comparison:e.comparison,value:e.value})})),this.value=t,this.requestUpdate()}remove(){this.value.pop(),this.requestUpdate()}add(){this.value=[...this.value,{condition:"url.href",comparison:"equal",value:""}]}openPanelCustomConditions(){this.renderRoot?.querySelector("#customConditions")?.open()}render(){return L`
            <off-canvas id="panel" header="Manage Conditions">
                <div class="wrapper">
                    <p class="info">
                        The PopBot will display when the Trigger fires and all these conditions are met.
                    </p>

                    ${this.value.map((e=>L`<condition-rule condition="${e.condition}" comparison="${e.comparison}" value="${e.value}"></condition-rule>`))}

                    <icon-label class="remove" icon="remove" button @click=${this.remove}></icon-label>
        
                    <icon-label class="add" icon="add" button @click=${this.add}></icon-label>

                </div>

                <div slot="options" class="options">
                    <icon-button secondary id="button" @click=${this.openPanelCustomConditions}>Custom Conditions</icon-button>
                    <icon-button id="button" @click=${this.save}>Save Changes</icon-button>
                </div>

                <panel-custom-conditions id="customConditions"></panel-custom-conditions>
            </off-canvas>
    `}static styles=r`
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

        condition-rule{
            margin-bottom: 1.5rem;
        }

        .options{
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }
    `}customElements.define("panel-conditions",Re);class Ue extends oe{static properties={value:{type:Date,converter:{fromAttribute:(e,t)=>e?new Date(e):null,toAttribute:(e,t)=>e?`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}Z`:""}},label:{},name:{},_shownMonth:{type:Number,state:!0},_shownYear:{type:Number,state:!0}};connectedCallback(){super.connectedCallback();const e=this.value??new Date;this._shownMonth=e.getMonth(),this._shownYear=e.getFullYear()}_formDateDisplay(e){return e?`${this._formatOrdinalSuffix(e.getDate())} ${this._formatMonthName(e.getMonth(),!0)}, ${e.getFullYear()}`:"-"}_formatOrdinalSuffix(e){var t=e%10,i=e%100;return 1==t&&11!=i?e+"st":2==t&&12!=i?e+"nd":3==t&&13!=i?e+"rd":e+"th"}_formatMonthName(e,t=!1){return t?["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][e]:["January","February","March","April","May","June","July","August","September","October","November","December"][e]}_formatWeekdayName(e){return["Mo","Tu","We","Th","Fr","Sa","Su"][e]}_getDaysInMonth(e,t){return new Date(t,e+1,0).getDate()}set(e){this.value=e,this.dispatchEvent(new Event("date-picker-change"))}changeMonth(e){this._shownMonth+=e,this._shownMonth<0&&(this._shownMonth=11,this._shownYear--),this._shownMonth>11&&(this._shownMonth=0,this._shownYear++)}reset(){this.set(null)}_renderMonth(e,t){const i=e=>(e.getDay()+6)%7,o=(e,t)=>!(!e||!t)&&e.getFullYear()==t.getFullYear()&&e.getMonth()==t.getMonth()&&e.getDate()==t.getDate(),s=t=>{let i="";return n.getMonth()!=e&&(i+="out-of-month "),o(n,new Date)&&(i+="today "),o(n,this.value)&&(i+="selected "),i};let n=new Date(t,e),r=[];const a=this._getDaysInMonth(e,t),l=Math.ceil((a+i(n))/7);n.setDate(n.getDate()-i(n));let c=[];for(let e=0;e<7;e++)c.push(L`<td class="weekday">${this._formatWeekdayName(e)}</td>`);r.push(L`<tr class="weekdays">${c}</tr>`);for(let e=0;e<l;e++){let e=[];for(let t=0;t<7;t++){let t=new Date(n.getTime());e.push(L`
                        <td class="dateWrapper ${s()}" @click="${()=>{this.set(t)}}">
                            <div class="date">
                                ${n.getDate()}
                            </div>
                        </td>`),n.setDate(n.getDate()+1)}r.push(L`<tr class="week">${e}</tr>`)}return L`<table class="month">${r}</table>`}render(){return L`
            <tool-tip mode = "dropdown">
                <div class="btn" role="button">
                    <div class="label">${this.label}</div>

                    <div class="value">${this._formDateDisplay(this.value)}</div>
                </div>

                <div class="calendar" slot="tooltip">
                    <div class="header">
                        <h4 class="title">
                            ${this._formatMonthName(this._shownMonth)}, ${this._shownYear}
                        </h4>

                        <div class="controls">
                            <icon-label icon="chevron_left" button @click="${()=>this.changeMonth(-1)}"></icon-label>
                            <icon-label icon="chevron_right" button @click="${()=>this.changeMonth(1)}"></icon-label>
                        </div>
                    </div>

                    ${this._renderMonth(this._shownMonth,this._shownYear)}

                    <button class="reset" type="button" @click="${this.reset}">Reset</button>
                </div>
            </tool-tip>
            `}static styles=r`
        .btn{
            --bg: #f1f5f9;
            --text-strong: #0f172a;
            --text-subtle: #64748b;

            background: var(--bg);
            border-radius: 0.5rem;

            padding: 1.5rem;

            cursor: pointer;
            transition: background 200ms ease;
        }
        .btn:hover{
            --bg: #FFEFFC;
            --text-strong: #64024C;
            --text-subtle: #64024C;
        }
        .label{
            font-size: 0.8rem;
            color: var(--text-subtle);
            font-weight: 400;

            transition: color 200ms ease;
        }
        .value{
            color: var(--text-strong);
            font-weight: 500;

            transition: color 200ms ease;
        }


        .calendar{
            padding: 0.5rem;
        }
        .header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;

            padding: 0 0.5rem;
        }
        .title{
            margin: 0;
            font-weight: 500;
            font-size: inherit;
        }
        .controls{
            display: flex;
            gap: 0.5rem;
        }


        .month{
            width: 100%;
            border-collapse: collapse;
            border: none;
        }
        .weekdays{

        }
        .weekday{
            text-align: center;
            color: #64748b;

            padding: 0.5rem;
        }

        .week{
            
        }
        .dateWrapper{
            cursor: pointer;

            --text: #0f172a;
            --bg: #fff;
            --border: #fff;
        }
        .dateWrapper.out-of-month{
            opacity: 0;
            pointer-events: none;
        }
        .dateWrapper:hover{
            --bg: #FFEFFC;
            -text: #8E0076;
        }
        .dateWrapper.selected{
            --text: #fff;
            --bg: #8E0076;
        }
        .dateWrapper.today{
            --border: #8E0076;
        }
        .date{
            background: var(--bg);
            color: var(--text);
            border: 1px solid var(--border);

            transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

            display: flex;
            align-items: center;
            justify-content: center;
            width: 3rem;
            height: 3rem;

            border-radius: 5rem;
        }


        .reset{
            background: none;
            border: none;

            display: block;
            width: fit-content;
            padding: 0.5rem;
            margin: 0;

            cursor: pointer;
            transition: color 0.2s ease;

            font-size: 1rem;
            font-weight: 400;
            font-family: inherit;
            color: #D204B0;
        }
        .reset:hover{
            color: #8E0076;
        }
    `}customElements.define("date-picker",Ue);class Le extends _e{static properties={value:{type:Object,reflect:!0},uuid:{type:String}};static key="visibility";static defaultValue={visibility:"public",start:null,end:null};getChip(){return"public"!=this.value.visibility&&{label:this.value.visibility,icon:"visibility",color:"#C60295"}}_onChange(e){this.value[e.target.name]=e.target.value}_setVisibility(e){this.value.visibility=e,this.requestUpdate()}render(){return L`
            <off-canvas id="panel" header="Schedule Visibility">
                <div class="wrapper">

                    <h3>Visibility</h3>

                    <div class="col">
                        <button class="visibility ${"public"==this.value.visibility?"selected":null}" type="button" @click="${()=>this._setVisibility("public")}">
                            <wrd-icon icon="public"></wrd-icon>
                            <div>    
                                <h4>Public</h4>
                                <p>All visitors to your website can see your PopBot.</p>
                            </div>
                        </button>

                        <button class="visibility ${"private"==this.value.visibility?"selected":null}" type="button" @click="${()=>this._setVisibility("private")}">
                            <wrd-icon icon="lock"></wrd-icon>
                            <div>
                                <h4>Private</h4>
                                <p>Only users logged into WordPress will see your PopBot.</p>
                            </div>
                        </button>

                        <button class="visibility ${"hidden"==this.value.visibility?"selected":null}" type="button" @click="${()=>this._setVisibility("hidden")}">
                            <wrd-icon icon="visibility_off"></wrd-icon>
                            <div>    
                                <h4>Hidden</h4>
                                <p>This PopBot will not be shown to any users on your site.</p>
                            </div>
                        </button>
                    </div>

                
                    <h3>Schedule</h3>

                    <div class="row">
                        <date-picker label="From" name="start" value="${this.value.start}" change="${this._onChange}"></date-picker>
                        <date-picker label="To" name="end" value="${this.value.end}" change="${this._onChange}"></date-picker>
                    </div>

                </div>

                <div slot="options" class="options">
                    <icon-button id="button" @click=${this.save}>Save Changes</icon-button>
                </div>
            </off-canvas>
        `}static styles=r`
        .wrapper{
            padding: 1.5rem;
        }

        h3{
            margin: 0;
            margin-bottom: 1rem;
            font-weight: 500;
            font-size: 1.35rem;
            color: #0f172a;
        }

        .row{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .col{
            display: grid;
            gap: 1.5rem;

            margin-bottom: 5rem;
        }

        .visibility{
            --bg: #f1f5f9;
            --text: #0f172a;
            --icon: #64748b;

            background: var(--bg);
            color: var(--text);

            text-align: left;
            font-family: inherit;
            border: 0.2rem solid var(--bg);
            border-radius: 0.5rem;

            cursor: pointer;
            transition: all 0.2s ease;

            display: flex;
            width: 100%;
            align-items: center;
            gap: 0.5rem;
            
            padding: 1rem;
        }
        .visibility wrd-icon{
            --size: 72px;
            --fill: var(--icon);
        }
        .visibility h4{
            margin: 0;
            margin-bottom: 0.25rem;

            font-weight: 500;
            font-size: 1.2rem;
            color: inherit;
        }
        .visibility p{
            color: inherit;
            font-size: 1rem;
            line-height: 1.5;
            font-weight: 400;
            margin: 0;
        }

        .visibility.selected{
            --bg: #FFEFFC;
            --text: #8E0076;
            --icon: #D204B0;

            border-left-color: #D204B0;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        .options{
            display: flex;
            justify-content: end;
        }
    `}customElements.define("panel-visibility",Le);class Fe extends oe{static properties={icon:{},label:{},href:{}};constructor(){super(),this.addEventListener("panel-interface-saved",(()=>this.requestUpdate())),this.addEventListener("panel-interface-loaded",(()=>this.requestUpdate()))}connectedCallback(){super.connectedCallback(),this.requestUpdate()}_onSlotChange(){this.requestUpdate()}get chip(){if(this.panel?.getChip)return this.panel.getChip()}get children(){const e=this.renderRoot.querySelector("#slot");return e?e.assignedElements({flatten:!0}):[]}get panel(){for(const e of this.children)if("function"==typeof e.open)return e;return null}open(){this.href?window.open(this.href,"_blank"):this.panel?.open()}render(){return L`
            <button class="button" type="button" role="button" @click="${this.open}">
                <icon-label class="icon" icon="${this.icon}" label="${this.label}"></icon-label>

                ${this.chip?L`<icon-label class="chip" icon="${this.chip.icon}" label="${this.chip.label}" style="background-color: ${this.chip.color}"></icon-label>`:null}
                
                <icon-label class="arrow" icon="${this.href?"open_in_new":"arrow_forward"}"></icon-label>
            </button>

            <slot id="slot" @slotchange="${this._onSlotChange}"></slot>
        `}static styles=r`
        :host{
            display: block;
            border-top: 1px solid #F1F5F9;
        }
        :host(:first-child){
            border-top: 0;
        }

        .button{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-wrap: wrap;
            gap: 1rem;
            width: 100%;

            border: none;
            background: none;
            font-size: 1.2rem;
            font-weight: 500;
            font-family: inherit;
            margin: 0;
            padding: 1rem 1.5rem;

            cursor: pointer;
        }

        .icon{
            flex: 1;
        }
        .icon, .arrow{
            --fill: #94A3B8;
        }
        .button:hover .icon{
            --bg: #F1F5F9;
        }

        .chip{
            --size: 32px;
            --fill: #fff;
            --text: #fff;

            display: none;
            
            border-radius: 5rem;
            padding-left: 0.25rem;
            padding-right: 0.75rem;
            font-size: 0.8rem;
            text-transform: capitalize;
        }

        @media (min-width: 600px){
            .chip{
                display: block;
            }
        }
    `}customElements.define("panel-opener",Fe);class Be extends oe{static properties={back:{type:Boolean},label:{}};render(){return L`
            <header class="header">
                    ${this.back?L`
                        <a href="${window.popbot.plugin_url}">
                            <icon-label icon="arrow_back" button></icon-label>
                        </a>`:null}
            
                    <h1 class="title">
                        <slot name="title"></slot>
                        ${this.label}
                    </h1>

                    <div class="actions">
                        <slot></slot>
                    </div>
            </header>
        `}static styles=r`
        .header{
            position: sticky;
            top: 32px;
            z-index: 10;

            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 1.5rem;
            align-items: center;
            padding: 0 5vw;

            height: 85px;
            overflow: hidden;

            background: white;
            box-shadow: 0 10px 15px -3px rgb(254 206 246 / 0.3), 0 4px 6px -4px rgb(254 206 246 / 0.3);
        }

        @media screen and (max-width: 782px){
            .header{
                top: 46px;
            }
        }

        @media screen and (max-width: 600px){
            .header{
                top: 0;
            }
        }

        .title{
            font-size: 1.25rem;
            line-height: 1.75rem;
            font-weight: 500;
            color: rgb(15 23 42);
        }

        .actions{
            display: none;
        }

        @media (min-width: 726px){
            .actions{
                display: flex;
                gap: 0.5rem;
                margin-left: auto;
            }
        }
    `}customElements.define("nav-bar",Be);class qe extends oe{static properties={uuid:{type:String},value:{type:String,reflect:!0},saving:{state:!0}};connectedCallback(){super.connectedCallback(),this._getServerValue()}firstUpdated(){super.firstUpdated(),this.resize()}focus(){this.renderRoot?.querySelector("#input").focus()}async save(){this.saving=!0,(await ge(`/popbot/v1/popbots/${this.uuid}`,{title:this.value},"POST")).uuid?ve("Saved."):ve("An error occured."),this.saving=!1}async _getServerValue(){const e=await ge(`/popbot/v1/popbots/${this.uuid}`,{_fields:"title"});this.value=e.title}_onBlur(e){this.save()}_onInput(e){this.value=e.target.value,this.resize()}_onFocus(e){this.resize()}resize(){const e=this.renderRoot.querySelector(".input"),t=this.renderRoot.querySelector(".sizer"),i=this.renderRoot.querySelector(".border"),o=window.getComputedStyle(t);t.textContent=e.value,i.style.width=o.width}render(){return L`
        <div class="container ${this.saving?"saving":null}">
            <input class="input" @blur="${this._onBlur}" @focus="${this._onFocus}" @input="${this._onInput}" .value="${this.value||""}"/>
            <div class="border"></div>
        </div>

        <div class="sizer"></div>
        `}static styles=r`
        :host{
            display: block;
        }

        .container{
            position: relative;
        }

        .sizer{
            position: absolute;
            top: 0;
            left: -99999px;
            height: 0;
            overflow: hidden;
            visibility: hidden;
            white-space: nowrap;
        }
        .sizer, .input{
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            color: inherit;
        }

        .input{
            display: block;
            width: 100%;

            border: none;
            padding: 0px;
            margin: 0px;
            background: none;
        }
        .input:focus,
        .input:focus-visible{
            outline: none;
        }

        .border{
            position: absolute;
            bottom: 0;
            top: -0.25rem;
            left: -0.5rem;
            box-sizing: content-box;
            min-width: 5ch;
            padding: 0.25rem 0.5rem;
            height: 100%;
            border: 1px solid transparent;
            border-radius: 0.2rem;
            pointer-events: none;
            outline: 0px solid var(--theme-100);
            transition: all 0.2s ease;
        }
        .container:hover .border{
            border-color: var(--gray-300);
        }
        .container:focus-within .border{
            outline: 5px solid var(--theme-100);
            border-color: var(--theme-500);
        }
        
    `}customElements.define("inline-editable",qe);class Ne extends oe{static properties={post:{type:Number},taxonomy:{type:String},postType:{type:String,statu:!0,attribute:"post-type"},allTags:{type:Array,state:!0},postTags:{type:Array,state:!0}};constructor(){super(),this.post=-1,this.taxonomy="popbot_tag",this.postType="popbot",this.allTags=[],this.postTags=[],this.tags=[]}async connectedCallback(){super.connectedCallback(),this._getTags()}async _getTags(){this.allTags=await ge(`/wp/v2/${this.taxonomy}`),this.postTags=await ge(`/wp/v2/${this.taxonomy}`,{post:this.post})}_onKeyDown(e){"Enter"==e.key&&(this.createTag(e.target.value),e.target.value="")}async createTag(e){await ge(`/wp/v2/${this.taxonomy}`,{name:e},"POST"),this._getTags()}hasTag(e){return this.postTags.filter((t=>t.id==e.id)).length>0}toggleTag(e){this.hasTag(e)?this.removeTag(e):this.addTag(e)}addTag(e){this.hasTag(e)||(this.postTags.push(e),this.requestUpdate(),this._save())}removeTag(e){this.postTags=this.postTags.filter((t=>t.id!=e.id)),this._save()}async _save(){let e={},t=this.postTags.map((e=>e.id));e[this.taxonomy]=t,await ge(`/wp/v2/${this.postType}/${this.post}`,e,"POST")}render(){return L`
            <div class="container">
                ${ue(this.postTags,(e=>L`
                    <div class="tag" @click="${()=>{this.removeTag(e)}}">${e.name}</div> 
                `))}

                <tool-tip mode="dropdown">
                    <icon-label button class="add" icon="local_offer"></icon-label>

                    <div slot="tooltip" class="dropdown">
                        ${ue(this.allTags,(e=>L`
                            <div class="tag ${this.hasTag(e)?"before-check":"before-none"}" @click="${()=>{this.toggleTag(e)}}">${e.name}</div> 
                        `))}

                        <input placeholder="Add new tag" @keydown="${this._onKeyDown}">
                    </div>
                </tool-tip>
            </div>
        `}static styles=r`
        *{
            box-sizing: border-box;
        }

        .container{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5rem;
        }

        .tag{
            position: relative;
            padding: 0.2rem 0.75rem;
            
            font-size: 0.8rem;
            background: #f1f5f9;
            border-radius: 0.2rem;

            transition: background 0.2s ease;
            cursor: pointer;
        }
        .tag:hover{
            background: #e2e8f0;
        }

        .before-none::before,
        .before-check::before{
            content: '';

            position: absolute;
            left: -1.5rem;

            display: block;
            width: 1rem;
            height: 100%;

            text-align: center;
            font-weight: 500;
        }
        .before-check::before{
            content: '✓';
        }

        .dropdown{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            padding: 1.5rem 2rem;
        }

        input{
            width: 100%;
            min-width: 15ch;
            max-width: 75vw;
            margin: 0;
            margin-top: 0.5rem;
            padding: 0.3rem;

            border: none;
            border-radius: 0.2rem;
            border-bottom: 1px solid #94a3b8;
            background: #f8fafc;

            font-size: 0.8rem;
            font-family: inherit;
            font-weight: 400;

            transition: border-bottom-color 0.2s ease;
        }
        input:focus{
            outline: none;
            border-bottom-color: #C60295;
        }
    `}customElements.define("tag-picker",Ne);class He extends oe{static properties={uuid:{type:String},errors:{state:!0},scale:{type:Number},showControls:{attribute:"show-controls",type:Boolean},showErrors:{attribute:"show-errors",type:Boolean}};constructor(){super(),this.uuid=-1,this.showControls=!1,this.showErrors=!1,this.scale=1,this.errors=[],document.addEventListener("panel-interface-saved",(e=>{this.refreshPreview(),this.refreshErrors()}))}connectedCallback(){super.connectedCallback(),this.refreshErrors()}_onLoad(e){e.target.classList.remove("loading")}_getURL(e=this.scale){return`${window.popbot.home_url}/popBotPreview?post=${this.uuid}&scale=${e}`}refreshPreview(){let e=this.renderRoot.querySelector("iframe");e.classList.add("loading"),e.contentWindow.location.reload()}openInNewTab(){window.open(this._getURL(1),"_blank").focus()}async refreshErrors(){const e=await ge(`/popbot/v1/popbots/${this.uuid}`,{_fields:"errors"});this.errors=e.errors}render(){return L`
            <div class="container">
                <div class="iframeWrapper">
                    <iframe loading="eager" src="${this._getURL()}" class="iframe loading" @load="${this._onLoad}"></iframe>
                    <div class="iframeLoader"></div>
                    ${this.showControls?L`
                        <div class="controls">
                            <icon-label button icon="refresh" @click="${this.refreshPreview}"></icon-label>
                            <icon-label button icon="open_in_new" @click="${this.openInNewTab}"></icon-label>
                        </div>
                    `:null}
                </div>

                ${this.showErrors?L`
                <ol class="ol">
                    ${this.errors.map((e=>L`
                            <li class="li">
                                <icon-label icon="error" style="--size: 35px; --fill: #f43f5e"></icon-label>
                                ${e}
                            </li>`))}
                </ol>`:null}
            </div>
            `}static styles=r`
        *{
            box-sizing: border-box;
        }

        :host{
            display: block;
        }

        .container{
            display: flex;
            flex-direction: column;
            min-height: inherit;
        }

        .iframeWrapper{
            position: relative;

            background: #f8fafc;

            overflow: hidden;

            height: 100%;
            flex-grow: 1;

            border-radius: 0.25rem;
        }

        .iframe{
            display: block;
            position: absolute;
            inset: 0.5rem;

            border: none;
            padding: 0;
            margin: 0;

            pointer-events: none;

            width: calc(100% - 1rem);
            height: calc(100% - 1rem);
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

        .controls{
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;

            display: flex;
            gap: 0.5rem;
        }
        .controls wrd-icon{
            --size: 32px;
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
    `}customElements.define("preview-bot",He);class Ve extends oe{static properties={category:{},count:{type:Number},sort:{},loading:{type:Boolean},_templates:{type:Array,state:!0}};constructor(){super(),this.category="",this.count=20,this.sort="count",this._templates=[]}connectedCallback(){super.connectedCallback(),this._getTemplates()}async _getTemplates(){this._templates=await ge("/popbot/v1/templates",{category:this.category,per_page:this.count})}async create(e){this.loading=!0;const t=await ge("/popbot/v1/popbots",{template:e},"POST");window.location.href=t.edit_link}render(){return L`
            <div class="container" ?inert="${this.loading}">
                <slot class="label"></slot>

                <div class="templates">
                    ${Me(this._templates,(e=>L`
                        <tool-tip label="Create from Template">
                            <button type="button" role="button" @click="${()=>{this.create(e.slug)}}">
                                <partial-template .template="${e}"></partial-template>
                            </button>
                        </tool-tip>
                    `))}
                </div>
            </div>
        `}static styles=r`
        .templates{
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fit, minmax(25ch, 1fr));
        }
        
        button{
            display: block;
            width: 100%;
            height: 100%;
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            font-family: inherit;
            text-align: inherit;
            font-weight: inherit;
            font-size: inherit;
        }

    `}customElements.define("template-picker",Ve),i(878);class je extends oe{static properties={uuid:{type:String},bot:{type:Object,state:!0}};connectedCallback(){super.connectedCallback(),this._fetchPost()}async _fetchPost(){let e=await ge(`/popbot/v1/popbots/${this.uuid}`);e&&(this.bot=e)}_getVisibilityIcon(e){return"public"==e?"public":"private"==e?"lock":"visibility_off"}get trigger(){return popbot.triggers.find((e=>e.id==this.bot?.trigger?.trigger))}render(){return L`
            <article class="container">
                <div class="preview_wrapper">
                    <preview-bot class="preview" uuid="${this.uuid}" scale="0.5"></preview-bot>
                    ${this.renderTrigger()}
                </div>

                <header class="header">
                    <a href="${this.bot?.edit_link}" class="link">
                        ${this.bot?.title}
                    </a>

                    <icon-label icon="${this._getVisibilityIcon(this.bot?.visibility.visibility)}" style="--fill: #94a3b8"></icon-label>
                </header>
            </article>
            `}renderTrigger(){return this.trigger?L`
            <div class="trigger" style="--bg: ${this.trigger.color}">
                <icon-label icon="${this.trigger.icon}"></icon-label>
                ${this.trigger.label}
            </div>
        `:null}static styles=r`
        *{
            box-sizing: border-box;
        }
        .container{
            
            
            background: white;

            padding: 1rem;
            padding-bottom: 0.5rem;
            border-radius: 0.375rem;
            box-shadow: 0 10px 15px -3px rgb(254 206 246 / 0.3), 0 4px 6px -4px rgb(254 206 246 / 0.3);
        }

        .preview_wrapper{
            position: relative;
        }
        .preview{
            min-height: 14rem;
        }

        .header{
            margin-top: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
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
            min-height: 28px;
        }
        .link:hover,
        .link:focus{
            color: #D204B0;
        }

        .trigger{
            --bg: #C60295;

            display: flex;
            gap: 0.25rem;
            align-items: center;
            padding: 0 0.5rem 0rem 0.25rem;

            background: var(--bg);
            
            color: #fff;
            font-size: 0.75rem;

            position: absolute;
            top: 1rem;
            left: 1rem;
            z-index: 1;

            border-radius: 100vw;
            box-shadow: 0.3rem 0.3rem 0.6rem rgba(0, 0, 0, 0.15);
        }
        .trigger icon-label{
            --size: 26px;
            --fill: currentColor;
        }

        .dropdown{
            display: flex;
            flex-direction: column;
            padding: 1rem;
            gap: 0.5rem;
        }
    `}customElements.define("partial-bot",je);class Ie extends oe{static properties={post_type:{attribute:"post-type"},orderby:{},order:{},page:{},per_page:{},status:{},search:{},taxonomies:{},_posts:{state:!0},_taxonomies:{state:!0}};constructor(){super(),this.post_type="post",this.orderby="modified",this.order="desc",this.page=1,this.per_page=75,this.status="any",this.search="",this.taxonomies={},this._posts=[],this._taxonomies=[]}connectedCallback(){super.connectedCallback(),this.getTaxonomies(),this.getPosts()}async getPosts(){var e=new URL(`${window.popbot.rest_url}wp/v2/${this.post_type}`);e.searchParams.set("_fields","id"),e.searchParams.set("orderby",this.orderby),e.searchParams.set("order",this.order),e.searchParams.set("page",this.page),e.searchParams.set("per_page",this.per_page),e.searchParams.set("status",this.status),this.search&&e.searchParams.set("search",this.search);let t=Object.keys(this.taxonomies);for(let i=0;i<t.length;i++)this.taxonomies[t[i]].length&&e.searchParams.set(t[i],this.taxonomies[t[i]]);this._posts=await this._fetch(e.href)}async getTaxonomies(){var e=new URL(`${window.popbot.rest_url}wp/v2/taxonomies`);e.searchParams.set("type",this.post_type);let t=await this._fetch(e.href);for(const e in t){let i=t[e],o=i._links["wp:items"][0].href;this._taxonomies.push({name:i.name,slug:e,items:await this._fetch(o)})}this.requestUpdate()}async _fetch(e){const t=await fetch(e,{headers:new Headers({"X-WP-Nonce":window.popbot.rest_nonce})});return await t.json()}_onChange(){let[e,t]=this.renderRoot?.querySelector("#orderby").value.split("/"),i=this.renderRoot?.querySelector("#search").value;this.orderby=e,this.order=t,this.search=i,this.getPosts()}toggleTerm(e,t){this.taxonomies.hasOwnProperty(e)||(this.taxonomies[e]=[]),this.taxonomies[e].includes(t)?this.taxonomies[e]=this.taxonomies[e].filter((e=>e!==t)):this.taxonomies[e].push(t),this.requestUpdate(),this.getPosts()}hasTerm(e,t){return this.taxonomies[e]?.includes(t)}changePage(e){this.page+=e,this.page<1&&(this.page=1),this.getPosts()}_renderTaxonomy(e){return L`
            <div>
                <h4 class="title">${e.name}</h4>
                <span class="subtitle">${e.items.length} found</span>

                <div class="chips">
                    ${ue(e.items,(t=>L`
                        <button type="button" role="switch" aria-checked="${this.hasTerm(e.slug,t.id)}" class="chip" @click="${()=>{this.toggleTerm(e.slug,t.id)}}">
                            ${t.name}
                        </button>
                    `))}
                </div>
            </div>
        `}render(){return L`
            <div class="container">
                <aside class="aside">
                    <label>
                        <h4 class="title">Sort</h4>
                        <select id="orderby" @change="${this._onChange}">
                            <option value="modified/desc">Recently Edited</option>
                            <option value="title/desc">Title</option>
                        </select>
                    </label>


                    <label>
                        <h4 class="title">Search</h4>
                        <input id="search" placeholder="Search PopBots..." @input="${this._onChange}">
                    </label>

                    ${ue(this._taxonomies,(e=>this._renderTaxonomy(e)))}
                </aside>

                <main class="grid">
                    ${this._posts?ue(this._posts,(e=>L`<partial-bot uuid="1_${e.id}"></partial-bot>`)):null}
                </main>
            </div>
        `}static styles=r`
        *{
            box-sizing: border-box;
        }
        
        .container{
            display: grid;
            gap: 2rem;
            grid-template-columns: 1fr 4fr;
        }

        .aside{
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .title{
            font-size: 1.1rem;
            font-weight: 500;
            color: #0f172a;

            margin: 0px;
        }
        .subtitle{
            font-size: 0.9rem;
            font-weight: 400;
            color: #64748b;
        }

        select,
        input{
            width: 100%;
            padding: 0.5rem 1rem;
            margin-top: 0.5rem;

            color: #0f172a;
            font-weight: 400;
            font-size: 1rem;
            font-family: inherit;

            background: #fff;
            border: none;
            border-radius: 0.25rem;
            box-shadow:
            0.9px 0.9px 3.6px rgba(198, 2, 149, 0.01),
            2.5px 2.5px 10px rgba(198, 2, 149, 0.015),
            6px 6px 24.1px rgba(198, 2, 149, 0.02),
            20px 20px 80px rgba(198, 2, 149, 0.03)
            ;
        }

        .chips{
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;

            margin-top: 0.5rem;
        }
        .chip{
            padding: 0.3rem 0.8rem;

            color: #0f172a;
            font-weight: 400;
            font-size: 0.9rem;
            font-family: inherit;

            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease;

            background: #fff;
            border: none;
            border-radius: 50vw;
            box-shadow:
            0.9px 0.9px 3.6px rgba(198, 2, 149, 0.01),
            2.5px 2.5px 10px rgba(198, 2, 149, 0.015),
            ;
        }
        .chip[aria-checked="true"]{
            background: #C60295;
            color: #fff;
        }

        .grid{
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        }
    `}customElements.define("post-archive",Ie);class Ze extends oe{static properties={event_type:{type:String},date_start:{type:Date},date_end:{type:Date},current:{type:Number,state:!0},previous:{type:Number,state:!0}};constructor(){super(),this.event_type="shown",this.current=-1,this.previous=-1,this.date_end=new Date,this.date_start=new Date(this.date_end.getFullYear(),this.date_end.getMonth(),1)}connectedCallback(){super.connectedCallback(),this.getData()}async getData(){ge("/popbot/v1/analytics",{context:"count",date_start:this.date_start.toISOString(),date_end:this.date_end.toISOString(),event_type:this.event_type}).then((e=>this.current=e));const e=this.date_start.getTime()-this.date_end.getTime(),t=new Date(this.date_start.getTime()-e),i=this.date_start;ge("/popbot/v1/analytics",{context:"count",date_start:t.toISOString(),date_end:i.toISOString(),event_type:this.event_type}).then((e=>{console.log(e),this.previous=e}))}format(e){return(e=Math.round(10*e)/10).toLocaleString()}get _title(){switch(this.event_type){case"shown":return"Total Views";case"converted":return"Conversions";case"dismissed":return"Dismissals"}}get _change(){let e=this.current,t=this.previous;if(0==e)return"-";let i=100*Math.abs((e-t)/((e+t)/2));return i=Math.round(10*i)/10,i+"%"}get _changedClass(){return this.previous,this.current>this.previous?"increased":"decreased"}render(){return L`
            <div class="container">
                <h3 class="title">
                    ${this._title}
                </h3>

                <div class="subtitle">${this.date}</div>

                <div class="stat">
                    <span class="value ${this.current<0?"value--hidden":null}">${this.format(this.current)}</span>

                    <div class="change ${this._changedClass}">${this._change}</div>
                </div>
            </div>
        `}static styles=r`
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
        .value--hidden{
            opacity: 0;
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

    `}customElements.define("stat-scorecard",Ze)})()})();
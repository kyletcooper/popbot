import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { api } from '../utils';
import './ToolTip';
import './IconLabel';

export class TagPicker extends LitElement {
    static properties = {
        post: { type: Number },
        taxonomy: { type: String },
        postType: { type: String, statu: true, attribute: "post-type" },
        allTags: { type: Array, state: true },
        postTags: { type: Array, state: true },
    };

    constructor() {
        super();

        this.post = -1;
        this.taxonomy = "popbot_tag";
        this.postType = "popbot";
        this.allTags = [];
        this.postTags = [];
        this.tags = [];
    }

    async connectedCallback() {
        super.connectedCallback();
        this._getTags();
    }

    async _getTags() {
        this.allTags = await api(`/wp/v2/${this.taxonomy}`);
        this.postTags = await api(`/wp/v2/${this.taxonomy}`, { post: this.post });
    }

    _onKeyDown(e) {
        if (e.key == "Enter") {
            this.createTag(e.target.value);
            e.target.value = "";
        }
    }

    async createTag(name) {
        await api(`/wp/v2/${this.taxonomy}`, {
            name: name
        }, "POST");

        this._getTags();
    }

    hasTag(tag) {
        return this.postTags.filter(ptag => ptag.id == tag.id).length > 0;
    }

    toggleTag(tag) {
        if (this.hasTag(tag)) {
            this.removeTag(tag);
        }
        else {
            this.addTag(tag);
        }
    }

    addTag(tag) {
        if (!this.hasTag(tag)) {
            this.postTags.push(tag);
            this.requestUpdate();
            this._save();
        }
    }

    removeTag(tag) {
        this.postTags = this.postTags.filter(ptag => ptag.id != tag.id);
        this._save();
    }

    async _save() {
        let data = {};
        let ids = this.postTags.map(tag => tag.id);
        data[this.taxonomy] = ids;

        const res = await api(`/wp/v2/${this.postType}/${this.post}`, data, "POST");
    }


    render() {
        return html`
            <div class="container">
                ${repeat(this.postTags, tag => html`
                    <div class="tag" @click="${() => { this.removeTag(tag) }}">${tag.name}</div> 
                `)}

                <tool-tip mode="dropdown">
                    <icon-label button class="add" icon="local_offer"></icon-label>

                    <div slot="tooltip" class="dropdown">
                        ${repeat(this.allTags, tag => html`
                            <div class="tag ${this.hasTag(tag) ? "before-check" : "before-none"}" @click="${() => { this.toggleTag(tag) }}">${tag.name}</div> 
                        `)}

                        <input placeholder="Add new tag" @keydown="${this._onKeyDown}">
                    </div>
                </tool-tip>
            </div>
        `;
    }

    static styles = css`
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
    `;
}

customElements.define('tag-picker', TagPicker);

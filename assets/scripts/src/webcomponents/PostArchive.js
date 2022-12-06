import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import './PartialBot';

export class PostArchive extends LitElement {
    static properties = {
        post_type: { attribute: 'post-type' },
        orderby: {},
        order: {},
        page: {},
        per_page: {},
        status: {},
        search: {},
        taxonomies: {},

        _posts: { state: true },
        _taxonomies: { state: true },
    }

    constructor() {
        super();

        this.post_type = "post";
        this.orderby = "modified";
        this.order = "desc";
        this.page = 1;
        this.per_page = 75;
        this.status = "any";
        this.search = "";
        this.taxonomies = {};

        this._posts = [];
        this._taxonomies = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.getTaxonomies();
        this.getPosts();
    }

    async getPosts() {
        var endpoint = new URL(`${window.popbot.rest_url}wp/v2/${this.post_type}`);

        endpoint.searchParams.set("_fields", "id");

        endpoint.searchParams.set("orderby", this.orderby);
        endpoint.searchParams.set("order", this.order);
        endpoint.searchParams.set("page", this.page);
        endpoint.searchParams.set("per_page", this.per_page);
        endpoint.searchParams.set("status", this.status);

        if (this.search) endpoint.searchParams.set("search", this.search);

        let taxonomies = Object.keys(this.taxonomies);
        for (let i = 0; i < taxonomies.length; i++) {
            if (this.taxonomies[taxonomies[i]].length) {
                endpoint.searchParams.set(taxonomies[i], this.taxonomies[taxonomies[i]]);
            }
        }

        this._posts = await this._fetch(endpoint.href);
    }

    async getTaxonomies() {
        // Get taxonomies
        var endpoint = new URL(`${window.popbot.rest_url}wp/v2/taxonomies`);
        endpoint.searchParams.set("type", this.post_type);

        let taxonomies = await this._fetch(endpoint.href);

        for (const tax_slug in taxonomies) {
            let tax = taxonomies[tax_slug];
            let tax_endpoint = tax._links['wp:items'][0].href;

            this._taxonomies.push({
                name: tax.name,
                slug: tax_slug,
                items: await this._fetch(tax_endpoint)
            });
        }

        this.requestUpdate();
    }

    async _fetch(endpoint) {
        const response = await fetch(endpoint, {
            headers: new Headers({
                'X-WP-Nonce': window.popbot.rest_nonce
            })
        });

        const responseJSON = await response.json();
        return responseJSON;
    }

    _onChange() {
        let [orderby, order] = this.renderRoot?.querySelector("#orderby").value.split("/");
        let search = this.renderRoot?.querySelector("#search").value;

        this.orderby = orderby;
        this.order = order;
        this.search = search;

        this.getPosts();
    }

    toggleTerm(tax, term) {
        if (!this.taxonomies.hasOwnProperty(tax)) {
            this.taxonomies[tax] = [];
        }

        if (this.taxonomies[tax].includes(term)) {
            this.taxonomies[tax] = this.taxonomies[tax].filter(el => el !== term);
        }
        else {
            this.taxonomies[tax].push(term);
        }

        this.requestUpdate();
        this.getPosts();
    }

    hasTerm(tax, term) {
        return this.taxonomies[tax]?.includes(term);
    }

    changePage(change) {
        this.page += change;
        if (this.page < 1) this.page = 1;
        this.getPosts();
    }

    _renderTaxonomy(tax) {
        return html`
            <div>
                <h4 class="title">${tax.name}</h4>
                <span class="subtitle">${tax.items.length} found</span>

                <div class="chips">
                    ${repeat(tax.items, (item) => html`
                        <button type="button" role="switch" aria-checked="${this.hasTerm(tax.slug, item.id)}" class="chip" @click="${() => { this.toggleTerm(tax.slug, item.id) }}">
                            ${item.name}
                        </button>
                    `)}
                </div>
            </div>
        `;
    }

    render() {
        return html`
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

                    ${repeat(this._taxonomies, (tax) => { return this._renderTaxonomy(tax) })}
                </aside>

                <main class="grid">
                    ${this._posts ? repeat(this._posts, (post) => html`<partial-bot uuid="1_${post.id}"></partial-bot>`) : null}
                </main>
            </div>
        `;
    }

    static styles = css`
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
    `;
}

customElements.define('post-archive', PostArchive);

/*!
 * <websavvys-credit>: the "Built by WebSavvys" footer credit.
 * https://websavvys.com
 */
(function () {
    'use strict';

    // No DOM (SSR, Node) or already defined by another copy of this script.
    if (typeof window === 'undefined' || !window.customElements || customElements.get('websavvys-credit')) return;

    // Filled in by scripts/build.mjs.
    var STYLES = ":host{display:inline-flex;min-width:0;max-width:100%;vertical-align:middle;--wsc-gold:#cd942c;--wsc-ink:#1f1608;--wsc-focus:#b48022}:host([hidden]),[hidden]{display:none !important}*,*::before,*::after{box-sizing:border-box}.wsc{all:initial;font-family:inherit;--wsc-gold-hi:color-mix(in oklab,var(--wsc-gold) 45%,white);display:inline-flex;min-width:0;max-width:100%;border-radius:999px;cursor:pointer;line-height:1;text-decoration:none;-webkit-tap-highlight-color:transparent}.wsc:focus-visible{outline:2px solid var(--wsc-focus);outline-offset:3px}.wsc-frame{position:relative;isolation:isolate;display:flex;min-width:0;padding:1px;border-radius:inherit;background:color-mix(in oklab,var(--wsc-gold) 34%,transparent);box-shadow:0 10px 24px -14px rgb(31 22 8 / 0.55);transition:transform 400ms cubic-bezier(0.22,1,0.36,1),box-shadow 400ms ease}.wsc:hover .wsc-frame{transform:translate3d(0,-1px,0);box-shadow:0 16px 30px -14px rgb(31 22 8 / 0.6)}.wsc:active .wsc-frame{transform:scale(0.985);transition-duration:120ms}.wsc-orbit,.wsc-ring{position:absolute;inset:0;z-index:-1;border-radius:inherit;background:conic-gradient( from var(--wsc-angle),transparent 0deg,var(--wsc-gold-hi) 50deg,transparent 110deg,transparent 180deg,var(--wsc-gold) 235deg,transparent 290deg );opacity:0;pointer-events:none}.wsc[data-lit] .wsc-orbit{animation:wsc-orbit 2400ms cubic-bezier(0.45,0,0.25,1) 500ms both}.wsc-ring{animation:wsc-spin 3600ms linear infinite paused;transition:opacity 400ms ease}.wsc:hover .wsc-ring,.wsc:focus-visible .wsc-ring{opacity:1;animation-play-state:running}.wsc-pill{position:relative;isolation:isolate;display:flex;align-items:center;gap:10px;min-width:0;padding:4px;border-radius:inherit;overflow:hidden;background:linear-gradient(180deg,color-mix(in oklab,var(--wsc-ink) 93%,white),var(--wsc-ink))}.wsc-glow{position:absolute;inset:0;z-index:-1;background:radial-gradient( 110px circle at var(--wsc-mx,50%) var(--wsc-my,50%),color-mix(in oklab,var(--wsc-gold) 24%,transparent),transparent 70% );opacity:0;transition:opacity 300ms ease}.wsc:hover .wsc-glow{opacity:1}.wsc-logo{display:block;flex:none;width:28px;height:28px;border-radius:999px;box-shadow:0 0 0 3px color-mix(in oklab,var(--wsc-gold) 16%,transparent);transition:transform 550ms cubic-bezier(0.34,1.56,0.64,1),box-shadow 300ms ease}.wsc:hover .wsc-logo{transform:translate3d(1px,-1px,0) rotate(-10deg);box-shadow:0 0 0 3px color-mix(in oklab,var(--wsc-gold) 32%,transparent)}.wsc-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;line-height:1.3;color:rgb(255 255 255 / 0.74)}.wsc-brand{font-weight:600;letter-spacing:-0.01em;background:linear-gradient( 90deg,var(--wsc-gold-hi) 0%,var(--wsc-gold) 25%,var(--wsc-gold-hi) 50%,var(--wsc-gold) 75%,var(--wsc-gold-hi) 100% );background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:wsc-shine 2800ms linear infinite paused}.wsc:hover .wsc-brand,.wsc:focus-visible .wsc-brand{animation-play-state:running}.wsc-pitch{color:rgb(255 255 255 / 0.58)}.wsc-dot{margin-inline:0.3em;color:var(--wsc-gold)}.wsc-sep{flex:none;width:1px;height:14px;background:rgb(255 255 255 / 0.14)}.wsc-cta{position:relative;overflow:hidden;flex:none;display:inline-flex;align-items:center;gap:8px;height:28px;padding-inline:12px 3px;border-radius:999px;background:linear-gradient(180deg,color-mix(in oklab,var(--wsc-gold) 82%,white),var(--wsc-gold));box-shadow:inset 0 1px 0 rgb(255 255 255 / 0.35);color:var(--wsc-ink);font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;transition:box-shadow 300ms ease}.wsc:is(:lang(ka),:lang(ar),:lang(fa),:lang(ur),:lang(he),:lang(hi),:lang(th),:lang(ja),:lang(ko),:lang(zh)) .wsc-cta{font-size:12px;letter-spacing:normal;text-transform:none}.wsc-cta::after{content:'';position:absolute;inset-block:-30%;left:0;width:22%;background:linear-gradient(90deg,transparent,rgb(255 255 255 / 0.28),transparent);animation:wsc-sheen 9s cubic-bezier(0.65,0,0.35,1) infinite;pointer-events:none}.wsc:hover .wsc-cta{box-shadow:inset 0 1px 0 rgb(255 255 255 / 0.45),0 0 0 3px color-mix(in oklab,var(--wsc-gold-hi) 18%,transparent)}.wsc-arrow{display:grid;place-items:center;width:22px;height:22px;overflow:hidden;border-radius:999px;background:var(--wsc-ink);color:var(--wsc-gold-hi)}.wsc[dir='rtl'] .wsc-arrow{transform:scaleX(-1)}.wsc-arrow svg{display:block;width:12px;height:12px}.wsc:hover .wsc-arrow svg{animation:wsc-arrow 650ms cubic-bezier(0.22,1,0.36,1)}.wsc[data-squeeze] .wsc-pitch,.wsc[data-squeeze] .wsc-sep{display:none}.wsc:is([data-squeeze='2'],[data-squeeze='3']) .wsc-cta{gap:0;padding-inline:3px}.wsc-sr,.wsc:is([data-squeeze='2'],[data-squeeze='3']) .wsc-cta-label,.wsc[data-squeeze='3'] :is(.wsc-credit-pre,.wsc-credit-post){position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}@keyframes wsc-spin{to{--wsc-angle:360deg}}@keyframes wsc-orbit{0%{--wsc-angle:0deg;opacity:0}20%,75%{opacity:1}100%{--wsc-angle:360deg;opacity:0}}@keyframes wsc-shine{to{background-position:100% 0}}@keyframes wsc-sheen{0%,12%{transform:translate3d(-160%,0,0) skewX(-14deg)}60%,100%{transform:translate3d(560%,0,0) skewX(-14deg)}}@keyframes wsc-arrow{0%{transform:translate3d(0,0,0)}45%{transform:translate3d(150%,-150%,0)}46%{transform:translate3d(-150%,150%,0)}100%{transform:translate3d(0,0,0)}}@media (prefers-reduced-motion:reduce){.wsc-frame,.wsc-logo,.wsc-glow,.wsc-ring{transition:none}.wsc:hover .wsc-frame,.wsc:active .wsc-frame,.wsc:hover .wsc-logo{transform:none}.wsc[data-lit] .wsc-orbit,.wsc-ring,.wsc-brand,.wsc:hover .wsc-arrow svg{animation:none}.wsc-cta::after{animation:none;opacity:0}}";
    var LOGO = "data:image/png;base64,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";

    var DEFAULT_HREF = 'https://websavvys.com/';

    // Built-in copy, picked from the page's lang attribute (e.g. <html lang="ka">).
    // {brand} marks where "WebSavvys" goes. To add a language, add an entry and rebuild.
    var STRINGS = {
        en: {
            credit: 'Built by {brand}',
            pitch: 'Need a site like this?',
            cta: 'Let’s talk',
            newTab: '(opens in a new tab)',
        },
        ka: {
            credit: 'შექმნილია {brand}-ის მიერ',
            pitch: 'გჭირდებათ ასეთი საიტი?',
            cta: 'ვისაუბროთ',
            newTab: '(იხსნება ახალ ჩანართში)',
        },
        ru: {
            credit: 'Разработано {brand}',
            pitch: 'Нужен такой же сайт?',
            cta: 'Обсудим',
            newTab: '(откроется в новой вкладке)',
        },
    };

    // Setting any of these means the page supplies its own copy.
    var TEXT_ATTRIBUTES = ['credit', 'pitch', 'cta', 'new-tab-text'];
    var RTL_LANGUAGES = ['ar', 'fa', 'he', 'ur'];

    // Keep the .wsc-text line on one line, so the spacing around the dot stays even.
    var TEMPLATE = `
<a class="wsc" target="_blank" rel="noopener noreferrer">
    <span class="wsc-frame">
        <span class="wsc-orbit" aria-hidden="true"></span>
        <span class="wsc-ring" aria-hidden="true"></span>

        <span class="wsc-pill">
            <span class="wsc-glow" aria-hidden="true"></span>

            <img class="wsc-logo" alt="" width="28" height="28" loading="lazy">

            <span class="wsc-text"><span class="wsc-credit-pre"></span><span class="wsc-brand">WebSavvys</span><span class="wsc-credit-post"></span><span class="wsc-pitch"> <span class="wsc-dot" aria-hidden="true">·</span> <span class="wsc-pitch-text"></span></span></span>

            <span class="wsc-sep" aria-hidden="true"></span>

            <span class="wsc-cta">
                <span class="wsc-cta-label"></span>
                <span class="wsc-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M7 17 17 7m0 0H8m9 0v9" />
                    </svg>
                </span>
            </span>
        </span>
    </span>

    <span class="wsc-sr"></span>
</a>`;

    // Browsers ignore @property inside shadow roots, so register the angle globally.
    // It throws if the property is already registered, which is fine.
    try {
        CSS.registerProperty({ name: '--wsc-angle', syntax: '<angle>', inherits: false, initialValue: '0deg' });
    } catch (e) {}

    // One stylesheet shared by every instance. Constructed sheets also get past a
    // strict style-src CSP, where a <style> tag would be blocked.
    var sheet = null;

    function applyStyles(root) {
        try {
            if (!sheet) {
                sheet = new CSSStyleSheet();
                sheet.replaceSync(STYLES);
            }
            root.adoptedStyleSheets = [sheet];
        } catch (e) {
            var style = document.createElement('style');
            style.textContent = STYLES;
            root.prepend(style);
        }
    }

    class WebsavvysCredit extends HTMLElement {
        static get observedAttributes() {
            return ['href', 'source', 'logo', 'lang'].concat(TEXT_ATTRIBUTES);
        }

        constructor() {
            super();

            // No <slot>: whatever is written inside the tag is a fallback that shows
            // until this script runs (and for crawlers that don't run JS).
            var root = this.attachShadow({ mode: 'open' });
            root.innerHTML = TEMPLATE;
            applyStyles(root);

            this.link = root.querySelector('.wsc');
            this.logo = root.querySelector('.wsc-logo');
            this.creditPre = root.querySelector('.wsc-credit-pre');
            this.creditPost = root.querySelector('.wsc-credit-post');
            this.text = root.querySelector('.wsc-text');
            this.pitch = root.querySelector('.wsc-pitch');
            this.pitchText = root.querySelector('.wsc-pitch-text');
            this.sep = root.querySelector('.wsc-sep');
            this.ctaLabel = root.querySelector('.wsc-cta-label');
            this.newTab = root.querySelector('.wsc-sr');
            this.observer = null;
            this.resizeObserver = null;
            this.fitFrame = 0;
            this.onResize = () => this.scheduleFit();

            // Glow that follows the pointer.
            this.link.addEventListener('pointermove', (event) => {
                var rect = this.link.getBoundingClientRect();

                this.link.style.setProperty('--wsc-mx', event.clientX - rect.left + 'px');
                this.link.style.setProperty('--wsc-my', event.clientY - rect.top + 'px');
            });
        }

        connectedCallback() {
            this.update();

            // Re-fit when the space around the credit changes, or once web fonts arrive.
            // Watch the parent, not the credit: once squeezed, the credit is small enough
            // that its own size doesn't change when more room opens up.
            if (!this.resizeObserver && 'ResizeObserver' in window) {
                this.resizeObserver = new ResizeObserver(this.onResize);
                this.resizeObserver.observe(this.parentElement || this);
            }

            window.addEventListener('resize', this.onResize);
            if (document.fonts) document.fonts.ready.then(this.onResize);

            // Light the border once the banner is fully on screen.
            if (this.link.hasAttribute('data-lit') || this.observer || !('IntersectionObserver' in window)) return;

            this.observer = new IntersectionObserver(
                (entries) => {
                    var entry = entries[entries.length - 1];

                    // The first callback fires right away, even when only partly visible.
                    if (!entry.isIntersecting || entry.intersectionRatio < 0.9) return;

                    this.link.setAttribute('data-lit', '');
                    this.disconnectObserver();
                },
                { threshold: 0.9 }
            );

            this.observer.observe(this);
        }

        disconnectedCallback() {
            this.disconnectObserver();

            if (this.resizeObserver) this.resizeObserver.disconnect();
            this.resizeObserver = null;
            window.removeEventListener('resize', this.onResize);

            cancelAnimationFrame(this.fitFrame);
            this.fitFrame = 0;
        }

        attributeChangedCallback() {
            if (this.isConnected) this.update();
        }

        disconnectObserver() {
            if (!this.observer) return;

            this.observer.disconnect();
            this.observer = null;
        }

        update() {
            var lang = this.language();
            var strings = STRINGS[lang] || STRINGS[lang.split('-')[0]];
            var custom = TEXT_ATTRIBUTES.some((name) => this.getAttribute(name));

            // A language with no built-in copy and none supplied falls back to English.
            var textLang = strings || custom ? lang : 'en';
            strings = strings || STRINGS.en;

            var credit = (this.getAttribute('credit') || strings.credit).split('{brand}');
            var pitch = this.getAttribute('pitch');

            this.link.lang = textLang;
            this.link.dir = RTL_LANGUAGES.indexOf(textLang.split('-')[0]) > -1 ? 'rtl' : 'ltr';
            this.link.href = this.buildHref();
            this.logo.src = this.getAttribute('logo') || LOGO;

            // A custom credit without {brand} gets the brand after it.
            this.creditPre.textContent = credit.length > 1 ? credit[0] : credit[0] + ' ';
            this.creditPost.textContent = credit.slice(1).join('');

            this.ctaLabel.textContent = this.getAttribute('cta') || strings.cta;
            this.newTab.textContent = this.getAttribute('new-tab-text') || strings.newTab;

            // pitch="" turns the pitch off at every width.
            this.pitchText.textContent = pitch || strings.pitch;
            this.pitch.hidden = this.sep.hidden = pitch === '';

            this.fit();
        }

        // Squeeze one level at a time (see the CSS) until the text fits without an ellipsis.
        fit() {
            var level = 0;

            this.link.removeAttribute('data-squeeze');

            while (level < 3 && this.text.scrollWidth > this.text.clientWidth) {
                this.link.setAttribute('data-squeeze', ++level);
            }
        }

        // Fitting changes the element's size, so it runs in the next frame rather than
        // inside the ResizeObserver callback (which would log a "loop" error).
        scheduleFit() {
            if (this.fitFrame) return;

            this.fitFrame = requestAnimationFrame(() => {
                this.fitFrame = 0;
                this.fit();
            });
        }

        // The nearest lang attribute, on the element itself or any ancestor.
        language() {
            var el = this.closest('[lang]');

            return ((el && el.getAttribute('lang')) || 'en').trim().toLowerCase();
        }

        // Tag visits with the domain the banner is actually served from.
        buildHref() {
            var url;

            try {
                url = new URL(this.getAttribute('href') || DEFAULT_HREF, location.href);
            } catch (e) {
                url = new URL(DEFAULT_HREF);
            }

            url.searchParams.set('utm_source', this.getAttribute('source') || location.hostname || 'unknown');

            if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'referral');
            if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', 'site-credit');

            return url.toString();
        }
    }

    customElements.define('websavvys-credit', WebsavvysCredit);
})();

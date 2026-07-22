// Font Awesome — import only the icons actually used in the app. Importing the
// full solid/regular/brands sets (`fas`/`far`/`fab`) was the single largest
// contributor to the production JS bundle; explicit imports cut it dramatically.
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF, faGithub, faInstagram, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import {
    faArrowRight,
    faBolt,
    faChartLine,
    faCheck,
    faCode,
    faComments,
    faCreditCard,
    faEnvelope,
    faGlobe,
    faInfoCircle,
    faLayerGroup,
    faLightbulb,
    faMobileAlt,
    faMoon,
    faPalette,
    faPaperPlane,
    faPhone,
    faQuestionCircle,
    faRocket,
    faRoute,
    faSun,
    faTag,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';

import i18n from './i18n';
import '../scss/app.scss';

library.add(
    faArrowRight,
    faBolt,
    faChartLine,
    faCheck,
    faCode,
    faComments,
    faCreditCard,
    faEnvelope,
    faGlobe,
    faInfoCircle,
    faLayerGroup,
    faLightbulb,
    faMobileAlt,
    faMoon,
    faPalette,
    faPaperPlane,
    faPhone,
    faQuestionCircle,
    faRocket,
    faRoute,
    faSun,
    faTag,
    faUser,
);
// `@fortawesome/free-regular-svg-icons` types don't quite line up with
// `fontawesome-svg-core`'s `IconDefinitionOrPack` — same pre-existing mismatch
// the old bulk `far as any` cast was working around.
library.add(faCircle as any);
library.add(faFacebookF, faGithub, faInstagram, faLinkedinIn, faXTwitter);

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>('./pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(i18n)
            .component('font-awesome-icon', FontAwesomeIcon)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

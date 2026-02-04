// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import {
    faArrowRight,
    faBolt,
    faCheck,
    faChartLine,
    faCode,
    faCog,
    faComments,
    faEnvelope,
    faGlobe,
    faHeart,
    faLightbulb,
    faMobileAlt,
    faMoon,
    faPalette,
    faQuestionCircle,
    faRocket,
    faShieldAlt,
    faSun,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';

import i18n from './i18n';
import '../scss/app.scss';

// Add icons to library
library.add(
    faArrowRight,
    faBolt,
    faCheck,
    faChartLine,
    faCode,
    faCog,
    faComments,
    faEnvelope,
    faGithub,
    faGlobe,
    faHeart,
    faLightbulb,
    faLinkedin,
    faMobileAlt,
    faMoon,
    faPalette,
    faQuestionCircle,
    faRocket,
    faShieldAlt,
    faSun,
    faTwitter,
    faUsers,
);

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

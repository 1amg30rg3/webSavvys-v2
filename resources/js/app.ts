import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import i18n from './i18n';
import '../scss/app.scss';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faRocket,
    faCode,
    faPalette,
    faMobileAlt,
    faChartLine,
    faShieldAlt,
    faLightbulb,
    faCog,
    faUsers,
    faEnvelope,
    faComments,
    faSun,
    faMoon,
    faGlobe,
    faArrowRight,
    faCheck,
    faQuestionCircle,
    faBolt,
    faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

// Add icons to library
library.add(
    faRocket,
    faCode,
    faPalette,
    faMobileAlt,
    faChartLine,
    faShieldAlt,
    faLightbulb,
    faCog,
    faUsers,
    faEnvelope,
    faComments,
    faSun,
    faMoon,
    faGlobe,
    faArrowRight,
    faCheck,
    faQuestionCircle,
    faBolt,
    faHeart,
    faGithub,
    faLinkedin,
    faTwitter,
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

// Font Awesome - Import ALL free icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'; // All brand icons
import { far } from '@fortawesome/free-regular-svg-icons'; // All regular icons
import { fas } from '@fortawesome/free-solid-svg-icons'; // All solid icons
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';

import i18n from './i18n';
import '../scss/app.scss';

// Add ALL free FontAwesome icons to library (solid, regular, and brands)
library.add(fas as any, far as any, fab as any);

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

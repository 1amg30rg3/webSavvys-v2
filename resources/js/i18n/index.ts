import { createI18n } from 'vue-i18n';
import en from './en.json';
import ka from './ka.json';

export type SupportedLocale = 'en' | 'ka';

const messages = {
    en,
    ka,
};

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
});

export default i18n;

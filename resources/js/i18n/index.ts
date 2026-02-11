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
    locale: 'ka',
    fallbackLocale: 'en',
    messages,
    missingWarn: false,
    fallbackWarn: false,
});

export default i18n;

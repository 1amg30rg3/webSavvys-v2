<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ChatFab from '@/components/layout/ChatFab.vue';
import SiteFooter from '@/components/layout/SiteFooter.vue';
import SiteHeader from '@/components/layout/SiteHeader.vue';
import AboutSection from '@/components/sections/AboutSection.vue';
import ContactSection from '@/components/sections/ContactSection.vue';
import DeveloperSection from '@/components/sections/DeveloperSection.vue';
import FaqSection from '@/components/sections/FaqSection.vue';
import FlowSection from '@/components/sections/FlowSection.vue';
import GrowthSection from '@/components/sections/GrowthSection.vue';
import HeroSection from '@/components/sections/HeroSection.vue';
import PaymentSection from '@/components/sections/PaymentSection.vue';
import PricingSection from '@/components/sections/PricingSection.vue';
import ServicesSection from '@/components/sections/ServicesSection.vue';

const { t, locale } = useI18n();

type Theme = 'light' | 'dark';

type Locale = 'en' | 'ka';

const theme = ref<Theme>('light');
const portfolioUrl = 'https://ggavasheli.com';

const chatUrl = computed(() => t('contact.chatUrl'));
const emailLink = computed(() => `mailto:contact@websavvys.com`);
const isDark = computed(() => theme.value === 'dark');
const localeLabel = computed(() => (locale.value === 'en' ? 'EN' : 'GEO'));

const applyTheme = (value: Theme) => {
    if (typeof document === 'undefined') {
        return;
    }
    document.documentElement.dataset.theme = value;
};

const applyLocale = (value: Locale) => {
    if (typeof document === 'undefined') {
        return;
    }
    document.documentElement.lang = value;
};

const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
};

const toggleLocale = () => {
    locale.value = locale.value === 'en' ? 'ka' : 'en';
};

onMounted(() => {
    const storedTheme = (localStorage.getItem('ws-theme') as Theme | null) ?? null;
    const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    theme.value = storedTheme ?? systemTheme;

    const storedLocale = (localStorage.getItem('ws-locale') as Locale | null) ?? null;
    if (storedLocale) {
        locale.value = storedLocale;
    }

    applyTheme(theme.value);
    applyLocale(locale.value as Locale);
});

watch(theme, (value) => {
    applyTheme(value);
    localStorage.setItem('ws-theme', value);
});

watch(locale, (value) => {
    applyLocale(value as Locale);
    localStorage.setItem('ws-locale', value as string);
});
</script>

<template>
    <div class="app">
        <SiteHeader
            :chat-url="chatUrl"
            :locale-label="localeLabel"
            :is-dark="isDark"
            :on-toggle-theme="toggleTheme"
            :on-toggle-locale="toggleLocale"
        />

        <main class="main">
            <div class="container">
                <HeroSection :chat-url="chatUrl" :locale-label="localeLabel" />
                <AboutSection />
                <ServicesSection />
                <GrowthSection />
                <FlowSection />
                <PaymentSection />
                <PricingSection />
                <FaqSection />
                <DeveloperSection :portfolio-url="portfolioUrl" />
                <ContactSection :email-link="emailLink" :chat-url="chatUrl" />
            </div>
        </main>

        <SiteFooter />

        <ChatFab :chat-url="chatUrl" />
    </div>
</template>

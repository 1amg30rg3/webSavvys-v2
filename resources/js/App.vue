<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
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
import { useLenis } from '@/composables/useLenis';

const { t, locale } = useI18n();

useLenis();

const isLoading = ref(true);
const isThemeTransitioning = ref(false);
const prefersReducedMotion = ref(false);
const cursorGlowRef = ref<HTMLElement | null>(null);

const handleCursorGlow = (event: PointerEvent) => {
    cursorGlowRef.value?.style.setProperty('--glow-x', `${event.clientX}px`);
    cursorGlowRef.value?.style.setProperty('--glow-y', `${event.clientY}px`);
};

type Theme = 'light' | 'dark';

type Locale = 'en' | 'ka';

const theme = ref<Theme>('light');
const portfolioUrl = 'https://ggavasheli.com';

const chatUrl = computed(() => t('contact.chatUrl'));
const emailLink = computed(() => `mailto:contact@websavvys.com`);
const phoneLink = computed(() => `tel:+995555219234`);
const isDark = computed(() => theme.value === 'dark');
const localeLabel = computed(() => (locale.value === 'en' ? 'GEO' : 'EN'));

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
    if (prefersReducedMotion.value) {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
        return;
    }

    isThemeTransitioning.value = true;

    // Matches the page-loader's own 0.9s progress-bar fill (see _page-loader.scss)
    // so the bar visibly completes before the overlay fades out.
    setTimeout(() => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
    }, 450);

    setTimeout(() => {
        isThemeTransitioning.value = false;
    }, 950);
};

const toggleLocale = () => {
    // Navigate to the real localized route rather than swapping content
    // client-side — each URL must deterministically render its own language
    // for both SEO (hreflang) and returning visitors sharing a link.
    router.visit(locale.value === 'en' ? '/ka' : '/', { preserveScroll: true });
};

onMounted(() => {
    const storedTheme = (localStorage.getItem('ws-theme') as Theme | null) ?? null;
    const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    theme.value = storedTheme ?? systemTheme;

    applyTheme(theme.value);
    applyLocale(locale.value as Locale);

    prefersReducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (prefersReducedMotion.value) {
        isLoading.value = false;
    } else {
        window.setTimeout(() => {
            isLoading.value = false;
        }, 900);
    }

    if (!prefersReducedMotion.value && window.matchMedia?.('(pointer: fine)').matches) {
        window.addEventListener('pointermove', handleCursorGlow, { passive: true });
    }

    const dividers = document.querySelectorAll('.section-divider');
    const dividerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    dividerObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 },
    );
    dividers.forEach((divider) => dividerObserver.observe(divider));
});

onUnmounted(() => {
    window.removeEventListener('pointermove', handleCursorGlow);
});

watch(theme, (value) => {
    applyTheme(value);
    localStorage.setItem('ws-theme', value);
});

// Keeps <html lang> correct on client-side Inertia visits between `/` and `/ka`
// (the root Blade template only sets it on the initial full page load).
watch(locale, (value) => {
    applyLocale(value as Locale);
});
</script>

<template>
    <div class="app">
        <Transition name="loader-fade">
            <div v-if="isLoading || isThemeTransitioning" class="page-loader" aria-hidden="true">
                <div class="page-loader-mark"><span class="page-loader-accent">Web</span><span class="page-loader-rest">Savvys</span></div>
                <div class="page-loader-bar">
                    <div class="page-loader-bar-fill"></div>
                </div>
            </div>
        </Transition>

        <div class="cursor-glow" ref="cursorGlowRef" aria-hidden="true"></div>

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
                <div class="section-divider" data-animate="fade-in"></div>
                <AboutSection />
                <div class="section-divider" data-animate="fade-in"></div>
                <ServicesSection />
                <div class="section-divider" data-animate="fade-in"></div>
                <GrowthSection />
                <div class="section-divider" data-animate="fade-in"></div>
                <FlowSection />
                <div class="section-divider" data-animate="fade-in"></div>
                <PaymentSection />
                <div class="section-divider" data-animate="fade-in"></div>
                <PricingSection />
                <div class="section-divider" data-animate="fade-in"></div>
                <FaqSection />
                <div class="section-divider" data-animate="fade-in"></div>
                <DeveloperSection :portfolio-url="portfolioUrl" />
                <ContactSection :email-link="emailLink" :phone-link="phoneLink" :chat-url="chatUrl" />
            </div>
        </main>

        <SiteFooter />

        <ChatFab :chat-url="chatUrl" />
    </div>
</template>

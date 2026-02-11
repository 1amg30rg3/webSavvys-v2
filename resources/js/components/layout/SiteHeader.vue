<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
    localeLabel: string;
    isDark: boolean;
    chatUrl: string;
    onToggleTheme: () => void;
    onToggleLocale: () => void;
}>();

const { t } = useI18n();

const isMenuOpen = ref(false);
const MOBILE_BREAKPOINT = 1600;
let mediaQuery: MediaQueryList | null = null;

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

const handleMediaChange = () => {
    if (!mediaQuery?.matches) {
        isMenuOpen.value = false;
    }
};

onMounted(() => {
    if (typeof window === 'undefined') {
        return;
    }

    mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    handleMediaChange();

    if ('addEventListener' in mediaQuery) {
        mediaQuery.addEventListener('change', handleMediaChange);
    } else {
        mediaQuery.addListener(handleMediaChange);
    }
});

onBeforeUnmount(() => {
    if (!mediaQuery) {
        return;
    }

    if ('removeEventListener' in mediaQuery) {
        mediaQuery.removeEventListener('change', handleMediaChange);
    } else {
        mediaQuery.removeListener(handleMediaChange);
    }
});
</script>

<template>
    <header class="site-header">
        <div class="container site-header-inner">
            <a class="logo" href="#hero" aria-label="WebSavvys">
                <font-awesome-icon :icon="['fa', 'rocket']" />

                <span class="logo-word">
                    <span class="logo-word-accent">Web</span>
                    <span class="logo-word-rest">Savvys</span>
                </span>
            </a>
            <nav class="nav-links" aria-label="Primary">
                <a href="#services">{{ t('services.title') }}</a>
                <a href="#flow">{{ t('flow.title') }}</a>
                <a href="#payment">{{ t('payment.title') }}</a>
                <a href="#faq">{{ t('faq.title') }}</a>
                <a href="#contact">{{ t('contact.title') }}</a>
            </nav>
            <nav id="mobile-nav" class="mobile-nav" :class="{ 'is-open': isMenuOpen }" aria-label="Mobile">
                <a href="#about" @click="closeMenu">{{ t('about.title') }}</a>
                <a href="#services" @click="closeMenu">{{ t('services.title') }}</a>
                <a href="#growth" @click="closeMenu">{{ t('growth.title') }}</a>
                <a href="#flow" @click="closeMenu">{{ t('flow.title') }}</a>
                <a href="#payment" @click="closeMenu">{{ t('payment.title') }}</a>
                <a href="#pricing" @click="closeMenu">{{ t('pricing.title') }}</a>
                <a href="#faq" @click="closeMenu">{{ t('faq.title') }}</a>
                <a href="#developer" @click="closeMenu">{{ t('developer.title') }}</a>
                <a href="#contact" @click="closeMenu">{{ t('contact.title') }}</a>

                <div class="header-actions-mobile">
                    <button class="chip" type="button" @click="onToggleLocale" :aria-label="t('ui.langToggle')">
                        <font-awesome-icon :icon="['fas', 'globe']" />
                        {{ localeLabel }}
                    </button>
                    <button class="chip" type="button" @click="onToggleTheme" :aria-pressed="isDark"
                        :aria-label="t('ui.themeToggle')">
                        <font-awesome-icon :icon="['fas', isDark ? 'sun' : 'moon']" />
                        {{ isDark ? t('ui.themeLight') : t('ui.themeDark') }}
                    </button>
                </div>
            </nav>
            <div class="header-actions">
                <button class="chip" type="button" @click="onToggleLocale" :aria-label="t('ui.langToggle')">
                    <font-awesome-icon :icon="['fas', 'globe']" />
                    {{ localeLabel }}
                </button>
                <button class="chip" type="button" @click="onToggleTheme" :aria-pressed="isDark"
                    :aria-label="t('ui.themeToggle')">
                    <font-awesome-icon :icon="['fas', isDark ? 'sun' : 'moon']" />
                    {{ isDark ? t('ui.themeLight') : t('ui.themeDark') }}
                </button>
            </div>
            <button class="nav-toggle" type="button" :class="{ 'is-open': isMenuOpen }" :aria-expanded="isMenuOpen"
                aria-controls="mobile-nav" @click="toggleMenu">
                <span class="nav-toggle-bar" />
                <span class="nav-toggle-bar" />
                <span class="nav-toggle-bar" />
            </button>
        </div>
    </header>
</template>

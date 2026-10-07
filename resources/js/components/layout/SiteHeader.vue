<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useActiveSection } from '@/composables/useActiveSection';

defineProps<{
    localeLabel: string;
    isDark: boolean;
    chatUrl: string;
    onToggleTheme: () => void;
    onToggleLocale: () => void;
}>();

const { t } = useI18n();

const isMenuOpen = ref(false);
// Must match the nav breakpoint in _media-queries.scss.
const MOBILE_BREAKPOINT = 1180;
let mediaQuery: MediaQueryList | null = null;

const { activeId } = useActiveSection(['pricing', 'services', 'flow', 'faq', 'contact']);

const isScrolled = ref(false);
const isHeaderHidden = ref(false);
let lastScrollY = 0;

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

const handleScroll = () => {
    const currentY = window.scrollY;
    isScrolled.value = currentY > 24;

    if (isMenuOpen.value || currentY < 120) {
        isHeaderHidden.value = false;
    } else if (currentY > lastScrollY + 4) {
        isHeaderHidden.value = true;
    } else if (currentY < lastScrollY - 4) {
        isHeaderHidden.value = false;
    }

    lastScrollY = currentY;
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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

    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <header class="site-header" :class="{ 'is-scrolled': isScrolled, 'is-hidden': isHeaderHidden }">
        <div class="site-header-inner container">
            <a class="logo" href="#hero" aria-label="WebSavvys">
                <font-awesome-icon :icon="['fas', 'rocket']" />

                <span class="logo-word">
                    <span class="logo-word-accent">Web</span>
                    <span class="logo-word-rest">Savvys</span>
                </span>
            </a>
            <nav class="nav-links" aria-label="Primary">
                <a href="#pricing" :class="{ 'is-active': activeId === 'pricing' }">
                    <font-awesome-icon :icon="['fas', 'tag']" />
                    {{ t('pricing.navLabel') }}
                </a>
                <a href="#services" :class="{ 'is-active': activeId === 'services' }">
                    <font-awesome-icon :icon="['fas', 'layer-group']" />
                    {{ t('services.navLabel') }}
                </a>
                <a href="#flow" :class="{ 'is-active': activeId === 'flow' }">
                    <font-awesome-icon :icon="['fas', 'route']" />
                    {{ t('flow.navLabel') }}
                </a>
                <a href="#faq" :class="{ 'is-active': activeId === 'faq' }">
                    <font-awesome-icon :icon="['fas', 'question-circle']" />
                    {{ t('faq.navLabel') }}
                </a>
                <a href="#contact" :class="{ 'is-active': activeId === 'contact' }">
                    <font-awesome-icon :icon="['fas', 'paper-plane']" />
                    {{ t('contact.navLabel') }}
                </a>
            </nav>
            <nav id="mobile-nav" class="mobile-nav" :class="{ 'is-open': isMenuOpen }" aria-label="Mobile">
                <a href="#pricing" @click="closeMenu">
                    <font-awesome-icon :icon="['fas', 'tag']" />
                    {{ t('pricing.navLabel') }}
                </a>
                <a href="#about" @click="closeMenu">
                    <font-awesome-icon :icon="['fas', 'info-circle']" />
                    {{ t('about.title') }}
                </a>
                <a href="#services" @click="closeMenu">
                    <font-awesome-icon :icon="['fas', 'layer-group']" />
                    {{ t('services.title') }}
                </a>
                <a href="#growth" @click="closeMenu">
                    <font-awesome-icon :icon="['fas', 'chart-line']" />
                    {{ t('growth.title') }}
                </a>
                <a href="#flow" @click="closeMenu">
                    <font-awesome-icon :icon="['fas', 'route']" />
                    {{ t('flow.title') }}
                </a>
                <a href="#faq" @click="closeMenu">
                    <font-awesome-icon :icon="['fas', 'question-circle']" />
                    {{ t('faq.title') }}
                </a>
                <a href="#developer" @click="closeMenu">
                    <font-awesome-icon :icon="['fas', 'user']" />
                    {{ t('developer.title') }}
                </a>
                <a href="#contact" @click="closeMenu">
                    <font-awesome-icon :icon="['fas', 'paper-plane']" />
                    {{ t('contact.title') }}
                </a>

                <div class="header-actions-mobile">
                    <button class="chip" type="button" @click="onToggleLocale" :aria-label="t('ui.langToggle')">
                        <font-awesome-icon :icon="['fas', 'globe']" />
                        {{ localeLabel }}
                    </button>
                    <button class="chip" type="button" @click="onToggleTheme" :aria-pressed="isDark" :aria-label="t('ui.themeToggle')">
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
                <button class="chip" type="button" @click="onToggleTheme" :aria-pressed="isDark" :aria-label="t('ui.themeToggle')">
                    <font-awesome-icon :icon="['fas', isDark ? 'sun' : 'moon']" />
                    {{ isDark ? t('ui.themeLight') : t('ui.themeDark') }}
                </button>
            </div>
            <button
                class="nav-toggle"
                type="button"
                :class="{ 'is-open': isMenuOpen }"
                :aria-expanded="isMenuOpen"
                aria-controls="mobile-nav"
                aria-label="Toggle navigation menu"
                @click="toggleMenu"
            >
                <span class="sr-only">Toggle navigation menu</span>
                <span class="nav-toggle-icon" aria-hidden="true">
                    <span class="nav-toggle-bar" />
                    <span class="nav-toggle-bar" />
                    <span class="nav-toggle-bar" />
                </span>
            </button>
        </div>
    </header>
</template>

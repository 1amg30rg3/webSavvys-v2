<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AppPageProps } from '@/types';

const { t } = useI18n();
const page = usePage<AppPageProps>();

const social = computed(() => Object.entries(page.props.seoDefaults.social));
const year = computed(() => new Date().getFullYear());
</script>

<template>
    <footer class="site-footer">
        <div class="footer-inner container">
            <div class="footer-brand">
                <span class="footer-logo"> <span class="footer-logo-accent">Web</span><span class="footer-logo-rest">Savvys</span> </span>
                <p class="footer-note">{{ t('footer.note') }}</p>
            </div>

            <nav class="footer-links" :aria-label="t('footer.linksTitle')">
                <p class="footer-heading">{{ t('footer.linksTitle') }}</p>
                <a href="#services">{{ t('services.title') }}</a>
                <a href="#flow">{{ t('flow.title') }}</a>
                <a href="#pricing">{{ t('pricing.title') }}</a>
                <a href="#faq">{{ t('faq.title') }}</a>
                <a href="#contact">{{ t('contact.title') }}</a>
            </nav>

            <div v-if="social.length" class="footer-social">
                <p class="footer-heading">{{ t('footer.connectTitle') }}</p>
                <div class="footer-social-links">
                    <a
                        v-for="[key, entry] in social"
                        :key="key"
                        :href="entry.url"
                        target="_blank"
                        rel="noopener noreferrer me"
                        :aria-label="entry.label"
                    >
                        <font-awesome-icon :icon="['fab', entry.icon]" />
                    </a>
                </div>
            </div>
        </div>

        <div class="footer-bottom container">
            <span>{{ t('footer.copyright', { year }) }}</span>
        </div>
    </footer>
</template>

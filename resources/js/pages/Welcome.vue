<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Seo from '@/components/Seo.vue';
import type { AppPageProps } from '@/types';
import App from '../App.vue';

const props = defineProps<{
    routeLocale: 'en' | 'ka';
}>();

// Sync the shared i18n locale to this route's `routeLocale` prop. `immediate:
// true` covers the initial SSR/mount pass; the watcher covers subsequent
// client-side Inertia visits between `/` and `/ka` that reuse this same page
// instance. (Named `routeLocale`, not `locale`, to avoid shadowing the i18n
// `locale` ref of the same name in this scope.)
const { t, tm, locale } = useI18n();
watch(
    () => props.routeLocale,
    (value) => (locale.value = value),
    { immediate: true },
);

const page = usePage<AppPageProps>();
const seo = computed(() => page.props.seoDefaults);

const socialUrls = computed(() => Object.values(seo.value.social).map((entry) => entry.url));

const organizationSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: seo.value.organization.name,
    url: `${seo.value.url}/`,
    logo: `${seo.value.url}${seo.value.organization.logo}`,
    image: `${seo.value.url}${seo.value.locales[locale.value]?.image ?? seo.value.defaultImage}`,
    description: t('seo.description'),
    areaServed: seo.value.organization.area_served,
    founder: {
        '@type': 'Person',
        name: t('developer.name'),
        jobTitle: t('developer.role'),
    },
    ...(socialUrls.value.length ? { sameAs: socialUrls.value } : {}),
}));

const websiteSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seo.value.siteName,
    url: `${seo.value.url}/`,
    inLanguage: locale.value,
}));

const faqSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (tm('faq.items') as Array<{ q: string; a: string }>).map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
        },
    })),
}));
</script>

<template>
    <Seo
        :title="t('seo.title')"
        :description="t('seo.description')"
        :keywords="tm('seo.keywords') as string[]"
        :json-ld="[organizationSchema, websiteSchema, faqSchema]"
    />
    <App />
</template>

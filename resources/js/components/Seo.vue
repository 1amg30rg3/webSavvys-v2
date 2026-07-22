<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AppPageProps } from '@/types';

interface JsonLdSchema {
    [key: string]: unknown;
}

const props = withDefaults(
    defineProps<{
        title: string;
        description: string;
        keywords?: string[];
        image?: string;
        type?: string;
        jsonLd?: JsonLdSchema[];
        noindex?: boolean;
    }>(),
    {
        keywords: () => [],
        image: undefined,
        type: 'website',
        jsonLd: () => [],
        noindex: false,
    },
);

const page = usePage<AppPageProps>();
const { locale } = useI18n();

const seo = computed(() => page.props.seoDefaults);

const currentPath = computed(() => page.url.split('?')[0]);
const canonicalUrl = computed(() => `${seo.value.url}${currentPath.value}`);

const fullTitle = computed(() => `${props.title} - ${seo.value.siteName}`);

const imageUrl = computed(() => {
    // Explicit `image` prop wins; otherwise prefer the current locale's own OG
    // image (e.g. og-image-ka.jpg) so shares from `/ka` show Georgian copy.
    const path = props.image ?? seo.value.locales[locale.value]?.image ?? seo.value.defaultImage;
    return path.startsWith('http') ? path : `${seo.value.url}${path}`;
});

const robotsContent = computed(() => (props.noindex ? 'noindex, nofollow' : 'index, follow'));

// Escape `<` so a stray closing-script-tag sequence inside any JSON-LD string
// value can't break out of the script element it's embedded in.
const LT = String.fromCharCode(60);
const toJsonLd = (schema: JsonLdSchema) => JSON.stringify(schema).split(LT).join('\\u003c');

const currentOgLocale = computed(() => seo.value.locales[locale.value]?.og_locale ?? seo.value.locales[seo.value.defaultLocale].og_locale);

const alternateLocales = computed(() => Object.entries(seo.value.locales).filter(([code]) => code !== locale.value));
</script>

<template>
    <Head :title="title">
        <meta name="description" :content="description" />
        <meta v-if="keywords.length" name="keywords" :content="keywords.join(', ')" />
        <meta name="robots" :content="robotsContent" />
        <link rel="canonical" :href="canonicalUrl" />

        <link v-for="(config, code) in seo.locales" :key="`hreflang-${code}`" rel="alternate" :hreflang="code" :href="`${seo.url}${config.path}`" />
        <link rel="alternate" hreflang="x-default" :href="`${seo.url}${seo.locales[seo.defaultLocale].path}`" />

        <meta property="og:type" :content="type" />
        <meta property="og:title" :content="fullTitle" />
        <meta property="og:description" :content="description" />
        <meta property="og:url" :content="canonicalUrl" />
        <meta property="og:site_name" :content="seo.siteName" />
        <meta property="og:image" :content="imageUrl" />
        <meta property="og:image:width" :content="String(seo.defaultImageWidth)" />
        <meta property="og:image:height" :content="String(seo.defaultImageHeight)" />
        <meta property="og:image:alt" :content="fullTitle" />
        <meta property="og:locale" :content="currentOgLocale" />
        <meta v-for="[code, config] in alternateLocales" :key="`og-alt-${code}`" property="og:locale:alternate" :content="config.og_locale" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" :content="fullTitle" />
        <meta name="twitter:description" :content="description" />
        <meta name="twitter:image" :content="imageUrl" />
        <meta v-if="seo.twitterHandle" name="twitter:site" :content="seo.twitterHandle" />

        <!-- eslint-disable vue/no-v-text-v-html-on-component -- the only way to render a raw script element from a Vue template; content is escaped in toJsonLd() -->
        <component :is="'script'" v-for="(schema, index) in jsonLd" :key="`jsonld-${index}`" type="application/ld+json" v-html="toJsonLd(schema)" />
        <!-- eslint-enable vue/no-v-text-v-html-on-component -->
    </Head>
</template>

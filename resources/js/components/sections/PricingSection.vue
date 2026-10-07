<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed, defineAsyncComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PreviewType } from '@/components/preview/types';
import WebsiteTypePreview from '@/components/sections/WebsiteTypePreview.vue';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import type { AppPageProps } from '@/types';

const props = defineProps<{
    chatUrl: string;
}>();

interface WebsiteType {
    key: string;
    name: string;
    bestFor: string;
    delivery: string;
    features: string[];
    message: string;
}

const { t, tm, locale } = useI18n();
const { sectionRef } = useScrollAnimation();
const page = usePage<AppPageProps>();

const currency = computed(() => page.props.pricing.currencies[locale.value] ?? 'gel');

const websiteTypes = computed(() =>
    ((tm('pricing.types') as WebsiteType[]) ?? []).map((type) => ({
        ...type,
        price: page.props.pricing.types[type.key]?.[currency.value] ?? null,
    })),
);

const includedItems = computed(() => (tm('pricing.included.items') as string[]) ?? []);
const termItems = computed(() => (tm('pricing.terms.items') as string[]) ?? []);

const formatAmount = (amount: number) => new Intl.NumberFormat(locale.value).format(amount);

const quoteUrl = (message: string) => `${props.chatUrl}?text=${encodeURIComponent(message)}`;

// Loaded on demand; hover or focus starts the fetch early.
const loadPreview = () => import('@/components/preview/PreviewModal.vue');
const PreviewModal = defineAsyncComponent(loadPreview);
const previewKey = ref<string | null>(null);

const previewTypes = computed<PreviewType[]>(() =>
    websiteTypes.value.map((type) => ({
        key: type.key,
        name: type.name,
        priceLabel:
            type.price !== null
                ? t('pricing.priceFrom', { price: t('pricing.amount', { amount: formatAmount(type.price) }) })
                : t('pricing.customPrice'),
        delivery: type.delivery,
        quoteUrl: quoteUrl(type.message),
        ctaLabel: type.price !== null ? t('pricing.cta') : t('pricing.ctaCustom'),
    })),
);
</script>

<template>
    <section class="pricing-section" id="pricing" ref="sectionRef">
        <div class="section-header" data-animate="fade-up">
            <p class="section-eyebrow">
                <font-awesome-icon :icon="['fas', 'tag']" />
                {{ t('pricing.eyebrow') }}
            </p>
            <h2 class="section-title">{{ t('pricing.title') }}</h2>
            <p class="section-text">{{ t('pricing.text') }}</p>
        </div>

        <div class="wtype-grid">
            <article
                v-for="(type, index) in websiteTypes"
                :key="type.key"
                class="wtype-card"
                :class="`wtype-card--${type.key}`"
                data-animate="fade-up"
                :data-delay="index * 100"
            >
                <div class="wtype-preview-wrap">
                    <WebsiteTypePreview :type="type.key" />
                    <!-- Mouse-only shortcut; the button below is the accessible one. -->
                    <button
                        class="wtype-preview-trigger"
                        type="button"
                        tabindex="-1"
                        aria-hidden="true"
                        @pointerenter="loadPreview"
                        @click="previewKey = type.key"
                    >
                        <span class="wtype-preview-hint">
                            <font-awesome-icon :icon="['fas', 'eye']" />
                            {{ t('pricing.preview.open') }}
                        </span>
                    </button>
                </div>

                <h3 class="wtype-name">{{ type.name }}</h3>
                <p class="wtype-best">{{ type.bestFor }}</p>

                <div class="wtype-price">
                    <i18n-t v-if="type.price !== null" keypath="pricing.priceFrom" tag="p" class="wtype-price-line" scope="global">
                        <template #price>
                            <span class="wtype-price-value">{{ t('pricing.amount', { amount: formatAmount(type.price) }) }}</span>
                        </template>
                    </i18n-t>
                    <template v-else>
                        <p class="wtype-price-line">
                            <span class="wtype-price-value wtype-price-value--custom">{{ t('pricing.customPrice') }}</span>
                        </p>
                        <p class="wtype-price-note">{{ t('pricing.customNote') }}</p>
                    </template>
                </div>

                <p class="wtype-delivery">
                    <font-awesome-icon :icon="['fas', 'clock']" />
                    <span>{{ t('pricing.deliveryLabel') }}</span>
                    <strong>{{ type.delivery }}</strong>
                </p>

                <ul class="wtype-features" role="list">
                    <li v-for="feature in type.features" :key="feature">
                        <font-awesome-icon :icon="['fas', 'check']" />
                        <span>{{ feature }}</span>
                    </li>
                </ul>

                <div class="wtype-actions">
                    <button
                        class="ghost-button wtype-preview-btn"
                        type="button"
                        :aria-label="`${t('pricing.preview.open')}: ${type.name}`"
                        @pointerenter="loadPreview"
                        @focus="loadPreview"
                        @click="previewKey = type.key"
                    >
                        <font-awesome-icon :icon="['fas', 'eye']" />
                        {{ t('pricing.preview.open') }}
                    </button>
                    <a class="primary-button wtype-cta" :href="quoteUrl(type.message)" target="_blank" rel="noopener">
                        {{ type.price !== null ? t('pricing.cta') : t('pricing.ctaCustom') }}
                        <font-awesome-icon :icon="['fas', 'arrow-right']" />
                    </a>
                </div>
            </article>
        </div>

        <div class="pricing-terms" data-animate="fade-up" data-delay="200">
            <div class="pricing-terms-col">
                <h3>{{ t('pricing.included.title') }}</h3>
                <ul role="list">
                    <li v-for="item in includedItems" :key="item">
                        <font-awesome-icon :icon="['fas', 'check']" />
                        <span>{{ item }}</span>
                    </li>
                </ul>
            </div>
            <div class="pricing-terms-col">
                <h3>{{ t('pricing.terms.title') }}</h3>
                <ul role="list">
                    <li v-for="item in termItems" :key="item">
                        <font-awesome-icon :icon="['fas', 'check']" />
                        <span>{{ item }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <PreviewModal v-if="previewKey" :types="previewTypes" :active="previewKey" @select="previewKey = $event" @close="previewKey = null" />
    </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import { vTilt } from '@/composables/useTilt';

const { t } = useI18n();
const { sectionRef } = useScrollAnimation();
</script>

<template>
    <section id="growth" ref="sectionRef">
        <div class="section-header" data-animate="fade-up">
            <p class="section-eyebrow">
                <font-awesome-icon :icon="['fas', 'chart-line']" />
                {{ t('growth.eyebrow') }}
            </p>
            <h2 class="section-title">{{ t('growth.title') }}</h2>
        </div>
        <div class="feature-grid">
            <div class="feature-card feature-card--seo" v-tilt data-animate="fade-up" data-delay="150">
                <svg class="feature-art" viewBox="0 0 280 150" aria-hidden="true" focusable="false">
                    <defs>
                        <linearGradient id="growth-line" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0" style="stop-color: var(--accent)" />
                            <stop offset="1" style="stop-color: var(--accent-3)" />
                        </linearGradient>
                        <linearGradient id="growth-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" style="stop-color: var(--accent); stop-opacity: 0.24" />
                            <stop offset="1" style="stop-color: var(--accent); stop-opacity: 0" />
                        </linearGradient>
                    </defs>
                    <path class="fa-grid" d="M0 30h280M0 70h280M0 110h280M0 149h280" />
                    <path d="M4 128 48 112 92 118 138 86 184 92 230 52 274 24V150H4Z" fill="url(#growth-area)" />
                    <path class="fa-line" d="M4 128 48 112 92 118 138 86 184 92 230 52 274 24" stroke="url(#growth-line)" />
                    <circle class="fa-node" cx="138" cy="86" r="4" />
                    <circle class="fa-node" cx="230" cy="52" r="4" />
                    <circle class="fa-node fa-node--end" cx="274" cy="24" r="5" />
                </svg>
                <div class="service-icon">
                    <font-awesome-icon :icon="['fas', 'chart-line']" />
                </div>
                <h3>{{ t('growth.seoTitle') }}</h3>
                <p>{{ t('growth.seoText') }}</p>
            </div>
            <div class="feature-card feature-card--ads" v-tilt data-animate="fade-up" data-delay="300">
                <svg class="feature-art" viewBox="0 0 280 150" aria-hidden="true" focusable="false">
                    <circle class="fa-ring" cx="200" cy="75" r="68" />
                    <circle class="fa-ring" cx="200" cy="75" r="46" />
                    <circle class="fa-ring fa-ring--inner" cx="200" cy="75" r="24" />
                    <path class="fa-aim" d="M22 134 190 79" />
                    <circle class="fa-node" cx="22" cy="134" r="4" />
                    <circle class="fa-core" cx="200" cy="75" r="7" />
                    <circle class="fa-dot" cx="246" cy="29" r="3" />
                    <circle class="fa-dot" cx="154" cy="121" r="3" />
                    <circle class="fa-dot" cx="263" cy="98" r="3" />
                </svg>
                <div class="service-icon">
                    <font-awesome-icon :icon="['fas', 'lightbulb']" />
                </div>
                <h3>{{ t('growth.adsTitle') }}</h3>
                <p>{{ t('growth.adsText') }}</p>
            </div>
        </div>
    </section>
</template>

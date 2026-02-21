<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useScrollAnimation } from '@/composables/useScrollAnimation';

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
            <div class="feature-card" data-animate="fade-up" data-delay="150">
                <div class="service-icon">
                    <font-awesome-icon :icon="['fas', 'chart-line']" />
                </div>
                <h3>{{ t('growth.seoTitle') }}</h3>
                <p>{{ t('growth.seoText') }}</p>
            </div>
            <div class="feature-card" data-animate="fade-up" data-delay="300">
                <div class="service-icon">
                    <font-awesome-icon :icon="['fas', 'lightbulb']" />
                </div>
                <h3>{{ t('growth.adsTitle') }}</h3>
                <p>{{ t('growth.adsText') }}</p>
            </div>
        </div>
    </section>
</template>

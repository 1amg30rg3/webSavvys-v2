<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import { vTilt } from '@/composables/useTilt';

const { t } = useI18n();
const { sectionRef } = useScrollAnimation();
</script>

<template>
    <section class="section-payment" id="payment" ref="sectionRef">
        <div class="section-header" data-animate="fade-up">
            <div class="section-eyebrow-wrapper">
                <p class="section-eyebrow">
                    <font-awesome-icon :icon="['fas', 'credit-card']" />
                    {{ t('payment.eyebrow') }}
                </p>
            </div>
            <h2 class="section-title">{{ t('payment.title') }}</h2>
            <p class="section-text">{{ t('payment.subtitle') }}</p>
        </div>
        <div class="payment-grid">
            <div class="payment-card payment-advance" v-tilt data-animate="fade-up" data-delay="50">
                <div class="payment-percentage">30%</div>
                <h3>{{ t('payment.advance.title') }}</h3>
                <p>{{ t('payment.advance.description') }}</p>
            </div>
            <div class="payment-card payment-final" v-tilt data-animate="fade-up" data-delay="100">
                <div class="payment-percentage">70%</div>
                <h3>{{ t('payment.final.title') }}</h3>
                <p>{{ t('payment.final.description') }}</p>
            </div>
        </div>
        <p class="payment-note" data-animate="fade-up" data-delay="150">{{ t('payment.note') }}</p>
    </section>
</template>

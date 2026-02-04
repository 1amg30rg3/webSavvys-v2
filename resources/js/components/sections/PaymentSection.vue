<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <section class="section section-payment" id="payment">
        <div class="section-header">
            <h2>{{ t('payment.title') }}</h2>
            <p class="section-text">{{ t('payment.subtitle') }}</p>
        </div>
        <div class="payment-grid">
            <div class="payment-card payment-advance">
                <div class="payment-percentage">30%</div>
                <h3>{{ t('payment.advance.title') }}</h3>
                <p>{{ t('payment.advance.description') }}</p>
            </div>
            <div class="payment-card payment-final">
                <div class="payment-percentage">70%</div>
                <h3>{{ t('payment.final.title') }}</h3>
                <p>{{ t('payment.final.description') }}</p>
            </div>
        </div>
        <p class="payment-note">{{ t('payment.note') }}</p>
    </section>
</template>

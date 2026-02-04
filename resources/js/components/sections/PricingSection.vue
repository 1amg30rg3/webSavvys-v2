<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <section class="section" id="pricing">
        <div class="section-header">
            <h2>{{ t('pricing.title') }}</h2>
            <p class="section-text">{{ t('pricing.text') }}</p>
        </div>
    </section>
</template>

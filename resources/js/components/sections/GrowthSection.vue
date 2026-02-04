<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <section class="section" id="growth">
        <div class="section-header">
            <h2>{{ t('growth.title') }}</h2>
        </div>
        <div class="feature-grid">
            <div class="feature-card">
                <h3>
                    <font-awesome-icon :icon="['fas', 'chart-line']" />
                    {{ t('growth.seoTitle') }}
                </h3>
                <p>{{ t('growth.seoText') }}</p>
            </div>
            <div class="feature-card">
                <h3>
                    <font-awesome-icon :icon="['fas', 'lightbulb']" />
                    {{ t('growth.adsTitle') }}
                </h3>
                <p>{{ t('growth.adsText') }}</p>
            </div>
        </div>
    </section>
</template>

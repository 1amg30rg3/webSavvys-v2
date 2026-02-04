<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <section class="section" id="about">
        <div class="section-header">
            <h2>{{ t('about.title') }}</h2>
        </div>
        <p class="section-text">{{ t('about.text') }}</p>
    </section>
</template>

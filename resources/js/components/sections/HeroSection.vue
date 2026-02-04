<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
    chatUrl: string;
    localeLabel: string;
}>();

const { t, tm } = useI18n();

const stackItems = computed(() => (tm('hero.stack') as string[]) ?? []);
</script>

<template>
    <section class="hero" id="hero">
        <div class="hero-content">
            <p class="eyebrow">{{ t('hero.eyebrow') }}</p>
            <transition name="fade-slide" appear>
                <h1 class="hero-title">{{ t('hero.title') }}</h1>
            </transition>
            <p class="hero-subtitle">{{ t('hero.subtitle') }}</p>
            <div class="hero-actions">
                <a class="primary-button" :href="chatUrl" target="_blank" rel="noopener">
                    <font-awesome-icon :icon="['fas', 'rocket']" />
                    {{ t('hero.cta') }}
                </a>
                <a class="ghost-button" href="#services">
                    {{ t('hero.secondaryCta') }}
                    <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </a>
            </div>
        </div>
        <div class="hero-card">
            <div class="card-header">
                <span class="card-label">{{ t('hero.stackTitle') }}</span>
                <span class="card-chip">{{ localeLabel }}</span>
            </div>
            <ul class="stack-list" role="list">
                <li v-for="item in stackItems" :key="item">{{ item }}</li>
            </ul>
            <div class="card-footer">
                <span class="status-dot" />
                <span>
                    <font-awesome-icon :icon="['fas', 'check']" />
                    {{ t('services.title') }}
                </span>
            </div>
        </div>
    </section>
</template>

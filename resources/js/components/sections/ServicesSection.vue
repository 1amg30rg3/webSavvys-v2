<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import { vTilt } from '@/composables/useTilt';

const { t, tm } = useI18n();
const { sectionRef } = useScrollAnimation();

const serviceItems = computed(() => (tm('services.items') as Array<{ title: string; description: string }>) ?? []);

const serviceIcons = ['code', 'palette', 'mobile-alt', 'bolt'];
const getServiceIcon = (index: number) => serviceIcons[index % serviceIcons.length];
</script>

<template>
    <section id="services" ref="sectionRef">
        <div class="section-header" data-animate="fade-up">
            <p class="section-eyebrow">
                <font-awesome-icon :icon="['fas', 'layer-group']" />
                {{ t('services.eyebrow') }}
            </p>
            <h2 class="section-title">{{ t('services.title') }}</h2>
            <p class="section-text">{{ t('services.description') }}</p>
        </div>
        <div class="services-grid">
            <div
                v-for="(item, index) in serviceItems"
                :key="`service-${index}`"
                class="service-card"
                v-tilt
                data-animate="fade-up"
                :data-delay="index * 150"
            >
                <div class="service-icon">
                    <font-awesome-icon :icon="['fas', getServiceIcon(index)]" />
                </div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
            </div>
        </div>
    </section>
</template>

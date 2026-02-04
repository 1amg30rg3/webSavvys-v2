<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n();

const serviceItems = computed(() => (tm('services.items') as Array<{ title: string; description: string }>) ?? []);

const serviceIcons = ['code', 'palette', 'mobile-alt', 'bolt'];
const getServiceIcon = (index: number) => serviceIcons[index % serviceIcons.length];
</script>

<template>
    <section class="section" id="services">
        <div class="section-header">
            <h2>{{ t('services.title') }}</h2>
            <p class="section-text">{{ t('services.description') }}</p>
        </div>
        <div class="services-grid">
            <div v-for="(item, index) in serviceItems" :key="item.title" class="service-card">
                <div class="service-icon">
                    <font-awesome-icon :icon="['fas', getServiceIcon(index)]" />
                </div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
            </div>
        </div>
    </section>
</template>

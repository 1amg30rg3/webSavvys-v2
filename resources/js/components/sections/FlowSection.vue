<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useScrollAnimation } from '@/composables/useScrollAnimation';

const { t, tm } = useI18n();
const { sectionRef } = useScrollAnimation();

const flowSteps = computed(() => (tm('flow.steps') as Array<{ title: string; description: string }>) ?? []);
</script>

<template>
    <section id="flow" ref="sectionRef">
        <div class="section-header" data-animate="fade-up">
            <p class="section-eyebrow">
                <font-awesome-icon :icon="['fas', 'route']" />
                {{ t('flow.eyebrow') }}
            </p>
            <h2 class="section-title">{{ t('flow.title') }}</h2>
            <p class="section-text">{{ t('flow.subtitle') }}</p>
        </div>
        <div class="flow-timeline">
            <div v-for="(step, index) in flowSteps" :key="`flow-step-${index}`" class="flow-step-card" data-animate="fade-up" :data-delay="index * 100">
                <div class="flow-step-number">{{ index + 1 }}</div>
                <div class="flow-step-content">
                    <h3>{{ step.title }}</h3>
                    <p>{{ step.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

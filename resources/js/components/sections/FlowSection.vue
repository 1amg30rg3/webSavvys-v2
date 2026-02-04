<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n();

const flowSteps = computed(() => (tm('flow.steps') as Array<{ title: string; description: string }>) ?? []);
</script>

<template>
    <section class="section section-flow" id="flow">
        <div class="section-header">
            <h2>{{ t('flow.title') }}</h2>
            <p class="section-text">{{ t('flow.subtitle') }}</p>
        </div>
        <div class="flow-timeline">
            <div v-for="(step, index) in flowSteps" :key="step.title" class="flow-step-card">
                <div class="flow-step-number">{{ index + 1 }}</div>
                <div class="flow-step-content">
                    <h3>{{ step.title }}</h3>
                    <p>{{ step.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

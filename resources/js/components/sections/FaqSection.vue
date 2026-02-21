<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useScrollAnimation } from '@/composables/useScrollAnimation';

const { t, tm } = useI18n();
const { sectionRef } = useScrollAnimation();

const faqItems = computed(() => (tm('faq.items') as Array<{ q: string; a: string }>) ?? []);
const openFaqIndex = ref<number | null>(null);

const toggleFaq = (index: number) => {
    openFaqIndex.value = openFaqIndex.value === index ? null : index;
};
</script>

<template>
    <section class="section-faq" id="faq" ref="sectionRef">
        <div class="section-header" data-animate="fade-up">
            <p class="section-eyebrow">
                <font-awesome-icon :icon="['fas', 'question-circle']" />
                {{ t('faq.eyebrow') }}
            </p>
            <h2 class="section-title">{{ t('faq.title') }}</h2>
        </div>
        <div class="faq-accordion" data-animate="fade-up" data-delay="80">
            <div
                v-for="(item, index) in faqItems"
                :key="item.q"
                class="faq-accordion-item"
                :class="{ 'is-open': openFaqIndex === index }"
            >
                <button class="faq-question" @click="toggleFaq(index)" type="button">
                    <span>
                        <font-awesome-icon :icon="['fa-regular', 'fa-circle']" />
                        {{ item.q }}
                    </span>
                    <font-awesome-icon :icon="['fas', 'arrow-right']" class="faq-icon" />
                </button>
                <div class="faq-answer-wrap" :class="{ 'is-open': openFaqIndex === index }">
                    <div class="faq-answer">
                        <p>{{ item.a }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

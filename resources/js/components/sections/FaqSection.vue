<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n();

const faqItems = computed(() => (tm('faq.items') as Array<{ q: string; a: string }>) ?? []);
const openFaqIndex = ref<number | null>(null);

const toggleFaq = (index: number) => {
    openFaqIndex.value = openFaqIndex.value === index ? null : index;
};
</script>

<template>
    <section class="section section-faq" id="faq">
        <div class="section-header">
            <h2>{{ t('faq.title') }}</h2>
        </div>
        <div class="faq-accordion">
            <div
                v-for="(item, index) in faqItems"
                :key="item.q"
                class="faq-accordion-item"
                :class="{ 'is-open': openFaqIndex === index }"
            >
                <button class="faq-question" @click="toggleFaq(index)" type="button">
                    <span>{{ item.q }}</span>
                    <font-awesome-icon :icon="['fas', 'arrow-right']" class="faq-icon" />
                </button>
                <transition name="faq-answer">
                    <div v-if="openFaqIndex === index" class="faq-answer">
                        <p>{{ item.a }}</p>
                    </div>
                </transition>
            </div>
        </div>
    </section>
</template>

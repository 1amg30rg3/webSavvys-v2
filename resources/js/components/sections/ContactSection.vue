<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useScrollAnimation } from '@/composables/useScrollAnimation';

defineProps<{
    emailLink: string;
    chatUrl: string;
    phoneLink: string;
}>();

const { t } = useI18n();
const { sectionRef } = useScrollAnimation();
</script>

<template>
    <section class="section-contact" id="contact" ref="sectionRef">
        <div class="contact-wrapper">
            <div class="contact-content" data-animate="fade-up">
                <p class="section-eyebrow section-eyebrow-light">
                    <font-awesome-icon :icon="['fas', 'paper-plane']" />
                    {{ t('contact.eyebrow') }}
                </p>
                <h2 class="section-title">{{ t('contact.title') }}</h2>
                <p class="contact-description">{{ t('contact.text') }}</p>
                <div class="contact-methods">
                    <a class="contact-method" :href="emailLink" data-animate="fade-up" data-delay="50">
                        <div class="contact-method-icon">
                            <font-awesome-icon :icon="['fas', 'envelope']" />
                        </div>
                        <div class="contact-method-info">
                            <h4>{{ t('contact.emailLabel') }}</h4>
                            <p>contact@websavvys.com</p>
                        </div>
                    </a>
                    <a class="contact-method" :href="phoneLink" data-animate="fade-up" data-delay="100">
                        <div class="contact-method-icon">
                            <font-awesome-icon :icon="['fas', 'phone']" />
                        </div>
                        <div class="contact-method-info">
                            <h4>{{ t('contact.phoneLabel') }}</h4>
                            <p>+995 555 219 234</p>
                        </div>
                    </a>
                    <a class="contact-method" :href="chatUrl" target="_blank" rel="noopener" data-animate="fade-up" data-delay="150">
                        <div class="contact-method-icon">
                            <font-awesome-icon :icon="['fas', 'comments']" />
                        </div>
                        <div class="contact-method-info">
                            <h4>{{ t('contact.chatMethodLabel') }}</h4>
                            <p>{{ t('contact.chatLabel') }}</p>
                        </div>
                    </a>
                </div>
            </div>
            <div class="contact-cta" data-animate="fade-up" data-delay="200">
                <a class="primary-button primary-button-large" :href="chatUrl" target="_blank" rel="noopener">
                    {{ t('contact.chatCta') }}
                    <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </a>
            </div>
        </div>
    </section>
</template>

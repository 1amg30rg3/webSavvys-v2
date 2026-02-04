<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
    emailLink: string;
    chatUrl: string;
}>();

const { t } = useI18n();
</script>

<template>
    <section class="section section-contact" id="contact">
        <div class="contact-wrapper">
            <div class="contact-content">
                <h2>{{ t('contact.title') }}</h2>
                <p class="contact-description">{{ t('contact.text') }}</p>
                <div class="contact-methods">
                    <a class="contact-method" :href="emailLink">
                        <div class="contact-method-icon">
                            <font-awesome-icon :icon="['fas', 'envelope']" />
                        </div>
                        <div class="contact-method-info">
                            <h4>{{ t('contact.emailLabel') }}</h4>
                            <p>{{ t('contact.email') }}</p>
                        </div>
                    </a>
                    <a class="contact-method" :href="chatUrl" target="_blank" rel="noopener">
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
            <div class="contact-cta">
                <a class="primary-button primary-button-large" :href="chatUrl" target="_blank" rel="noopener">
                    {{ t('contact.chatCta') }}
                    <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </a>
            </div>
        </div>
    </section>
</template>

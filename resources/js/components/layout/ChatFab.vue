<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
    chatUrl: string;
}>();

const { t } = useI18n();
</script>

<template>
    <a class="chat-fab" :href="chatUrl" target="_blank" rel="noopener" aria-label="Live chat">
        <font-awesome-icon :icon="['fas', 'comments']" />
        <span class="chat-fab-label">{{ t('contact.chatLabel') }}</span>
    </a>
</template>

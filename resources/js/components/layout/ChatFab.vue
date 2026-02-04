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
        {{ t('contact.chatLabel') }}
    </a>
</template>

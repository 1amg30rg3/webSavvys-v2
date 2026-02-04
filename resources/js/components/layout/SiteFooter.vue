<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <footer class="site-footer">
        <div class="container">
            <span>{{ t('footer.note') }}</span>
        </div>
    </footer>
</template>

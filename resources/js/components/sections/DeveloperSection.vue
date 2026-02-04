<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
    portfolioUrl: string;
}>();

const { t } = useI18n();
</script>

<template>
    <section class="section section-developer" id="developer">
        <div class="section-header">
            <p class="eyebrow">{{ t('developer.subtitle') }}</p>
            <h2>{{ t('developer.title') }}</h2>
        </div>
        <div class="developer-card">
            <div class="developer-image">
                <img src="me.jpeg" alt="Developer Photo" />
                <div class="developer-stats">
                    <div class="stat-item">
                        <font-awesome-icon :icon="['fas', 'check']" />
                        <span>{{ t('developer.experience') }}</span>
                    </div>
                    <div class="stat-item">
                        <font-awesome-icon :icon="['fas', 'rocket']" />
                        <span>{{ t('developer.projects') }}</span>
                    </div>
                    <div class="stat-item">
                        <font-awesome-icon :icon="['fas', 'code']" />
                        <span>{{ t('developer.technologies') }}</span>
                    </div>
                </div>
            </div>
            <div class="developer-info">
                <h3 class="developer-name">{{ t('developer.name') }}</h3>
                <p class="developer-role">{{ t('developer.role') }}</p>
                <p class="developer-bio">{{ t('developer.bio') }}</p>
                <div class="developer-actions">
                    <a class="primary-button" :href="portfolioUrl" target="_blank" rel="noopener">
                        {{ t('developer.cta') }}
                        <font-awesome-icon :icon="['fas', 'arrow-right']" />
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

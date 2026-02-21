<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useScrollAnimation } from '@/composables/useScrollAnimation';

defineProps<{
    portfolioUrl: string;
}>();

const { t } = useI18n();
const { sectionRef } = useScrollAnimation();
</script>

<template>
    <section class="section-developer" id="developer" ref="sectionRef">
        <div class="dev-inner">

            <!-- LEFT: Image column -->
            <div class="dev-image-col" data-animate="fade-right" style="--delay: 0s">

                <!-- Decorative corner marks -->
                <span class="dev-corner dev-corner--tl" aria-hidden="true"></span>
                <span class="dev-corner dev-corner--br" aria-hidden="true"></span>

                <div class="dev-image-wrap">
                    <img src="me.jpeg" :alt="t('developer.name')" class="dev-photo" />
                    <!-- Gradient overlay -->
                    <div class="dev-image-overlay" aria-hidden="true"></div>
                </div>

                <!-- Floating stat cards -->
                <div class="dev-stat-cards" aria-hidden="true">
                    <div class="dev-stat-card" data-animate="fade-up" style="--delay: 0.2s">
                        <font-awesome-icon :icon="['fas', 'check']" class="dev-stat-icon" />
                        <span class="dev-stat-text">{{ t('developer.experience') }}</span>
                    </div>
                    <div class="dev-stat-card" data-animate="fade-up" style="--delay: 0.28s">
                        <font-awesome-icon :icon="['fas', 'rocket']" class="dev-stat-icon" />
                        <span class="dev-stat-text">{{ t('developer.projects') }}</span>
                    </div>
                    <div class="dev-stat-card" data-animate="fade-up" style="--delay: 0.36s">
                        <font-awesome-icon :icon="['fas', 'code']" class="dev-stat-icon" />
                        <span class="dev-stat-text">{{ t('developer.technologies') }}</span>
                    </div>
                </div>

                <!-- Availability badge -->
                <div class="dev-avail-badge" aria-hidden="true">
                    <span class="dev-avail-dot"></span>
                    Open to work
                </div>

            </div>

            <!-- RIGHT: Info column -->
            <div class="dev-info-col">

                <div class="section-header" data-animate="fade-up">
                    <p class="section-eyebrow">
                        <font-awesome-icon :icon="['fas', 'user']" />
                        {{ t('developer.subtitle') }}
                    </p>
                    <h2>
                        <span class="section-title-accent">{{ t('developer.title') }}</span>
                    </h2>
                </div>

                <div class="dev-name-block" data-animate="fade-up" style="--delay: 0.08s">
                    <h3 class="dev-name">{{ t('developer.name') }}</h3>
                    <p class="dev-role">{{ t('developer.role') }}</p>
                </div>

                <!-- Divider -->
                <div class="dev-rule" data-animate="fade-up" style="--delay: 0.12s" aria-hidden="true">
                    <span class="dev-rule-line"></span>
                    <span class="dev-rule-dot"></span>
                    <span class="dev-rule-line"></span>
                </div>

                <p class="dev-bio" data-animate="fade-up" style="--delay: 0.16s">
                    {{ t('developer.bio') }}
                </p>

                <!-- Skill bars -->
                <div class="dev-skills" data-animate="fade-up" style="--delay: 0.2s" aria-hidden="true">
                    <div class="dev-skill">
                        <span class="dev-skill-label">Frontend</span>
                        <div class="dev-skill-track">
                            <div class="dev-skill-fill" style="--sw: 95%; --sc: var(--accent); --sd: 0.3s;"></div>
                        </div>
                        <span class="dev-skill-pct">95%</span>
                    </div>
                    <div class="dev-skill">
                        <span class="dev-skill-label">Backend</span>
                        <div class="dev-skill-track">
                            <div class="dev-skill-fill" style="--sw: 80%; --sc: var(--accent-2); --sd: 0.4s;"></div>
                        </div>
                        <span class="dev-skill-pct">80%</span>
                    </div>
                    <div class="dev-skill">
                        <span class="dev-skill-label">UI / UX</span>
                        <div class="dev-skill-track">
                            <div class="dev-skill-fill" style="--sw: 88%; --sc: var(--accent-3); --sd: 0.5s;"></div>
                        </div>
                        <span class="dev-skill-pct">88%</span>
                    </div>
                </div>

                <div class="dev-actions" data-animate="fade-up" style="--delay: 0.24s">
                    <a class="primary-button" :href="portfolioUrl" target="_blank" rel="noopener">
                        {{ t('developer.cta') }}
                        <font-awesome-icon :icon="['fas', 'arrow-right']" />
                    </a>
                </div>

            </div>
        </div>
    </section>
</template>

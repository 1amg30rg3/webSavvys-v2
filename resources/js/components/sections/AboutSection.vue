<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCountUp } from '@/composables/useCountUp';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import { vTilt } from '@/composables/useTilt';

const { t } = useI18n();
const { sectionRef } = useScrollAnimation();

const gridWrapRef = ref<HTMLElement | null>(null);
const { value: perfScoreCount } = useCountUp(gridWrapRef, 99);
const { value: deliveredCount } = useCountUp(gridWrapRef, 120);
const { value: uptimeCount } = useCountUp(gridWrapRef, 99.9, { decimals: 1 });
</script>

<template>
    <section class="section-background-light about-section" id="about" ref="sectionRef">
        <div class="about-inner">
            <div class="about-content">
                <div class="section-header" data-animate="fade-up">
                    <p class="section-eyebrow">
                        <font-awesome-icon :icon="['fas', 'info-circle']" />
                        {{ t('about.eyebrow') }}
                    </p>
                    <h2 class="section-title">{{ t('about.title') }}</h2>
                </div>

                <p class="section-text" data-animate="fade-up" style="--delay: 0.1s">
                    {{ t('about.text') }}
                </p>

                <div class="about-tags" data-animate="fade-up" style="--delay: 0.2s">
                    <span class="about-tag">{{ t('about.tags.performanceFirst') }}</span>
                    <span class="about-tag">{{ t('about.tags.cleanArchitecture') }}</span>
                    <span class="about-tag">{{ t('about.tags.scalableSystems') }}</span>
                    <span class="about-tag">{{ t('about.tags.uxDriven') }}</span>
                    <span class="about-tag">{{ t('about.tags.longTermSupport') }}</span>
                </div>
            </div>

            <div class="about-grid-wrap" ref="gridWrapRef" data-animate="fade-up" style="--delay: 0.15s" aria-hidden="true">
                <div class="grid-bg"></div>

                <div class="scan-beam"></div>

                <span class="coord coord-tl">{{ t('about.metrics.coordBuild') }}</span>
                <span class="coord coord-br">v2.0.25</span>

                <div class="metric-grid">
                    <div class="m-card" v-tilt style="--pulse-delay: 0s; --pulse-color: rgba(45, 180, 164, 0.2)">
                        <span class="m-icon">⚡</span>
                        <span class="m-label">{{ t('about.metrics.perfScore') }}</span>
                        <span class="m-value" style="color: var(--accent-2)">{{ perfScoreCount }}</span>
                        <div class="m-bar">
                            <div class="m-bar-fill" style="--from: 88%; --to: 99%; --bar-dur: 3s; --bar-delay: 0s"></div>
                        </div>
                    </div>

                    <div class="m-card" v-tilt style="--pulse-delay: 0s; --pulse-color: rgba(45, 180, 164, 0.2)">
                        <div class="m-live">
                            <span class="m-dot"></span>
                            <span class="m-label" style="margin-bottom: 0">{{ t('about.metrics.avgLoad') }}</span>
                        </div>
                        <span class="m-value" style="color: var(--accent-2)">0.8s</span>
                        <div class="m-bar">
                            <div class="m-bar-fill" style="--from: 88%; --to: 99%; --bar-dur: 3s; --bar-delay: 0s"></div>
                        </div>
                    </div>

                    <div class="m-card" v-tilt style="--pulse-delay: 0.7s; --pulse-color: rgba(255, 106, 91, 0.15)">
                        <span class="m-icon">🛠</span>
                        <span class="m-label">{{ t('about.metrics.delivered') }}</span>
                        <span class="m-value">{{ deliveredCount }}+</span>
                    </div>

                    <div class="m-card" v-tilt style="--pulse-delay: 1.4s; --pulse-color: rgba(248, 194, 78, 0.15)">
                        <span class="m-icon">🧩</span>
                        <span class="m-label">{{ t('about.metrics.stack') }}</span>
                        <span class="m-value m-value--small" style="color: var(--accent)">
                            {{ t('about.metrics.stackValueTop') }}<br />{{ t('about.metrics.stackValueBottom') }}
                        </span>
                    </div>

                    <div class="m-card m-card--wide" v-tilt style="--pulse-delay: 0.35s; --pulse-color: rgba(255, 106, 91, 0.1)">
                        <span class="m-icon m-icon--lg">🏗</span>
                        <div class="m-card-body">
                            <span class="m-label">{{ t('about.metrics.architecture') }}</span>
                            <span class="m-value m-value--md">{{ t('about.metrics.architectureValue') }}</span>
                            <div class="m-bar">
                                <div
                                    class="m-bar-fill"
                                    style="
                                        --from: 55%;
                                        --to: 90%;
                                        --bar-dur: 4s;
                                        --bar-delay: 1s;
                                        background: linear-gradient(90deg, var(--accent), var(--accent-3));
                                    "
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div class="m-card" v-tilt style="--pulse-delay: 1.9s; --pulse-color: rgba(45, 180, 164, 0.2)">
                        <div class="m-live">
                            <span class="m-dot"></span>
                            <span class="m-label" style="margin-bottom: 0">{{ t('about.metrics.live') }}</span>
                        </div>
                        <span class="m-label">{{ t('about.metrics.uptime') }}</span>
                        <span class="m-value" style="color: var(--accent-2)">{{ uptimeCount }}%</span>
                    </div>

                    <div class="m-card" v-tilt style="--pulse-delay: 1.1s; --pulse-color: rgba(255, 106, 91, 0.15)">
                        <span class="m-icon">✦</span>
                        <span class="m-label">{{ t('about.metrics.built') }}</span>
                        <span class="m-value m-value--small" style="color: var(--accent)">
                            {{ t('about.metrics.builtValueTop') }}<br />{{ t('about.metrics.builtValueBottom') }}
                        </span>
                    </div>

                    <div class="m-card" v-tilt style="--pulse-delay: 0.5s; --pulse-color: rgba(248, 194, 78, 0.15)">
                        <span class="m-icon">🎯</span>
                        <span class="m-label">{{ t('about.metrics.uxScore') }}</span>
                        <span class="m-value">A+</span>
                    </div>

                    <div class="m-card m-card--wide" v-tilt style="--pulse-delay: 0.9s; --pulse-color: rgba(45, 180, 164, 0.12)">
                        <span class="m-icon m-icon--lg">🔄</span>
                        <div class="m-card-body">
                            <span class="m-label">{{ t('about.metrics.maintainability') }}</span>
                            <span class="m-value m-value--md">{{ t('about.metrics.maintainabilityValue') }}</span>
                            <div class="m-bar">
                                <div
                                    class="m-bar-fill"
                                    style="
                                        --from: 65%;
                                        --to: 95%;
                                        --bar-dur: 3.5s;
                                        --bar-delay: 0.5s;
                                        background: linear-gradient(90deg, var(--accent-2), var(--accent-3));
                                    "
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stream" aria-hidden="true">
                    <span class="stream-dot" style="--sd: 0s"></span>
                    <span class="stream-dot" style="--sd: 0.2s"></span>
                    <span class="stream-dot" style="--sd: 0.4s"></span>
                    <span class="stream-dot" style="--sd: 0.6s"></span>
                    <span class="stream-dot" style="--sd: 0.8s"></span>
                    <span class="stream-dot" style="--sd: 1s"></span>
                    <span class="stream-dot" style="--sd: 1.2s"></span>
                </div>
            </div>
        </div>
    </section>
</template>

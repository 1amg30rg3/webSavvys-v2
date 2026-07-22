<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import { vTilt } from '@/composables/useTilt';

const { t } = useI18n();
const { sectionRef } = useScrollAnimation();
</script>

<template>
    <section class="section-background-light pricing-section" id="pricing" ref="sectionRef">
        <div class="pricing-inner">
            <!-- LEFT: Text content -->
            <div class="pricing-content">
                <div class="section-header" data-animate="fade-up">
                    <p class="section-eyebrow">
                        <font-awesome-icon :icon="['fas', 'tag']" />
                        {{ t('pricing.eyebrow') }}
                    </p>
                    <h2 class="section-title">{{ t('pricing.title') }}</h2>
                    <p class="section-text">{{ t('pricing.text') }}</p>
                </div>

                <div class="pricing-highlights" data-animate="fade-up" style="--delay: 0.1s">
                    <div class="p-highlight">
                        <span class="p-highlight-icon">✦</span>
                        <span>{{ t('pricing.highlights.noHiddenFees') }}</span>
                    </div>
                    <div class="p-highlight">
                        <span class="p-highlight-icon">✦</span>
                        <span>{{ t('pricing.highlights.milestonePayments') }}</span>
                    </div>
                    <div class="p-highlight">
                        <span class="p-highlight-icon">✦</span>
                        <span>{{ t('pricing.highlights.scopeOrRetainer') }}</span>
                    </div>
                    <div class="p-highlight">
                        <span class="p-highlight-icon">✦</span>
                        <span>{{ t('pricing.highlights.discoveryCall') }}</span>
                    </div>
                </div>
            </div>

            <!-- RIGHT: Animated pricing visual -->
            <div class="pricing-grid-wrap" data-animate="fade-up" style="--delay: 0.15s" aria-hidden="true">
                <div class="pgrid-bg"></div>
                <div class="pgrid-scan"></div>

                <span class="pgrid-coord pgrid-coord--tl">{{ t('pricing.metrics.coordPricing') }}</span>
                <span class="pgrid-coord pgrid-coord--br">v2.0.25</span>

                <!-- Main content -->
                <div class="pgrid-content">
                    <!-- Top: payment split visual -->
                    <div class="pgrid-split-card">
                        <div class="pgrid-split-label">{{ t('pricing.metrics.paymentStructure') }}</div>
                        <div class="pgrid-split-bars">
                            <div class="pgrid-split-bar pgrid-split-bar--a">
                                <div
                                    class="pgrid-split-fill"
                                    style="--w: 30%; background: linear-gradient(90deg, var(--accent), var(--accent-3))"
                                ></div>
                                <span class="pgrid-split-text">{{ t('pricing.metrics.upfront') }}</span>
                            </div>
                            <div class="pgrid-split-bar pgrid-split-bar--b">
                                <div
                                    class="pgrid-split-fill"
                                    style="--w: 70%; background: linear-gradient(90deg, var(--accent-2), var(--accent-3)); animation-delay: 0.4s"
                                ></div>
                                <span class="pgrid-split-text">{{ t('pricing.metrics.onDelivery') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Middle row: 3 stat cards -->
                    <div class="pgrid-row">
                        <div class="pgrid-stat" v-tilt style="--p-delay: 0s; --p-color: rgba(255, 106, 91, 0.2)">
                            <span class="pgrid-stat-icon">🚀</span>
                            <span class="pgrid-stat-label">{{ t('pricing.metrics.launch') }}</span>
                            <span class="pgrid-stat-val"
                                >7+<span class="pgrid-stat-unit">{{ t('pricing.metrics.days') }}</span></span
                            >
                        </div>

                        <div class="pgrid-stat" v-tilt style="--p-delay: 0.6s; --p-color: rgba(45, 180, 164, 0.2)">
                            <span class="pgrid-stat-icon">🔒</span>
                            <span class="pgrid-stat-label">{{ t('pricing.metrics.fixedPrice') }}</span>
                            <span class="pgrid-stat-val" style="color: var(--accent-2)">{{ t('pricing.metrics.always') }}</span>
                        </div>

                        <div class="pgrid-stat" v-tilt style="--p-delay: 1.2s; --p-color: rgba(248, 194, 78, 0.2)">
                            <span class="pgrid-stat-icon">♾</span>
                            <span class="pgrid-stat-label">{{ t('pricing.metrics.revisions') }}</span>
                            <span class="pgrid-stat-val" style="color: var(--accent-3)">∞</span>
                        </div>
                    </div>

                    <!-- Bottom row: 2 wide cards -->
                    <div class="pgrid-row pgrid-row--2col">
                        <div class="pgrid-wide" v-tilt style="--p-delay: 0.3s; --p-color: rgba(255, 106, 91, 0.15)">
                            <span class="pgrid-wide-icon">📦</span>
                            <div class="pgrid-wide-body">
                                <span class="pgrid-stat-label">{{ t('pricing.metrics.whatsIncluded') }}</span>
                                <span class="pgrid-wide-val">{{ t('pricing.metrics.includedValue') }}</span>
                                <div class="pgrid-prog">
                                    <div
                                        class="pgrid-prog-fill"
                                        style="
                                            --from: 60%;
                                            --to: 100%;
                                            --pdur: 3s;
                                            --pdel: 0s;
                                            background: linear-gradient(90deg, var(--accent), var(--accent-3));
                                        "
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div class="pgrid-wide" v-tilt style="--p-delay: 0.9s; --p-color: rgba(45, 180, 164, 0.15)">
                            <span class="pgrid-wide-icon">🛡</span>
                            <div class="pgrid-wide-body">
                                <span class="pgrid-stat-label">{{ t('pricing.metrics.afterLaunch') }}</span>
                                <span class="pgrid-wide-val">{{ t('pricing.metrics.afterLaunchValue') }}</span>
                                <div class="pgrid-prog">
                                    <div
                                        class="pgrid-prog-fill"
                                        style="
                                            --from: 40%;
                                            --to: 85%;
                                            --pdur: 3.5s;
                                            --pdel: 0.5s;
                                            background: linear-gradient(90deg, var(--accent-2), var(--accent-3));
                                        "
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Live indicator strip -->
                <div class="pgrid-live-strip">
                    <span class="pgrid-live-dot"></span>
                    <span class="pgrid-live-text">{{ t('pricing.metrics.acceptingProjects') }}</span>
                    <div class="pgrid-stream">
                        <span class="pgrid-sdot" style="--sd: 0s"></span>
                        <span class="pgrid-sdot" style="--sd: 0.2s"></span>
                        <span class="pgrid-sdot" style="--sd: 0.4s"></span>
                        <span class="pgrid-sdot" style="--sd: 0.6s"></span>
                        <span class="pgrid-sdot" style="--sd: 0.8s"></span>
                        <span class="pgrid-sdot" style="--sd: 1s"></span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useScrollAnimation } from '@/composables/useScrollAnimation';

defineProps<{
    chatUrl: string;
    localeLabel: string;
}>();

const { t, tm } = useI18n();
const { sectionRef } = useScrollAnimation();

const stackItems = computed(() => (tm('hero.stack') as string[]) ?? []);
</script>

<template>
    <section class="hero" id="hero" ref="sectionRef">

        <!-- LEFT: Text content -->
        <div class="hero-content" data-animate="fade-up">
            <p class="eyebrow">{{ t('hero.eyebrow') }}</p>
            <transition name="fade-slide" appear>
                <h1 class="hero-title" style="--delay: 0.05s">{{ t('hero.title') }}</h1>
            </transition>
            <p class="hero-subtitle" data-animate="fade-up" style="--delay: 0.1s">
                {{ t('hero.subtitle') }}
            </p>
            <div class="hero-actions" data-animate="fade-up" style="--delay: 0.15s">
                <a class="primary-button" :href="chatUrl" target="_blank" rel="noopener">
                    <font-awesome-icon :icon="['fas', 'rocket']" />
                    {{ t('hero.cta') }}
                </a>
                <a class="ghost-button" href="#services">
                    {{ t('hero.secondaryCta') }}
                    <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </a>
            </div>
        </div>

        <!-- RIGHT: Visual dashboard card -->
        <div class="hero-visual" data-animate="fade-left" style="--delay: 0.1s" aria-hidden="true">

            <!-- Grid bg + scan -->
            <div class="hv-grid-bg"></div>
            <div class="hv-scan"></div>

            <!-- Corner labels -->
            <span class="hv-coord hv-coord--tl">{{ t('hero.visual.coordStack') }}</span>
            <span class="hv-coord hv-coord--br">{{ localeLabel }}</span>

            <!-- Status badge — floats top right -->
            <div class="hv-status-badge">
                <span class="hv-status-dot"></span>
                {{ t('hero.stackTitle') }}
            </div>

            <div class="hv-inner">

                <!-- Top: headline metric row -->
                <div class="hv-metric-row">
                    <div class="hv-metric">
                        <span class="hv-metric-val">120<span class="hv-metric-sup">+</span></span>
                        <span class="hv-metric-label">{{ t('hero.visual.projects') }}</span>
                    </div>
                    <div class="hv-metric-divider"></div>
                    <div class="hv-metric">
                        <span class="hv-metric-val">99<span class="hv-metric-sup">%</span></span>
                        <span class="hv-metric-label">{{ t('hero.visual.perfScore') }}</span>
                    </div>
                    <div class="hv-metric-divider"></div>
                    <div class="hv-metric">
                        <span class="hv-metric-val">5<span class="hv-metric-sup">★</span></span>
                        <span class="hv-metric-label">{{ t('hero.visual.rated') }}</span>
                    </div>
                </div>

                <!-- Stack section label -->
                <div class="hv-section-label">
                    <span class="hv-section-line"></span>
                    <span class="hv-section-text">{{ t('hero.visual.techStack') }}</span>
                    <span class="hv-section-line"></span>
                </div>

                <!-- Stack grid -->
                <ul class="hv-stack" role="list">
                    <li
                        v-for="(item, index) in stackItems"
                        :key="`stack-${index}`"
                        class="hv-stack-item"
                        :style="{ '--item-delay': `${0.2 + index * 0.04}s`, '--item-index': index }"
                        data-animate="fade-up"
                    >
                        <span class="hv-stack-index">{{ String(index + 1).padStart(2, '0') }}</span>
                        <span class="hv-stack-name">{{ item }}</span>
                        <span class="hv-stack-bar">
                            <span class="hv-stack-fill" :style="{ '--bar-w': `${75 + (index % 3) * 8}%` }"></span>
                        </span>
                    </li>
                </ul>

                <!-- Bottom: availability strip -->
                <div class="hv-availability">
                    <span class="hv-avail-dot"></span>
                    <span class="hv-avail-text">{{ t('hero.visual.availableForProjects') }}</span>
                    <span class="hv-avail-pill">{{ new Date().getFullYear() }}</span>
                </div>

            </div>
        </div>

    </section>
</template>

<style lang="scss" scoped>
$font-heading: 'Space Grotesk', 'Segoe UI', sans-serif;

// ── Hero layout ────────────────────────────────────────────────────────────
.hero {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: clamp(24px, 4vw, 64px);
    align-items: center;
    animation: fadeInUp 0.8s ease-out;
}

.hero-content {
    max-width: 520px;
}

// ── Right visual ───────────────────────────────────────────────────────────
.hero-visual {
    position: relative;
    width: 100%;
    max-width: 480px;
    justify-self: end;
    border: 1px solid var(--border);
    background: var(--surface);
    box-shadow: var(--shadow);
    transition: box-shadow 0.4s ease, border-color 0.4s ease;

    &:hover {
        border-color: var(--accent);
        box-shadow: 0 30px 60px rgba(255, 106, 91, 0.1);
    }
}

// Grid lines bg
.hv-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(var(--border) 1px, transparent 1px),
        linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
    z-index: 0;
}

// Scan line
.hv-scan {
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.3;
    animation: hvScan 5s linear infinite;
    pointer-events: none;
    z-index: 1;
}

@keyframes hvScan {
    0%   { top: 0;    opacity: 0; }
    4%   { opacity: 0.3; }
    96%  { opacity: 0.3; }
    100% { top: 100%; opacity: 0; }
}

// Corner coords
.hv-coord {
    position: absolute;
    font-family: $font-heading;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    opacity: 0.4;
    z-index: 2;

    &--tl { top: 10px;    left: 12px; }
    &--br { bottom: 10px; right: 12px; }
}

// Status badge
.hv-status-badge {
    position: absolute;
    top: -14px;
    left: 24px;
    z-index: 10;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 6px 14px;
    font-family: $font-heading;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text);
    box-shadow: 0 4px 12px rgba(0,0,0,0.07);
}

.hv-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent-2);
    box-shadow: 0 0 6px var(--accent-2);
    animation: hvDotBlink 2s ease-in-out infinite;
    flex-shrink: 0;
}

@keyframes hvDotBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
}

// ── Inner content ──────────────────────────────────────────────────────────
.hv-inner {
    position: relative;
    z-index: 2;
    padding: 32px 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

// Metric row
.hv-metric-row {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 16px 0;
}

.hv-metric {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 0 16px;
}

.hv-metric-divider {
    width: 1px;
    height: 36px;
    background: var(--border);
    flex-shrink: 0;
}

.hv-metric-val {
    font-family: $font-heading;
    font-size: 1.8rem;
    font-weight: 800;
    line-height: 1;
    background: linear-gradient(135deg, var(--accent), var(--accent-3));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(255, 106, 91, 0.3));
}

.hv-metric-sup {
    font-size: 1rem;
    font-weight: 700;
}

.hv-metric-label {
    font-family: $font-heading;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
}

// Section label with lines
.hv-section-label {
    display: flex;
    align-items: center;
    gap: 10px;
}

.hv-section-line {
    flex: 1;
    height: 1px;
    background: var(--border);
}

.hv-section-text {
    font-family: $font-heading;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    flex-shrink: 0;
}

// Stack list
.hv-stack {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.hv-stack-item {
    display: grid;
    grid-template-columns: 24px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border: 1px solid var(--border);
    background: var(--bg);
    transition: border-color 0.25s ease, background 0.25s ease;
    animation: fadeInUp 0.5s ease-out calc(var(--item-delay, 0s)) both;

    &:hover {
        border-color: var(--accent);
        background: rgba(255, 106, 91, 0.04);

        .hv-stack-fill {
            background: linear-gradient(90deg, var(--accent), var(--accent-3));
        }

        .hv-stack-index {
            color: var(--accent);
        }
    }
}

.hv-stack-index {
    font-family: $font-heading;
    font-size: 9px;
    font-weight: 700;
    color: var(--muted);
    letter-spacing: 0.05em;
    transition: color 0.25s ease;
}

.hv-stack-name {
    font-family: $font-heading;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text);
    letter-spacing: 0.01em;
}

.hv-stack-bar {
    width: 56px;
    height: 3px;
    background: var(--border);
    overflow: hidden;
    border-radius: 0;
    flex-shrink: 0;
}

.hv-stack-fill {
    height: 100%;
    width: var(--bar-w, 80%);
    background: linear-gradient(90deg, var(--accent-2), var(--accent-3));
    transition: background 0.25s ease;
    animation: hvBarGrow 1s cubic-bezier(0.4, 0, 0.2, 1) calc(var(--item-delay, 0s) + 0.1s) both;
}

@keyframes hvBarGrow {
    from { width: 0; }
    to   { width: var(--bar-w, 80%); }
}

// Availability strip
.hv-availability {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid rgba(45, 180, 164, 0.2);
    background: rgba(45, 180, 164, 0.04);
}

.hv-avail-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent-2);
    box-shadow: 0 0 6px var(--accent-2);
    flex-shrink: 0;
    animation: hvDotBlink 2s ease-in-out infinite;
}

.hv-avail-text {
    font-family: $font-heading;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent-2);
    flex: 1;
}

.hv-avail-pill {
    font-family: $font-heading;
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
    letter-spacing: 0.05em;
    padding: 2px 8px;
    border: 1px solid var(--border);
    background: var(--surface);
}

// ── Dark theme ─────────────────────────────────────────────────────────────
:root[data-theme='dark'] {
    .hv-status-badge {
        background: #16181d;
    }
}

// ── Responsive ─────────────────────────────────────────────────────────────
@media (max-width: 900px) {
    .hero-visual {
        max-width: 440px;
        justify-self: center;
    }
}

@media (max-width: 480px) {
    .hv-inner {
        padding: 28px 16px 16px;
        gap: 16px;
    }

    .hv-metric-val  { font-size: 1.4rem; }
    .hv-stack-bar   { width: 40px; }
    .hv-metric      { padding: 0 10px; }
}

// ── Reduced motion ─────────────────────────────────────────────────────────
@media (prefers-reduced-motion: reduce) {
    .hv-scan,
    .hv-status-dot,
    .hv-avail-dot,
    .hv-stack-fill,
    .hv-stack-item  { animation: none !important; }

    .hv-stack-fill  { width: var(--bar-w, 80%) !important; }
}
</style>

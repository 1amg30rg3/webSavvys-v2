<script setup lang="ts">
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faDesktop } from '@fortawesome/free-solid-svg-icons/faDesktop';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faMobileScreenButton } from '@fortawesome/free-solid-svg-icons/faMobileScreenButton';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Component } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PreviewLocale } from './content';
import BusinessDemo from './demos/BusinessDemo.vue';
import EcommerceDemo from './demos/EcommerceDemo.vue';
import LandingDemo from './demos/LandingDemo.vue';
import WebappDemo from './demos/WebappDemo.vue';
import type { PreviewType } from './types';

const props = defineProps<{
    types: PreviewType[];
    active: string;
}>();

const emit = defineEmits<{
    select: [key: string];
    close: [];
}>();

const { t, locale } = useI18n();

const demos: Record<string, Component> = {
    landing: LandingDemo,
    business: BusinessDemo,
    ecommerce: EcommerceDemo,
    webapp: WebappDemo,
};

const current = computed(() => props.types.find((type) => type.key === props.active) ?? props.types[0]);
const demoLocale = computed<PreviewLocale>(() => (locale.value === 'ka' ? 'ka' : 'en'));

const dialogRef = ref<HTMLDialogElement | null>(null);
const tabsRef = ref<HTMLElement | null>(null);
const device = ref<'desktop' | 'mobile'>('desktop');
const closing = ref(false);
let pressedBackdrop = false;

// Matches the pvOut animation.
const CLOSE_MS = 200;

const requestClose = () => {
    if (closing.value) return;
    closing.value = true;
    window.setTimeout(() => emit('close'), CLOSE_MS);
};

// Close only when the press both starts and ends on the backdrop.
const onPointerDown = (event: PointerEvent) => {
    pressedBackdrop = event.target === dialogRef.value;
};

const onClick = (event: MouseEvent) => {
    if (pressedBackdrop && event.target === dialogRef.value) requestClose();
};

const revealActiveTab = async () => {
    await nextTick();
    tabsRef.value?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest', inline: 'center' });
};

watch(() => props.active, revealActiveTab);

onMounted(() => {
    dialogRef.value?.showModal();
    document.documentElement.classList.add('pv-lock');
    revealActiveTab();
});

onBeforeUnmount(() => {
    document.documentElement.classList.remove('pv-lock');
    if (dialogRef.value?.open) dialogRef.value.close();
});
</script>

<template>
    <!-- data-lenis-prevent keeps scrolling native inside the dialog. -->
    <dialog
        ref="dialogRef"
        class="pv"
        :class="{ 'is-closing': closing }"
        aria-labelledby="pv-title"
        data-lenis-prevent
        @cancel.prevent="requestClose"
        @close="emit('close')"
        @pointerdown="onPointerDown"
        @click="onClick"
    >
        <div class="pv-panel">
            <header class="pv-head">
                <div class="pv-heading">
                    <p class="pv-eyebrow">{{ t('pricing.preview.eyebrow') }}</p>
                    <h2 id="pv-title" class="pv-title">{{ current.name }}</h2>
                </div>

                <nav ref="tabsRef" class="pv-tabs" :aria-label="t('pricing.preview.typesLabel')">
                    <button
                        v-for="type in types"
                        :key="type.key"
                        type="button"
                        :class="{ 'is-active': type.key === current.key }"
                        :aria-current="type.key === current.key ? 'true' : undefined"
                        @click="emit('select', type.key)"
                    >
                        {{ type.name }}
                    </button>
                </nav>

                <div class="pv-tools">
                    <div class="pv-devices" role="group" :aria-label="t('pricing.preview.deviceLabel')">
                        <button
                            type="button"
                            :class="{ 'is-active': device === 'desktop' }"
                            :aria-pressed="device === 'desktop'"
                            :aria-label="t('pricing.preview.desktop')"
                            :title="t('pricing.preview.desktop')"
                            @click="device = 'desktop'"
                        >
                            <font-awesome-icon :icon="faDesktop" />
                        </button>
                        <button
                            type="button"
                            :class="{ 'is-active': device === 'mobile' }"
                            :aria-pressed="device === 'mobile'"
                            :aria-label="t('pricing.preview.mobile')"
                            :title="t('pricing.preview.mobile')"
                            @click="device = 'mobile'"
                        >
                            <font-awesome-icon :icon="faMobileScreenButton" />
                        </button>
                    </div>
                    <button class="pv-close" type="button" :aria-label="t('pricing.preview.close')" @click="requestClose">
                        <font-awesome-icon :icon="faXmark" />
                    </button>
                </div>
            </header>

            <div class="pv-stage">
                <div class="pv-window" :class="`is-${device}`">
                    <div class="pv-bar" aria-hidden="true">
                        <span class="pv-dots"><i></i><i></i><i></i></span>
                        <span class="pv-url">
                            <font-awesome-icon :icon="faLock" />
                            {{ t('pricing.preview.domain') }}
                        </span>
                    </div>
                    <div class="pv-viewport">
                        <component :is="demos[current.key]" :key="current.key" :locale="demoLocale" />
                    </div>
                </div>
            </div>

            <footer class="pv-foot">
                <div class="pv-foot-info">
                    <p class="pv-price">
                        <strong>{{ current.priceLabel }}</strong>
                        <span>{{ t('pricing.deliveryLabel') }}: {{ current.delivery }}</span>
                    </p>
                    <p class="pv-note">{{ t('pricing.preview.note') }}</p>
                </div>
                <a class="primary-button pv-cta" :href="current.quoteUrl" target="_blank" rel="noopener">
                    {{ current.ctaLabel }}
                    <font-awesome-icon :icon="faArrowRight" />
                </a>
            </footer>
        </div>
    </dialog>
</template>

<style lang="scss" scoped>
$font-heading: 'Space Grotesk', 'Segoe UI', sans-serif;

.pv {
    width: min(1240px, calc(100vw - 32px));
    max-width: none;
    height: min(900px, calc(100dvh - 32px));
    max-height: none;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text);
    overflow: visible;
    animation: pvIn 0.35s cubic-bezier(0.22, 1, 0.36, 1);

    &::backdrop {
        background: rgba(8, 9, 12, 0.68);
        backdrop-filter: blur(8px);
        animation: pvFade 0.3s ease;
    }

    &.is-closing {
        animation: pvOut 0.2s ease forwards;

        &::backdrop {
            animation: pvFadeOut 0.2s ease forwards;
        }
    }
}

@keyframes pvIn {
    from {
        opacity: 0;
        transform: translateY(18px) scale(0.98);
    }
}

@keyframes pvOut {
    to {
        opacity: 0;
        transform: translateY(10px) scale(0.99);
    }
}

@keyframes pvFade {
    from {
        opacity: 0;
    }
}

@keyframes pvFadeOut {
    to {
        opacity: 0;
    }
}

.pv-panel {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    height: 100%;
    border: 1px solid var(--border);
    background: var(--surface);
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.45);
    overflow: hidden;
}

// ── Header ────────────────────────────────────────────────────────────────────
.pv-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 12px 16px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
}

.pv-heading {
    min-width: 0;
}

.pv-eyebrow {
    margin: 0 0 2px;
    color: var(--accent);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.pv-title {
    margin: 0;
    overflow: hidden;
    font-family: $font-heading;
    font-size: 1.15rem;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pv-tabs,
.pv-devices {
    display: inline-flex;
    gap: 4px;
    padding: 4px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--bg);

    button {
        padding: 8px 14px;
        border: 0;
        border-radius: 999px;
        background: none;
        color: var(--muted);
        font: inherit;
        font-size: 0.85rem;
        font-weight: 600;
        white-space: nowrap;
        cursor: pointer;
        transition:
            background 0.25s ease,
            color 0.25s ease;

        &:hover {
            color: var(--text);
        }

        &.is-active {
            background: linear-gradient(135deg, var(--accent), var(--accent-3));
            color: #1a1a1a;
        }
    }
}

.pv-tabs {
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
}

.pv-tools {
    display: flex;
    align-items: center;
    justify-self: end;
    gap: 10px;
}

.pv-devices button {
    padding: 8px 12px;
}

.pv-close {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--bg);
    color: var(--text);
    font-size: 1rem;
    cursor: pointer;
    transition:
        border-color 0.2s ease,
        transform 0.2s ease;

    &:hover {
        border-color: var(--accent);
        transform: rotate(90deg);
    }
}

// ── Stage + browser window ────────────────────────────────────────────────────
.pv-stage {
    display: grid;
    justify-items: center;
    min-height: 0;
    padding: 20px;
    background-color: var(--bg);
    background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 28px 28px;
}

.pv-window {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    transition:
        width 0.5s cubic-bezier(0.22, 1, 0.36, 1),
        border-radius 0.5s ease;

    &.is-mobile {
        width: 400px;
        max-width: 100%;
        border: 7px solid #17181c;
        border-radius: 34px;

        .pv-dots {
            display: none;
        }
    }
}

.pv-bar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
}

.pv-dots {
    display: inline-flex;
    gap: 6px;

    i {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--border);

        &:first-child {
            background: var(--accent);
        }

        &:nth-child(2) {
            background: var(--accent-3);
        }

        &:nth-child(3) {
            background: var(--accent-2);
        }
    }
}

.pv-url {
    display: inline-flex;
    grid-column: 2;
    align-items: center;
    gap: 8px;
    padding: 4px 16px;
    border-radius: 999px;
    background: var(--bg);
    color: var(--muted);
    font-size: 0.75rem;

    svg {
        font-size: 0.6rem;
    }
}

// Container for the demos' @container queries.
.pv-viewport {
    position: relative;
    flex: 1;
    min-height: 0;
    background: #fff;
    container-type: inline-size;
}

// ── Footer ────────────────────────────────────────────────────────────────────
.pv-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 18px;
    border-top: 1px solid var(--border);
}

.pv-price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 14px;
    margin: 0;

    strong {
        font-family: $font-heading;
        font-size: 1.2rem;
    }

    span {
        color: var(--muted);
        font-size: 0.88rem;
    }
}

.pv-note {
    margin: 2px 0 0;
    color: var(--muted);
    font-size: 0.8rem;
}

.pv-cta {
    flex-shrink: 0;
}

// ── Responsive ────────────────────────────────────────────────────────────────
@media (max-width: 1000px) {
    .pv-head {
        grid-template-columns: minmax(0, 1fr) auto;
    }

    .pv-tabs {
        grid-row: 2;
        grid-column: 1 / -1;
        justify-self: start;
    }
}

@media (max-width: 700px) {
    .pv {
        width: 100vw;
        height: 100dvh;
    }

    .pv-panel {
        border: 0;
    }

    .pv-head {
        padding: 10px 12px;
    }

    .pv-devices,
    .pv-note,
    .pv-bar {
        display: none;
    }

    .pv-stage {
        padding: 0;
    }

    .pv-window,
    .pv-window.is-mobile {
        width: 100%;
        border: 0;
        border-radius: 0;
        box-shadow: none;
    }

    .pv-foot {
        padding: 10px 12px;
    }

    .pv-price strong {
        font-size: 1.05rem;
    }

    .pv-cta {
        padding: 12px 18px;
    }
}
</style>

<style lang="scss">
// Unscoped: these target <html> and the demo components.

html.pv-lock {
    overflow: hidden;
}

// Resets the site's global styles inside demos; :where() keeps specificity low.
.demo {
    height: 100%;
    font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    text-align: left;

    &,
    & * {
        scrollbar-color: rgba(128, 128, 128, 0.45) transparent;
        scrollbar-width: thin;
    }

    :where(h1, h2, h3, h4, p, ul, figure, blockquote) {
        margin: 0;
    }

    :where(h1, h2, h3, h4) {
        font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
        letter-spacing: -0.01em;
        line-height: 1.15;
        text-transform: none;
    }

    :where(ul) {
        padding: 0;
        list-style: none;
    }

    :where(button, input, select, textarea) {
        color: inherit;
        font: inherit;
    }

    :where(button) {
        padding: 0;
        border: 0;
        background: none;
        cursor: pointer;
    }

    :where(input, textarea) {
        user-select: text;
    }

    :where(button, input, select, textarea):focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }
}
</style>

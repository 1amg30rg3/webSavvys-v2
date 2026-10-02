<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import BarList from '@/components/admin/BarList.vue';
import Icon from '@/components/admin/Icon.vue';
import { ago, copyText, dayLabel, deviceIcon, fmt, fmtTime, host, isActive, type Visitor } from '@/lib/admin';

const props = defineProps<{ ip: string; visitor: Visitor | null; loading: boolean }>();
const emit = defineEmits<{ close: []; 'filter-ip': [ip: string]; 'filter-path': [path: string] }>();

const closeBtn = ref<HTMLButtonElement | null>(null);
const copied = ref(false);

// The prop can still hold the previous visitor while the new one loads.
const ready = computed(() => props.visitor && props.visitor.ip === props.ip);
const latest = computed(() => props.visitor?.visits[0]);
const distinctPages = computed(() => new Set(props.visitor?.visits.map((v) => v.path)).size);
const isBot = computed(() => props.visitor?.visits.some((v) => v.is_bot) ?? false);
const languages = computed(() => [...new Set(props.visitor?.visits.map((v) => v.locale).filter((l): l is string => !!l))]);

const groups = computed(() => {
    const out: { day: string; visits: Visitor['visits'] }[] = [];
    for (const v of props.visitor?.visits ?? []) {
        const day = dayLabel(v.visited_at);
        const last = out[out.length - 1];
        if (last && last.day === day) last.visits.push(v);
        else out.push({ day, visits: [v] });
    }
    return out;
});

// Only surface device details on a timeline entry when it differs from the visitor's usual setup.
const sig = (v: { device: string; browser: string; os: string }) => `${v.device}|${v.browser}|${v.os}`;
const differs = (v: { device: string; browser: string; os: string }) => !!latest.value && sig(v) !== sig(latest.value);

async function copy() {
    copied.value = await copyText(props.ip);
    setTimeout(() => (copied.value = false), 1500);
}

const onKey = (e: KeyboardEvent) => e.key === 'Escape' && emit('close');
onMounted(() => {
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    nextTick(() => closeBtn.value?.focus());
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
});
watch(
    () => props.ip,
    () => (copied.value = false),
);
</script>

<template>
    <div class="overlay" @click.self="emit('close')">
        <aside class="drawer" role="dialog" aria-modal="true" aria-label="Visitor details">
            <header class="top">
                <div class="who">
                    <span class="avatar"><Icon :name="isBot ? 'bot' : latest ? deviceIcon(latest.device) : 'users'" :size="18" /></span>
                    <div>
                        <div class="ipline">
                            <h2>{{ ip }}</h2>
                            <button class="icon-btn" :title="copied ? 'Copied!' : 'Copy IP address'" @click="copy">
                                <Icon :name="copied ? 'check' : 'copy'" :size="14" />
                            </button>
                        </div>
                        <p v-if="ready" class="state">
                            <span v-if="isActive(visitor!.last_seen)" class="badge ok"><i class="dot live" />Active now</span>
                            <span v-else class="muted">Last seen {{ ago(visitor!.last_seen) }}</span>
                            <span v-if="isBot" class="badge warn"><Icon name="bot" :size="12" />Bot</span>
                        </p>
                    </div>
                </div>
                <button ref="closeBtn" class="icon-btn" aria-label="Close" @click="emit('close')"><Icon name="x" /></button>
            </header>

            <div v-if="!ready" class="skeleton-wrap" aria-busy="true">
                <div class="sk" style="height: 20px; width: 60%" />
                <div class="sk" style="height: 64px" />
                <div class="sk" style="height: 120px" />
                <div class="sk" style="height: 200px" />
            </div>

            <div v-else class="body">
                <div class="chips">
                    <span v-if="latest" class="meta"><Icon :name="deviceIcon(latest.device)" :size="13" />{{ latest.device }}</span>
                    <span v-if="latest" class="meta"><Icon name="compass" :size="13" />{{ latest.browser }}</span>
                    <span v-if="latest" class="meta"><Icon name="cpu" :size="13" />{{ latest.os }}</span>
                    <span v-for="l in languages" :key="l" class="meta"><Icon name="globe" :size="13" />{{ l }}</span>
                </div>

                <dl class="stats">
                    <div>
                        <dt>Total views</dt>
                        <dd>{{ visitor!.total.toLocaleString() }}</dd>
                    </div>
                    <div>
                        <dt>Pages visited</dt>
                        <dd>{{ distinctPages }}</dd>
                    </div>
                    <div>
                        <dt>First seen</dt>
                        <dd>{{ fmt(visitor!.first_seen) }}</dd>
                    </div>
                    <div>
                        <dt>Last seen</dt>
                        <dd>{{ fmt(visitor!.last_seen) }}</dd>
                    </div>
                </dl>

                <button class="action" @click="emit('filter-ip', ip)">
                    <Icon name="filter" :size="14" />Show only this visitor in the dashboard
                </button>

                <section>
                    <h3>Most visited pages</h3>
                    <BarList :items="visitor!.pages" clickable @select="emit('filter-path', $event)" />
                </section>

                <section>
                    <h3>
                        Activity
                        <small v-if="visitor!.total > visitor!.visits.length">latest {{ visitor!.visits.length }} of {{ visitor!.total }}</small>
                    </h3>
                    <div v-for="g in groups" :key="g.day" class="day">
                        <div class="day-label">{{ g.day }}</div>
                        <ol class="timeline">
                            <li v-for="v in g.visits" :key="v.id">
                                <time>{{ fmtTime(v.visited_at) }}</time>
                                <div class="entry">
                                    <span class="path">{{ v.path }}</span>
                                    <span class="sub">
                                        <span :class="{ direct: !v.referrer }"><Icon name="link" :size="11" />{{ host(v.referrer) }}</span>
                                        <span v-if="differs(v)"><Icon :name="deviceIcon(v.device)" :size="11" />{{ v.browser }} · {{ v.os }}</span>
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </div>
                </section>
            </div>
        </aside>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 0.5);
    backdrop-filter: blur(2px);
    z-index: 50;
    display: flex;
    justify-content: flex-end;
    animation: fade 0.15s ease-out;
}
.drawer {
    user-select: text;
    background: var(--card);
    border-left: 1px solid var(--border);
    width: min(480px, 100%);
    height: 100%;
    overflow-y: auto;
    animation: slide 0.2s ease-out;
    color: var(--text);
}
@keyframes fade {
    from {
        opacity: 0;
    }
}
@keyframes slide {
    from {
        transform: translateX(24px);
        opacity: 0;
    }
}
.top {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--card);
    border-bottom: 1px solid var(--border);
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
}
.who {
    display: flex;
    gap: 12px;
    align-items: center;
    min-width: 0;
}
.avatar {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: var(--accent-soft);
    color: var(--accent);
    display: grid;
    place-items: center;
    flex: none;
}
.ipline {
    display: flex;
    align-items: center;
    gap: 4px;
}
h2 {
    margin: 0;
    text-transform: none;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 17px;
    font-weight: 600;
}
.state {
    margin: 3px 0 0;
    font-size: 12px;
    display: flex;
    gap: 8px;
    align-items: center;
}
.muted {
    color: var(--muted);
}
.badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 500;
}
.badge.ok {
    background: color-mix(in srgb, var(--c2) 16%, transparent);
    color: var(--c2);
}
.badge.warn {
    background: color-mix(in srgb, var(--warn) 16%, transparent);
    color: var(--warn);
}
.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
}
.dot.live {
    animation: pulse 1.8s ease-in-out infinite;
}
@keyframes pulse {
    50% {
        opacity: 0.35;
    }
}
.icon-btn {
    background: none;
    border: 0;
    color: var(--muted);
    border-radius: 6px;
    width: 28px;
    height: 28px;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    flex: none;
    transition:
        background 0.15s,
        color 0.15s;
}
.icon-btn:hover {
    background: var(--hover);
    color: var(--text);
}
.icon-btn:focus-visible,
.action:focus-visible {
    outline: 2px solid var(--c1);
}
.body,
.skeleton-wrap {
    padding: 20px;
    display: grid;
    gap: 22px;
}
.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.meta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--hover);
    border-radius: 999px;
    padding: 4px 11px;
    font-size: 12px;
    text-transform: capitalize;
}
.stats {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: 1px solid var(--border);
    border-radius: 16px;
}
.stats > div {
    padding: 12px 14px;
}
.stats > div:nth-child(odd) {
    border-right: 1px solid var(--border);
}
.stats > div:nth-child(n + 3) {
    border-top: 1px solid var(--border);
}
dt {
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 3px;
}
dd {
    margin: 0;
    font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
    font-size: 16px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}
.action {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 999px;
    padding: 10px 14px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
}
.action:hover {
    background: var(--hover);
}
h3 {
    margin: 0 0 10px;
    font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
    font-weight: 600;
}
h3 small {
    text-transform: none;
    letter-spacing: 0;
    font-weight: 400;
    margin-left: 6px;
}
.day-label {
    font-size: 12px;
    font-weight: 600;
    margin: 14px 0 8px;
}
.timeline {
    list-style: none;
    margin: 0;
    padding: 0 0 0 4px;
    display: grid;
    gap: 0;
}
.timeline li {
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 10px;
    padding: 7px 0;
    position: relative;
}
.timeline li::before {
    content: '';
    position: absolute;
    left: 56px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--border);
}
.timeline li::after {
    content: '';
    position: absolute;
    left: 53px;
    top: 14px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 3px var(--card);
}
.timeline time {
    font-size: 12px;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
    padding-top: 2px;
}
.entry {
    display: grid;
    gap: 2px;
    padding-left: 14px;
    min-width: 0;
}
.path {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    overflow-wrap: anywhere;
}
.sub {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    font-size: 11px;
    color: var(--muted);
}
.sub span {
    display: inline-flex;
    gap: 4px;
    align-items: center;
}
.sub .direct {
    opacity: 0.7;
}
.sk {
    border-radius: 8px;
    background: linear-gradient(90deg, var(--hover) 25%, var(--border) 37%, var(--hover) 63%);
    background-size: 400% 100%;
    animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
    from {
        background-position: 100% 0;
    }
    to {
        background-position: 0 0;
    }
}
@media (prefers-reduced-motion: reduce) {
    .overlay,
    .drawer,
    .dot.live,
    .sk {
        animation: none;
    }
}
</style>

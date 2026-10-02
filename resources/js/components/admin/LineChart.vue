<script setup lang="ts">
import { computed, ref } from 'vue';

interface Point {
    date: string;
    views: number;
    visitors: number;
}

const props = defineProps<{ data: Point[] }>();

const W = 800;
const H = 260;
const pad = { l: 40, r: 12, t: 12, b: 28 };
const hover = ref<number | null>(null);

const max = computed(() => {
    const m = Math.max(1, ...props.data.map((d) => d.views));
    const mag = 10 ** Math.floor(Math.log10(m));
    return Math.ceil(m / mag) * mag;
});
const x = (i: number) => pad.l + (props.data.length > 1 ? (i / (props.data.length - 1)) * (W - pad.l - pad.r) : 0);
const y = (v: number) => pad.t + (1 - v / max.value) * (H - pad.t - pad.b);
const line = (key: 'views' | 'visitors') => props.data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ');
const area = computed(() => `${line('views')} L${x(props.data.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`);
const ticks = computed(() => [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max.value * t)));
const labelEvery = computed(() => Math.max(1, Math.ceil(props.data.length / 8)));

function onMove(e: MouseEvent) {
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (props.data.length - 1));
    hover.value = Math.min(props.data.length - 1, Math.max(0, i));
}
</script>

<template>
    <div class="chart">
        <svg :viewBox="`0 0 ${W} ${H}`" @mousemove="onMove" @mouseleave="hover = null" role="img" aria-label="Visits over time">
            <g v-for="t in ticks" :key="t">
                <line :x1="pad.l" :x2="W - pad.r" :y1="y(t)" :y2="y(t)" class="grid" />
                <text :x="pad.l - 6" :y="y(t) + 4" class="axis" text-anchor="end">{{ t }}</text>
            </g>
            <template v-for="(d, i) in data" :key="d.date">
                <text v-if="i % labelEvery === 0" :x="x(i)" :y="H - 8" class="axis" text-anchor="middle">{{ d.date.slice(5) }}</text>
            </template>
            <path :d="area" class="area" />
            <path :d="line('views')" class="line views" />
            <path :d="line('visitors')" class="line visitors" />
            <g v-if="hover !== null">
                <line :x1="x(hover)" :x2="x(hover)" :y1="pad.t" :y2="H - pad.b" class="cursor" />
                <circle :cx="x(hover)" :cy="y(data[hover].views)" r="4" class="dot views" />
                <circle :cx="x(hover)" :cy="y(data[hover].visitors)" r="4" class="dot visitors" />
            </g>
        </svg>
        <div v-if="hover !== null" class="tip" :style="{ left: `${(x(hover) / W) * 100}%` }">
            <strong>{{ data[hover].date }}</strong>
            <span><i class="sw views" />{{ data[hover].views }} views</span>
            <span><i class="sw visitors" />{{ data[hover].visitors }} unique IPs</span>
        </div>
        <div class="legend">
            <span><i class="sw views" />Page views</span>
            <span><i class="sw visitors" />Unique IPs</span>
        </div>
    </div>
</template>

<style scoped>
.chart { position: relative; }
svg { width: 100%; height: auto; display: block; }
.grid { stroke: var(--grid); stroke-width: 1; }
.axis { fill: var(--muted); font-size: 11px; }
.line { fill: none; stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; }
.line.views, .dot.views { stroke: var(--c1); }
.line.visitors, .dot.visitors { stroke: var(--c2); }
.dot { fill: var(--card); stroke-width: 2.5; }
.area { fill: var(--c1); opacity: 0.1; }
.cursor { stroke: var(--muted); stroke-dasharray: 3 3; }
.tip { position: absolute; top: 0; transform: translateX(-50%); background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px; font-size: 12px; display: grid; gap: 2px; pointer-events: none; white-space: nowrap; box-shadow: 0 4px 16px rgb(0 0 0 / 0.25); }
.legend { display: flex; gap: 16px; font-size: 12px; color: var(--muted); margin-top: 8px; }
.sw { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; }
.sw.views { background: var(--c1); }
.sw.visitors { background: var(--c2); }
</style>

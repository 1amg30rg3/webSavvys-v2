<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ items: { label: string; value: number }[]; color?: string }>();
const max = computed(() => Math.max(1, ...props.items.map((i) => i.value)));
const total = computed(() => props.items.reduce((s, i) => s + i.value, 0) || 1);
</script>

<template>
    <ul class="bars">
        <li v-for="item in items" :key="item.label">
            <div class="row">
                <span class="label" :title="item.label">{{ item.label }}</span>
                <span class="val">{{ item.value }} <small>{{ Math.round((item.value / total) * 100) }}%</small></span>
            </div>
            <div class="track"><div class="fill" :style="{ width: `${(item.value / max) * 100}%`, background: color || 'var(--c1)' }" /></div>
        </li>
        <li v-if="!items.length" class="empty">No data yet</li>
    </ul>
</template>

<style scoped>
.bars { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.row { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; margin-bottom: 4px; }
.label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.val { font-variant-numeric: tabular-nums; white-space: nowrap; }
.val small { color: var(--muted); margin-left: 4px; }
.track { height: 6px; border-radius: 3px; background: var(--grid); overflow: hidden; }
.fill { height: 100%; border-radius: 3px; }
.empty { color: var(--muted); font-size: 13px; }
</style>

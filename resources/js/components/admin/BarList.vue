<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ items: { label: string; value: number }[]; color?: string; clickable?: boolean }>();
const emit = defineEmits<{ select: [label: string] }>();
const max = computed(() => Math.max(1, ...props.items.map((i) => i.value)));
const total = computed(() => props.items.reduce((s, i) => s + i.value, 0) || 1);
</script>

<template>
    <ul class="bars">
        <li v-for="item in items" :key="item.label">
            <component
                :is="clickable ? 'button' : 'div'"
                class="row"
                :class="{ click: clickable }"
                :type="clickable ? 'button' : undefined"
                :title="clickable ? `Filter by ${item.label}` : item.label"
                @click="clickable && emit('select', item.label)"
            >
                <span class="fill" :style="{ width: `${(item.value / max) * 100}%`, background: color || 'var(--c1)' }" />
                <span class="label">{{ item.label }}</span>
                <span class="val">
                    {{ item.value.toLocaleString() }} <small>{{ Math.round((item.value / total) * 100) }}%</small>
                </span>
            </component>
        </li>
        <li v-if="!items.length" class="empty">No data for this selection</li>
    </ul>
</template>

<style scoped>
.bars {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 4px;
}
.row {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 7px 10px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    font-size: 13px;
    text-align: left;
    overflow: hidden;
}
.fill {
    position: absolute;
    inset: 0 auto 0 0;
    opacity: 0.16;
    border-radius: 6px;
    transition: opacity 0.15s;
}
.label {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: none;
}
.val {
    position: relative;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    font-weight: 500;
}
.val small {
    color: var(--muted);
    font-weight: 400;
    margin-left: 6px;
    display: inline-block;
    min-width: 30px;
    text-align: right;
}
.click {
    cursor: pointer;
}
.click:hover .fill,
.click:focus-visible .fill {
    opacity: 0.28;
}
.click:focus-visible {
    outline: 2px solid var(--c1);
    outline-offset: -2px;
}
.empty {
    color: var(--muted);
    font-size: 13px;
    padding: 12px 10px;
}
</style>

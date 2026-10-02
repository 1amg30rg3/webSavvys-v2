<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ items: { label: string; value: number }[] }>();
const max = computed(() => Math.max(1, ...props.items.map((i) => i.value)));
</script>

<template>
    <div class="cols">
        <div v-for="item in items" :key="item.label" class="col" :title="`${item.label}:00 — ${item.value} views`">
            <div class="bar" :style="{ height: `${(item.value / max) * 100}%` }" />
            <span>{{ Number(item.label) % 3 === 0 ? item.label : '' }}</span>
        </div>
    </div>
</template>

<style scoped>
.cols {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 140px;
}
.col {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
}
.bar {
    width: 100%;
    min-height: 2px;
    background: var(--c1);
    border-radius: 3px 3px 0 0;
}
span {
    font-size: 10px;
    color: var(--muted);
    height: 12px;
}
</style>

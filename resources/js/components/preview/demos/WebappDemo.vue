<script setup lang="ts">
import { faArrowTrendDown } from '@fortawesome/free-solid-svg-icons/faArrowTrendDown';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons/faArrowTrendUp';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons/faChartSimple';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { computed, ref } from 'vue';
import { previewContent, type BookingStatus, type PreviewLocale, type WebappView } from '../content';

const props = defineProps<{
    locale: PreviewLocale;
}>();

const c = computed(() => previewContent[props.locale].webapp);

const views: Array<{ key: WebappView; icon: typeof faChartSimple }> = [
    { key: 'dashboard', icon: faChartSimple },
    { key: 'bookings', icon: faCalendarDays },
    { key: 'customers', icon: faUsers },
];

const view = ref<WebappView>('dashboard');

// ── Dashboard chart ──────────────────────────────────────────────────────────
const range = ref<'week' | 'month'>('week');
const chart = computed(() => {
    const labels = range.value === 'week' ? c.value.dashboard.weekLabels : c.value.dashboard.monthLabels;
    const data = range.value === 'week' ? c.value.dashboard.weekData : c.value.dashboard.monthData;
    const max = Math.max(...data);

    return data.map((value, index) => ({ label: labels[index], value, height: `${Math.round((value / max) * 100)}%` }));
});

// ── Bookings ─────────────────────────────────────────────────────────────────
let nextId = 0;
const bookings = ref(previewContent[props.locale].webapp.bookings.rows.map((row) => ({ ...row, id: nextId++ })));
const statusFilter = ref<'all' | BookingStatus>('all');
const statusFilters: Array<'all' | BookingStatus> = ['all', 'confirmed', 'pending', 'cancelled'];
const statusOrder: BookingStatus[] = ['confirmed', 'pending', 'cancelled'];

const visibleBookings = computed(() => bookings.value.filter((row) => statusFilter.value === 'all' || row.status === statusFilter.value));
const todayBookings = computed(() => bookings.value.filter((row) => row.status !== 'cancelled').slice(0, 4));

const cycleStatus = (id: number) => {
    const row = bookings.value.find((item) => item.id === id);
    if (row) row.status = statusOrder[(statusOrder.indexOf(row.status) + 1) % statusOrder.length];
};

const addBooking = () => {
    const hour = 15 + (bookings.value.length % 4);
    bookings.value.unshift({ ...c.value.bookings.newRow, time: `${hour}:00`, status: 'pending', id: nextId++ });
    statusFilter.value = 'all';
};

// ── Customers ────────────────────────────────────────────────────────────────
const customerQuery = ref('');
const visibleCustomers = computed(() => {
    const needle = customerQuery.value.trim().toLowerCase();

    return c.value.customers.rows.filter((row) => row.name.toLowerCase().includes(needle));
});
</script>

<template>
    <div class="demo wa">
        <aside class="wa-side">
            <span class="wa-logo"><i></i>{{ c.brand }}</span>
            <nav>
                <button
                    v-for="item in views"
                    :key="item.key"
                    type="button"
                    :class="{ 'is-active': view === item.key }"
                    :aria-current="view === item.key ? 'page' : undefined"
                    @click="view = item.key"
                >
                    <font-awesome-icon :icon="item.icon" />
                    <span>{{ c.nav[item.key] }}</span>
                </button>
            </nav>
            <span class="wa-user">
                <span class="wa-avatar">{{ c.user[0] }}</span>
                {{ c.user }}
            </span>
        </aside>

        <div class="wa-main">
            <!-- Dashboard -->
            <div v-if="view === 'dashboard'" class="wa-view">
                <h1>{{ c.dashboard.greeting }}</h1>

                <ul class="wa-stats">
                    <li v-for="stat in c.dashboard.stats" :key="stat.label">
                        <span>{{ stat.label }}</span>
                        <strong>{{ stat.value }}</strong>
                        <em :class="{ 'is-down': !stat.up }">
                            <font-awesome-icon :icon="stat.up ? faArrowTrendUp : faArrowTrendDown" />
                            {{ stat.delta }}
                        </em>
                    </li>
                </ul>

                <div class="wa-panels">
                    <div class="wa-panel">
                        <div class="wa-panel-head">
                            <h2>{{ c.dashboard.chartTitle }}</h2>
                            <div class="wa-toggle">
                                <button
                                    type="button"
                                    :class="{ 'is-active': range === 'week' }"
                                    :aria-pressed="range === 'week'"
                                    @click="range = 'week'"
                                >
                                    {{ c.dashboard.week }}
                                </button>
                                <button
                                    type="button"
                                    :class="{ 'is-active': range === 'month' }"
                                    :aria-pressed="range === 'month'"
                                    @click="range = 'month'"
                                >
                                    {{ c.dashboard.month }}
                                </button>
                            </div>
                        </div>
                        <div class="wa-chart">
                            <div v-for="bar in chart" :key="bar.label" class="wa-bar">
                                <div class="wa-bar-track">
                                    <span :style="{ height: bar.height }"
                                        ><b>{{ bar.value }}</b></span
                                    >
                                </div>
                                <small>{{ bar.label }}</small>
                            </div>
                        </div>
                    </div>

                    <div class="wa-panel">
                        <div class="wa-panel-head">
                            <h2>{{ c.dashboard.todayTitle }}</h2>
                        </div>
                        <ul class="wa-today">
                            <li v-for="row in todayBookings" :key="row.id">
                                <time>{{ row.time }}</time>
                                <div>
                                    <strong>{{ row.customer }}</strong>
                                    <span>{{ row.service }}</span>
                                </div>
                                <i :class="`is-${row.status}`"></i>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Bookings -->
            <div v-else-if="view === 'bookings'" class="wa-view">
                <div class="wa-title-row">
                    <h1>{{ c.nav.bookings }}</h1>
                    <button class="wa-primary" type="button" @click="addBooking">
                        <font-awesome-icon :icon="faPlus" />
                        {{ c.bookings.newBooking }}
                    </button>
                </div>

                <div class="wa-filters">
                    <button
                        v-for="key in statusFilters"
                        :key="key"
                        type="button"
                        :class="{ 'is-active': statusFilter === key }"
                        :aria-pressed="statusFilter === key"
                        @click="statusFilter = key"
                    >
                        {{ c.bookings.filters[key] }}
                    </button>
                </div>

                <div class="wa-panel wa-panel--flush">
                    <div class="wa-row wa-row--head">
                        <span>{{ c.bookings.columns.customer }}</span>
                        <span>{{ c.bookings.columns.service }}</span>
                        <span>{{ c.bookings.columns.time }}</span>
                        <span>{{ c.bookings.columns.status }}</span>
                    </div>
                    <TransitionGroup name="wa-list" tag="div">
                        <div v-for="row in visibleBookings" :key="row.id" class="wa-row">
                            <strong>{{ row.customer }}</strong>
                            <span>{{ row.service }}</span>
                            <time>{{ row.time }}</time>
                            <button
                                class="wa-status"
                                :class="`is-${row.status}`"
                                type="button"
                                :title="c.bookings.statusHint"
                                @click="cycleStatus(row.id)"
                            >
                                {{ c.statuses[row.status] }}
                            </button>
                        </div>
                    </TransitionGroup>
                    <p v-if="!visibleBookings.length" class="wa-empty">{{ c.bookings.empty }}</p>
                </div>
                <p class="wa-hint">{{ c.bookings.statusHint }}</p>
            </div>

            <!-- Customers -->
            <div v-else class="wa-view">
                <div class="wa-title-row">
                    <h1>{{ c.nav.customers }}</h1>
                    <label class="wa-search">
                        <font-awesome-icon :icon="faMagnifyingGlass" />
                        <input
                            v-model="customerQuery"
                            type="search"
                            :placeholder="c.customers.searchPlaceholder"
                            :aria-label="c.customers.searchPlaceholder"
                        />
                    </label>
                </div>

                <ul v-if="visibleCustomers.length" class="wa-customers">
                    <li v-for="row in visibleCustomers" :key="row.name">
                        <span class="wa-avatar wa-avatar--lg">{{ row.name[0] }}</span>
                        <strong>{{ row.name }}</strong>
                        <dl>
                            <div>
                                <dt>{{ c.customers.visits }}</dt>
                                <dd>{{ row.visits }}</dd>
                            </div>
                            <div>
                                <dt>{{ c.customers.spent }}</dt>
                                <dd>{{ row.spent }}</dd>
                            </div>
                        </dl>
                    </li>
                </ul>
                <p v-else class="wa-empty">{{ c.customers.empty }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wa {
    --d-ink: #1c2033;
    --d-muted: #7a8099;
    --d-bg: #f3f4f9;
    --d-card: #ffffff;
    --d-line: #e4e6f0;
    --d-accent: #5b5bd6;
    --d-side: #161929;
    --d-ok: #1f9d6b;
    --d-wait: #c98a12;
    --d-off: #c2495a;

    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    background: var(--d-bg);
    color: var(--d-ink);
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
.wa-side {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 20px 14px;
    background: var(--d-side);
    color: #fff;

    nav {
        display: grid;
        gap: 4px;
    }

    nav button {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 12px;
        border-radius: 12px;
        color: rgba(255, 255, 255, 0.62);
        font-weight: 600;
        text-align: left;
        transition:
            background 0.2s ease,
            color 0.2s ease;

        &:hover {
            color: #fff;
        }

        &.is-active {
            background: var(--d-accent);
            color: #fff;
        }
    }
}

.wa-logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 0 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 19px;
    font-weight: 700;

    i {
        width: 18px;
        height: 18px;
        border-radius: 6px;
        background: linear-gradient(135deg, #8f8ff0, var(--d-accent));
    }
}

.wa-user {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding: 0 8px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 600;
}

.wa-avatar {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8f8ff0, var(--d-accent));
    color: #fff;
    font-size: 13px;
    font-weight: 700;

    &--lg {
        width: 44px;
        height: 44px;
        font-size: 17px;
    }
}

// ── Main area ─────────────────────────────────────────────────────────────────
.wa-main {
    min-width: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.wa-view {
    display: grid;
    gap: 16px;
    padding: 24px;
    animation: waIn 0.3s ease;

    h1 {
        font-size: 24px;
    }
}

@keyframes waIn {
    from {
        opacity: 0;
        transform: translateY(6px);
    }
}

.wa-title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.wa-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 12px;
    background: var(--d-accent);
    color: #fff;
    font-weight: 700;
    transition: filter 0.2s ease;

    &:hover {
        filter: brightness(1.1);
    }
}

.wa-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;

    li {
        display: grid;
        gap: 4px;
        padding: 16px;
        border: 1px solid var(--d-line);
        border-radius: 16px;
        background: var(--d-card);
    }

    span {
        color: var(--d-muted);
        font-size: 12px;
    }

    strong {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 23px;
    }

    em {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: var(--d-ok);
        font-size: 12px;
        font-style: normal;
        font-weight: 700;

        &.is-down {
            color: var(--d-off);
        }
    }
}

.wa-panels {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 12px;
}

.wa-panel {
    padding: 18px;
    border: 1px solid var(--d-line);
    border-radius: 16px;
    background: var(--d-card);

    &--flush {
        padding: 4px 0;
    }
}

.wa-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;

    h2 {
        font-size: 16px;
    }
}

.wa-toggle,
.wa-filters {
    display: inline-flex;
    gap: 4px;
    padding: 4px;
    border-radius: 12px;
    background: var(--d-bg);

    button {
        padding: 6px 12px;
        border-radius: 9px;
        color: var(--d-muted);
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
        transition:
            background 0.2s ease,
            color 0.2s ease;

        &.is-active {
            background: var(--d-card);
            box-shadow: 0 2px 6px rgba(28, 32, 51, 0.1);
            color: var(--d-ink);
        }
    }
}

.wa-filters {
    justify-self: start;
    max-width: 100%;
    overflow-x: auto;
    background: var(--d-line);
    scrollbar-width: none;
}

.wa-chart {
    display: flex;
    align-items: stretch;
    gap: 10px;
    height: 170px;
}

.wa-bar {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    text-align: center;

    small {
        color: var(--d-muted);
        font-size: 11px;
        white-space: nowrap;
    }
}

.wa-bar-track {
    display: flex;
    flex: 1;
    align-items: flex-end;
    border-radius: 8px;
    background: var(--d-bg);

    span {
        position: relative;
        width: 100%;
        border-radius: 8px;
        background: linear-gradient(180deg, #8f8ff0, var(--d-accent));
        transition: height 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }

    b {
        position: absolute;
        bottom: calc(100% + 4px);
        left: 50%;
        padding: 2px 6px;
        border-radius: 6px;
        background: var(--d-ink);
        color: #fff;
        font-size: 11px;
        opacity: 0;
        transform: translateX(-50%);
        transition: opacity 0.2s ease;
    }

    &:hover b {
        opacity: 1;
    }
}

.wa-today {
    display: grid;
    gap: 12px;

    li {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 12px;
    }

    time {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
    }

    div {
        display: grid;
        min-width: 0;
    }

    span {
        overflow: hidden;
        color: var(--d-muted);
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    i {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--d-ok);

        &.is-pending {
            background: var(--d-wait);
        }
    }
}

// ── Bookings table ────────────────────────────────────────────────────────────
.wa-row {
    display: grid;
    grid-template-columns: 1.2fr 1.5fr 0.6fr 1fr;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    border-top: 1px solid var(--d-line);

    span {
        color: var(--d-muted);
    }

    time {
        font-weight: 600;
    }

    &--head {
        border-top: 0;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }
}

.wa-status {
    justify-self: start;
    padding: 5px 11px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    transition: transform 0.15s ease;

    &:hover {
        transform: scale(1.05);
    }

    &.is-confirmed {
        background: rgba(31, 157, 107, 0.14);
        color: var(--d-ok);
    }

    &.is-pending {
        background: rgba(201, 138, 18, 0.16);
        color: var(--d-wait);
    }

    &.is-cancelled {
        background: rgba(194, 73, 90, 0.14);
        color: var(--d-off);
    }
}

.wa-list-enter-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s ease,
        background 0.8s ease;
}

.wa-list-enter-from {
    background: rgba(91, 91, 214, 0.16);
    opacity: 0;
    transform: translateY(-8px);
}

.wa-hint {
    color: var(--d-muted);
    font-size: 12px;
}

.wa-empty {
    padding: 28px;
    color: var(--d-muted);
    text-align: center;
}

// ── Customers ─────────────────────────────────────────────────────────────────
.wa-search {
    display: flex;
    align-items: center;
    gap: 10px;
    width: min(260px, 100%);
    padding: 9px 14px;
    border: 1px solid var(--d-line);
    border-radius: 12px;
    background: var(--d-card);
    color: var(--d-muted);

    &:focus-within {
        border-color: var(--d-accent);
    }

    input {
        flex: 1;
        min-width: 0;
        border: 0;
        background: none;
        color: var(--d-ink);
        outline: none;

        &::-webkit-search-cancel-button {
            display: none;
        }
    }
}

.wa-customers {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    li {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 6px 12px;
        padding: 16px;
        border: 1px solid var(--d-line);
        border-radius: 16px;
        background: var(--d-card);
    }

    dl {
        display: flex;
        grid-column: 1 / -1;
        gap: 18px;
        margin: 6px 0 0;
    }

    dt {
        color: var(--d-muted);
        font-size: 11px;
    }

    dd {
        margin: 0;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 17px;
        font-weight: 700;
    }
}

@container (max-width: 900px) {
    .wa-stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .wa-panels {
        grid-template-columns: 1fr;
    }

    .wa-customers {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@container (max-width: 640px) {
    .wa {
        grid-template-columns: 1fr;
        grid-template-rows: minmax(0, 1fr) auto;
    }

    .wa-side {
        flex-direction: row;
        order: 2;
        padding: 8px;

        nav {
            display: flex;
            flex: 1;
        }

        nav button {
            flex: 1;
            flex-direction: column;
            gap: 4px;
            padding: 8px 4px;
            font-size: 11px;
        }
    }

    .wa-logo,
    .wa-user {
        display: none;
    }

    .wa-view {
        padding: 18px 14px;
    }

    .wa-row {
        grid-template-columns: 1fr auto;
        gap: 4px 12px;
        padding: 12px 14px;

        &--head {
            display: none;
        }

        &:first-child {
            border-top: 0;
        }

        span {
            grid-row: 2;
            font-size: 12px;
        }

        time {
            grid-row: 1;
            grid-column: 2;
            justify-self: end;
        }

        .wa-status {
            grid-row: 2;
            grid-column: 2;
            justify-self: end;
        }
    }

    .wa-customers {
        grid-template-columns: 1fr;
    }
}
</style>

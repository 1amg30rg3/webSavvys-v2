<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { onClickOutside, useDebounceFn } from '@vueuse/core';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import BarList from '@/components/admin/BarList.vue';
import ColumnChart from '@/components/admin/ColumnChart.vue';
import Icon from '@/components/admin/Icon.vue';
import LineChart from '@/components/admin/LineChart.vue';
import VisitorDrawer from '@/components/admin/VisitorDrawer.vue';
import { useAdminTheme } from '@/composables/useAdminTheme';
import {
    ago,
    copyText,
    deviceIcon,
    fmt,
    host,
    isActive,
    type Filters,
    type Hit,
    type IpRow,
    type Item,
    type Paginated,
    type Visitor,
} from '@/lib/admin';

const props = defineProps<{
    filters: Filters;
    sort: { by: string; dir: 'asc' | 'desc' };
    options: Record<'device' | 'browser' | 'os' | 'locale' | 'path', string[]>;
    stats: {
        views: number;
        uniqueIps: number;
        prevViews: number;
        prevUniqueIps: number;
        avgPages: number;
        today: number;
        onlineNow: number;
        bots: number;
    };
    series: { date: string; views: number; visitors: number }[];
    hours: Item[];
    pages: Item[];
    devices: Item[];
    browsers: Item[];
    systems: Item[];
    locales: Item[];
    referrers: Item[];
    ips: Paginated<IpRow>;
    recent: Paginated<Hit>;
    visitor: Visitor | null;
    excludedIps: string[];
    newLeads: number;
}>();

type Query = Record<string, string | number>;

const { theme, toggle: toggleTheme } = useAdminTheme();
const tab = ref<'overview' | 'visitors' | 'activity'>('overview');
const audienceTab = ref<'devices' | 'browsers' | 'systems' | 'locales'>('devices');
const loading = ref(false);
const drawerIp = ref<string | null>(null);
const drawerLoading = ref(false);
const searchText = ref(props.filters.q);
const searchInput = ref<HTMLInputElement | null>(null);
const filtersOpen = ref(false);
const filtersEl = ref<HTMLElement | null>(null);
const referrerText = ref(props.filters.referrer);
const rangeOpen = ref(false);
const rangeEl = ref<HTMLElement | null>(null);
const fromDate = ref(props.filters.from);
const toDate = ref(props.filters.to);
const today = new Date().toISOString().slice(0, 10);
const copiedIp = ref<string | null>(null);

const ranges = [
    { value: 1, label: 'Today' },
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' },
] as const;

const selects = [
    { key: 'device', label: 'Device' },
    { key: 'browser', label: 'Browser' },
    { key: 'os', label: 'Operating system' },
    { key: 'locale', label: 'Language' },
    { key: 'path', label: 'Page' },
] as const;

const audience = computed(() => ({
    devices: props.devices,
    browsers: props.browsers,
    systems: props.systems,
    locales: props.locales,
}));
const audienceFilter = { devices: 'device', browsers: 'browser', systems: 'os', locales: 'locale' } as const;

// ── Navigation (all state lives in the URL) ───────────────────────────────────
const params = (f: Filters, extra: Query = {}) => {
    const q: Query = { sort: props.sort.by, dir: props.sort.dir, ...extra };
    if (f.from && f.to) {
        q.from = f.from;
        q.to = f.to;
    } else {
        q.range = f.range;
    }
    if (f.bots) q.bots = 1;
    for (const k of ['q', 'ip', 'device', 'browser', 'os', 'locale', 'path', 'referrer'] as const) if (f[k]) q[k] = f[k];
    return q;
};

function go(query: Query, only?: string[]) {
    router.get('/admin', query, {
        preserveScroll: true,
        preserveState: true,
        ...(only ? { only } : {}),
        onStart: () => (loading.value = true),
        onFinish: () => (loading.value = false),
    });
}

const apply = (next: Partial<Filters>, extra: Query = {}) => go(params({ ...props.filters, ...next }, extra));

function sortBy(by: string) {
    const dir = props.sort.by === by && props.sort.dir === 'desc' ? 'asc' : 'desc';
    go({ ...params(props.filters), sort: by, dir });
}

const goPage = (name: 'vpage' | 'rpage', page: number) => go(params(props.filters, { [name]: page }));
const refresh = () => go(params(props.filters));

function pageWindow(current: number, last: number) {
    const out: number[] = [];
    for (let p = Math.max(1, current - 2); p <= Math.min(last, current + 2); p++) out.push(p);
    return out;
}

// ── Search ────────────────────────────────────────────────────────────────────
const runSearch = (value: string) => {
    if (value.trim() !== '' && tab.value === 'overview') tab.value = 'visitors';
    apply({ q: value.trim() });
};
const debouncedSearch = useDebounceFn(runSearch, 350);
watch(
    () => props.filters.q,
    (v) => {
        if (v !== searchText.value && document.activeElement !== searchInput.value) searchText.value = v;
    },
);
const clearSearch = () => {
    searchText.value = '';
    apply({ q: '' });
    searchInput.value?.focus();
};

// ── Filters ───────────────────────────────────────────────────────────────────
const advancedCount = computed(() => {
    const f = props.filters;
    return selects.filter((s) => f[s.key]).length + (f.referrer ? 1 : 0) + (f.ip ? 1 : 0) + (f.bots ? 1 : 0);
});

const chips = computed(() => {
    const f = props.filters;
    const out: { key: keyof Filters; label: string; icon: string }[] = [];
    if (f.q) out.push({ key: 'q', label: `Search: ${f.q}`, icon: 'search' });
    if (f.ip) out.push({ key: 'ip', label: `IP: ${f.ip}`, icon: 'users' });
    if (f.device) out.push({ key: 'device', label: `Device: ${f.device}`, icon: deviceIcon(f.device) });
    if (f.browser) out.push({ key: 'browser', label: `Browser: ${f.browser}`, icon: 'compass' });
    if (f.os) out.push({ key: 'os', label: `OS: ${f.os}`, icon: 'cpu' });
    if (f.locale) out.push({ key: 'locale', label: `Language: ${f.locale}`, icon: 'globe' });
    if (f.path) out.push({ key: 'path', label: `Page: ${f.path}`, icon: 'file' });
    if (f.referrer) out.push({ key: 'referrer', label: `Referrer: ${f.referrer}`, icon: 'link' });
    if (f.bots) out.push({ key: 'bots', label: 'Including bots', icon: 'bot' });
    return out;
});

function removeChip(key: keyof Filters) {
    if (key === 'q') searchText.value = '';
    if (key === 'referrer') referrerText.value = '';
    apply({ [key]: key === 'bots' ? false : '' } as Partial<Filters>);
}

function clearFilters() {
    searchText.value = '';
    referrerText.value = '';
    apply({ q: '', ip: '', device: '', browser: '', os: '', locale: '', path: '', referrer: '', bots: false });
}

onClickOutside(filtersEl, () => (filtersOpen.value = false));
onClickOutside(rangeEl, () => (rangeOpen.value = false));

watch(
    () => [props.filters.from, props.filters.to],
    ([f, t]) => {
        fromDate.value = f;
        toDate.value = t;
    },
);

const rangeValid = computed(() => !!fromDate.value && !!toDate.value);
function applyCustom() {
    if (!rangeValid.value) return;
    rangeOpen.value = false;
    apply({ from: fromDate.value, to: toDate.value });
}
function quickRange(days: number) {
    const end = new Date();
    const start = new Date(Date.now() - (days - 1) * 86400000);
    fromDate.value = start.toISOString().slice(0, 10);
    toDate.value = end.toISOString().slice(0, 10);
    applyCustom();
}
const shortDate = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const customLabel = computed(() => (props.filters.custom ? `${shortDate(props.filters.from)} – ${shortDate(props.filters.to)}` : 'Custom'));

// ── Visitor drawer ────────────────────────────────────────────────────────────
function openVisitor(ip: string) {
    drawerIp.value = ip;
    drawerLoading.value = true;
    router.get('/admin', params(props.filters, { visitor: ip }), {
        preserveScroll: true,
        preserveState: true,
        only: ['visitor'],
        onFinish: () => (drawerLoading.value = false),
    });
}

function filterFromDrawer(next: Partial<Filters>) {
    drawerIp.value = null;
    if (tab.value === 'overview') tab.value = 'visitors';
    apply(next);
}

// ── Misc UI ───────────────────────────────────────────────────────────────────
async function copyIp(ip: string) {
    if (await copyText(ip)) {
        copiedIp.value = ip;
        setTimeout(() => copiedIp.value === ip && (copiedIp.value = null), 1500);
    }
}

const maxHits = computed(() => Math.max(1, ...props.ips.data.map((r) => r.hits)));
const sortIcon = (key: string) => (props.sort.by === key ? (props.sort.dir === 'asc' ? 'arrow-up' : 'arrow-down') : 'sort');
const ariaSort = (key: string) => (props.sort.by === key ? (props.sort.dir === 'asc' ? 'ascending' : 'descending') : 'none');

function delta(cur: number, prev: number) {
    if (!prev) return cur ? { text: 'New', up: true } : null;
    const pct = Math.round(((cur - prev) / prev) * 100);
    return { text: `${pct > 0 ? '+' : ''}${pct}%`, up: pct >= 0 };
}
const viewsDelta = computed(() => delta(props.stats.views, props.stats.prevViews));
const ipsDelta = computed(() => delta(props.stats.uniqueIps, props.stats.prevUniqueIps));
const rangeText = computed(() => {
    if (props.filters.custom) return 'in the selected range';
    return props.filters.range === 1 ? 'today' : `in the last ${props.filters.range} days`;
});

const logout = () => router.post('/admin/logout');

function onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement;
    if (e.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(t.tagName)) {
        e.preventDefault();
        searchInput.value?.focus();
    }
    if (e.key === 'Escape') {
        filtersOpen.value = false;
        rangeOpen.value = false;
    }
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <Head title="Visitors"><meta name="robots" content="noindex, nofollow" /></Head>
    <div class="admin">
        <div v-if="loading" class="loadbar" role="progressbar" aria-label="Loading" />

        <!-- Header -->
        <header class="topbar">
            <div class="brand">
                <span class="mark"><b>Web</b>Savvys</span>
                <span class="eyebrow">Admin</span>
            </div>
            <div class="head-actions">
                <Link class="btn" href="/admin/leads" title="Contact form requests">
                    <Icon name="inbox" :size="15" /><span class="lbl">Requests</span><span v-if="newLeads" class="count">{{ newLeads }}</span>
                </Link>
                <button class="btn" :disabled="loading" title="Reload data" @click="refresh">
                    <Icon name="refresh" :size="15" :class="{ spin: loading }" /><span class="lbl">Refresh</span>
                </button>
                <button
                    class="btn icon-only"
                    :title="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
                    aria-label="Toggle theme"
                    @click="toggleTheme"
                >
                    <Icon :name="theme === 'dark' ? 'sun' : 'moon'" :size="15" />
                </button>
                <button class="btn" @click="logout"><Icon name="log-out" :size="15" /><span class="lbl">Sign out</span></button>
            </div>
        </header>

        <div class="page-head">
            <h1>Visitors</h1>
            <p class="desc">See who is visiting, what they look at, and where they come from.</p>
        </div>

        <!-- Toolbar -->
        <div class="toolbar">
            <div class="search">
                <Icon name="search" :size="16" />
                <input
                    ref="searchInput"
                    v-model="searchText"
                    type="search"
                    placeholder="Search by IP address or page…"
                    aria-label="Search visitors by IP address or page"
                    autocomplete="off"
                    @input="debouncedSearch(searchText)"
                    @keydown.enter="runSearch(searchText)"
                />
                <button v-if="searchText" class="clear" aria-label="Clear search" @click="clearSearch"><Icon name="x" :size="14" /></button>
                <kbd v-else>/</kbd>
            </div>

            <div ref="rangeEl" class="pop-wrap range-wrap">
                <div class="seg" role="radiogroup" aria-label="Date range">
                    <button
                        v-for="r in ranges"
                        :key="r.value"
                        role="radio"
                        :aria-checked="!filters.custom && filters.range === r.value"
                        :class="{ on: !filters.custom && filters.range === r.value }"
                        @click="apply({ range: r.value, from: '', to: '' })"
                    >
                        {{ r.label }}
                    </button>
                    <button
                        role="radio"
                        class="custom-btn"
                        :aria-checked="filters.custom"
                        :class="{ on: filters.custom }"
                        aria-haspopup="dialog"
                        :aria-expanded="rangeOpen"
                        @click="rangeOpen = !rangeOpen"
                    >
                        <Icon name="calendar" :size="14" />{{ customLabel }}
                    </button>
                </div>
                <div v-if="rangeOpen" class="popover range-pop" role="dialog" aria-label="Custom date range">
                    <div class="pop-grid">
                        <label class="field">
                            <span>From</span>
                            <input v-model="fromDate" type="date" :max="toDate || today" />
                        </label>
                        <label class="field">
                            <span>To</span>
                            <input v-model="toDate" type="date" :min="fromDate" :max="today" />
                        </label>
                    </div>
                    <div class="quick">
                        <button type="button" @click="quickRange(14)">Last 14 days</button>
                        <button type="button" @click="quickRange(60)">Last 60 days</button>
                        <button type="button" @click="quickRange(180)">Last 6 months</button>
                    </div>
                    <div class="pop-foot">
                        <button class="link" @click="rangeOpen = false">Cancel</button>
                        <button class="btn primary" :disabled="!rangeValid" @click="applyCustom">Apply range</button>
                    </div>
                </div>
            </div>

            <div ref="filtersEl" class="pop-wrap">
                <button
                    class="btn"
                    :class="{ active: advancedCount > 0 }"
                    aria-haspopup="dialog"
                    :aria-expanded="filtersOpen"
                    @click="filtersOpen = !filtersOpen"
                >
                    <Icon name="filter" :size="15" />Filters<span v-if="advancedCount" class="count">{{ advancedCount }}</span>
                </button>
                <div v-if="filtersOpen" class="popover" role="dialog" aria-label="Filters">
                    <div class="pop-grid">
                        <label v-for="s in selects" :key="s.key" class="field">
                            <span>{{ s.label }}</span>
                            <select :value="filters[s.key]" @change="apply({ [s.key]: ($event.target as HTMLSelectElement).value })">
                                <option value="">Any</option>
                                <option v-for="o in options[s.key]" :key="o" :value="o">{{ o }}</option>
                            </select>
                        </label>
                        <form class="field" @submit.prevent="apply({ referrer: referrerText.trim() })">
                            <span>Referrer</span>
                            <input
                                v-model="referrerText"
                                list="referrer-options"
                                placeholder="google.com or Direct"
                                @blur="referrerText.trim() !== filters.referrer && apply({ referrer: referrerText.trim() })"
                            />
                            <datalist id="referrer-options">
                                <option value="Direct" />
                                <option v-for="r in referrers" :key="r.label" :value="r.label" />
                            </datalist>
                        </form>
                    </div>
                    <label class="switch">
                        <input type="checkbox" :checked="filters.bots" @change="apply({ bots: !filters.bots })" />
                        <span class="track" aria-hidden="true" />
                        <span>Include bots and crawlers</span>
                    </label>
                    <div class="pop-foot">
                        <button class="link" :disabled="!chips.length" @click="clearFilters">Clear filters</button>
                        <button class="btn primary" @click="filtersOpen = false">Done</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="chips.length" class="chips" aria-label="Active filters">
            <button v-for="c in chips" :key="c.key" class="fchip" :title="`Remove ${c.label}`" @click="removeChip(c.key)">
                <Icon :name="c.icon" :size="12" />{{ c.label }}<Icon name="x" :size="12" />
            </button>
            <button class="link" @click="clearFilters">Clear filters</button>
        </div>

        <!-- KPIs -->
        <section class="kpis" :class="{ dim: loading }" aria-label="Key figures">
            <div class="kpi primary">
                <div class="k-label"><Icon name="eye" :size="14" />Page views</div>
                <div class="k-row">
                    <strong>{{ stats.views.toLocaleString() }}</strong>
                    <span v-if="viewsDelta" class="delta" :class="viewsDelta.up ? 'up' : 'down'">{{ viewsDelta.text }}</span>
                </div>
                <div class="k-sub">{{ viewsDelta ? 'vs previous period' : rangeText }}</div>
            </div>
            <div class="kpi primary">
                <div class="k-label"><Icon name="users" :size="14" />Unique visitors <span class="hint">by IP</span></div>
                <div class="k-row">
                    <strong>{{ stats.uniqueIps.toLocaleString() }}</strong>
                    <span v-if="ipsDelta" class="delta" :class="ipsDelta.up ? 'up' : 'down'">{{ ipsDelta.text }}</span>
                </div>
                <div class="k-sub">{{ ipsDelta ? 'vs previous period' : rangeText }}</div>
            </div>
            <div class="kpi">
                <div class="k-label"><Icon name="file" :size="14" />Pages / visitor</div>
                <div class="k-row">
                    <strong>{{ stats.avgPages }}</strong>
                </div>
            </div>
            <div class="kpi">
                <div class="k-label"><span class="dot live" />Active now</div>
                <div class="k-row">
                    <strong>{{ stats.onlineNow }}</strong>
                </div>
                <div class="k-sub">last 5 minutes</div>
            </div>
            <div class="kpi">
                <div class="k-label"><Icon name="clock" :size="14" />Views today</div>
                <div class="k-row">
                    <strong>{{ stats.today.toLocaleString() }}</strong>
                </div>
            </div>
            <div class="kpi">
                <div class="k-label"><Icon name="bot" :size="14" />Bot traffic</div>
                <div class="k-row">
                    <strong>{{ stats.bots.toLocaleString() }}</strong>
                </div>
                <div class="k-sub">{{ filters.bots ? 'included below' : 'hidden below' }}</div>
            </div>
        </section>

        <!-- Tabs -->
        <nav class="tabs" role="tablist" aria-label="Dashboard sections">
            <button role="tab" :aria-selected="tab === 'overview'" :class="{ on: tab === 'overview' }" @click="tab = 'overview'">
                <Icon name="activity" :size="15" />Overview
            </button>
            <button role="tab" :aria-selected="tab === 'visitors'" :class="{ on: tab === 'visitors' }" @click="tab = 'visitors'">
                <Icon name="users" :size="15" />Visitors<span class="count">{{ ips.total.toLocaleString() }}</span>
            </button>
            <button role="tab" :aria-selected="tab === 'activity'" :class="{ on: tab === 'activity' }" @click="tab = 'activity'">
                <Icon name="clock" :size="15" />Activity<span class="count">{{ recent.total.toLocaleString() }}</span>
            </button>
        </nav>

        <!-- Overview -->
        <div v-if="tab === 'overview'" class="vstack" :class="{ dim: loading }">
            <section class="panel">
                <div class="panel-head">
                    <h2>Traffic</h2>
                    <span class="muted">Daily page views and unique IPs</span>
                </div>
                <LineChart :data="series" />
            </section>

            <div class="split">
                <section class="panel">
                    <div class="panel-head">
                        <h2>Top pages</h2>
                        <span class="muted">Click to filter</span>
                    </div>
                    <BarList :items="pages" clickable @select="apply({ path: $event })" />
                </section>

                <section class="panel">
                    <div class="panel-head">
                        <h2>Audience</h2>
                        <div class="mini-tabs" role="tablist">
                            <button
                                v-for="(label, k) in { devices: 'Device', browsers: 'Browser', systems: 'OS', locales: 'Language' }"
                                :key="k"
                                role="tab"
                                :aria-selected="audienceTab === k"
                                :class="{ on: audienceTab === k }"
                                @click="audienceTab = k"
                            >
                                {{ label }}
                            </button>
                        </div>
                    </div>
                    <BarList :items="audience[audienceTab]" color="var(--c2)" clickable @select="apply({ [audienceFilter[audienceTab]]: $event })" />
                </section>
            </div>

            <div class="split even">
                <section class="panel">
                    <div class="panel-head">
                        <h2>Referrers</h2>
                        <span class="muted">Where visitors come from</span>
                    </div>
                    <BarList :items="referrers" clickable @select="apply({ referrer: $event })" />
                </section>
                <section class="panel">
                    <div class="panel-head">
                        <h2>Traffic by hour</h2>
                        <span class="muted">UTC</span>
                    </div>
                    <ColumnChart :items="hours" />
                </section>
            </div>
        </div>

        <!-- Visitors -->
        <section v-else-if="tab === 'visitors'" class="panel table-panel" :class="{ dim: loading }">
            <div class="m-sort">
                <label for="m-sort-by">Sort by</label>
                <select
                    id="m-sort-by"
                    :value="sort.by"
                    @change="go({ ...params(filters), sort: ($event.target as HTMLSelectElement).value, dir: sort.dir })"
                >
                    <option value="last_seen">Last seen</option>
                    <option value="first_seen">First seen</option>
                    <option value="hits">Views</option>
                    <option value="ip">IP address</option>
                </select>
                <button
                    class="btn"
                    :aria-label="sort.dir === 'asc' ? 'Ascending' : 'Descending'"
                    @click="go({ ...params(filters), sort: sort.by, dir: sort.dir === 'asc' ? 'desc' : 'asc' })"
                >
                    <Icon :name="sort.dir === 'asc' ? 'arrow-up' : 'arrow-down'" :size="14" />
                </button>
            </div>
            <div class="scroll">
                <table>
                    <thead>
                        <tr>
                            <th :aria-sort="ariaSort('ip')">
                                <button class="sort" :class="{ on: sort.by === 'ip' }" @click="sortBy('ip')">
                                    Visitor<Icon :name="sortIcon('ip')" :size="12" />
                                </button>
                            </th>
                            <th :aria-sort="ariaSort('hits')" class="num">
                                <button class="sort" :class="{ on: sort.by === 'hits' }" @click="sortBy('hits')">
                                    Views<Icon :name="sortIcon('hits')" :size="12" />
                                </button>
                            </th>
                            <th class="num">Pages</th>
                            <th>Language</th>
                            <th :aria-sort="ariaSort('first_seen')">
                                <button class="sort" :class="{ on: sort.by === 'first_seen' }" @click="sortBy('first_seen')">
                                    First seen<Icon :name="sortIcon('first_seen')" :size="12" />
                                </button>
                            </th>
                            <th :aria-sort="ariaSort('last_seen')">
                                <button class="sort" :class="{ on: sort.by === 'last_seen' }" @click="sortBy('last_seen')">
                                    Last seen<Icon :name="sortIcon('last_seen')" :size="12" />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="v in ips.data"
                            :key="v.ip"
                            class="row"
                            tabindex="0"
                            :aria-label="`Open details for ${v.ip}`"
                            @click="openVisitor(v.ip)"
                            @keydown.enter.prevent="openVisitor(v.ip)"
                        >
                            <td>
                                <div class="visitor">
                                    <span class="avatar" :class="{ bot: v.is_bot }"
                                        ><Icon :name="v.is_bot ? 'bot' : deviceIcon(v.device)" :size="16"
                                    /></span>
                                    <div class="v-main">
                                        <div class="ip-line">
                                            <span class="ip">{{ v.ip }}</span>
                                            <span v-if="v.is_bot" class="badge warn">Bot</span>
                                            <span v-else-if="isActive(v.last_seen)" class="badge ok"><i class="dot live" />Active</span>
                                            <button
                                                class="copy"
                                                :title="copiedIp === v.ip ? 'Copied!' : 'Copy IP address'"
                                                :aria-label="`Copy ${v.ip}`"
                                                @click.stop="copyIp(v.ip)"
                                            >
                                                <Icon :name="copiedIp === v.ip ? 'check' : 'copy'" :size="13" />
                                            </button>
                                        </div>
                                        <div class="v-sub">
                                            {{ v.browser }} · {{ v.os }} · <span class="cap">{{ v.device }}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="num" data-label="Views">
                                <div class="hits">
                                    <span class="hbar"><i :style="{ width: `${(v.hits / maxHits) * 100}%` }" /></span>
                                    <strong>{{ v.hits.toLocaleString() }}</strong>
                                </div>
                            </td>
                            <td class="num" data-label="Pages">{{ v.pages }}</td>
                            <td data-label="Language">
                                <span v-if="v.locale" class="badge neutral">{{ v.locale }}</span
                                ><span v-else class="muted">—</span>
                            </td>
                            <td class="muted" data-label="First seen">{{ fmt(v.first_seen) }}</td>
                            <td data-label="Last seen">
                                <div class="seen">{{ ago(v.last_seen) }}</div>
                                <div class="muted small">{{ fmt(v.last_seen) }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="!ips.data.length" class="empty">
                    <Icon name="inbox" :size="28" />
                    <strong>No visitors found</strong>
                    <p>Nothing matches your search and filters in this date range.</p>
                    <button v-if="chips.length" class="btn" @click="clearFilters">Clear filters</button>
                </div>
            </div>
            <footer v-if="ips.last_page > 1" class="pager">
                <span class="muted">{{ ips.from }}–{{ ips.to }} of {{ ips.total.toLocaleString() }}</span>
                <div class="pages">
                    <button class="pg" :disabled="ips.current_page <= 1" aria-label="Previous page" @click="goPage('vpage', ips.current_page - 1)">
                        <Icon name="chevron-left" :size="14" />
                    </button>
                    <button
                        v-for="p in pageWindow(ips.current_page, ips.last_page)"
                        :key="p"
                        class="pg"
                        :class="{ on: p === ips.current_page }"
                        :aria-current="p === ips.current_page ? 'page' : undefined"
                        @click="goPage('vpage', p)"
                    >
                        {{ p }}
                    </button>
                    <button
                        class="pg"
                        :disabled="ips.current_page >= ips.last_page"
                        aria-label="Next page"
                        @click="goPage('vpage', ips.current_page + 1)"
                    >
                        <Icon name="chevron-right" :size="14" />
                    </button>
                </div>
            </footer>
        </section>

        <!-- Activity -->
        <section v-else class="panel table-panel" :class="{ dim: loading }">
            <div class="scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Visitor</th>
                            <th>Page</th>
                            <th>Device</th>
                            <th>Referrer</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="v in recent.data"
                            :key="v.id"
                            class="row"
                            tabindex="0"
                            :aria-label="`Open details for ${v.ip}`"
                            @click="openVisitor(v.ip)"
                            @keydown.enter.prevent="openVisitor(v.ip)"
                        >
                            <td data-label="Time">
                                <div class="seen">{{ ago(v.visited_at) }}</div>
                                <div class="muted small">{{ fmt(v.visited_at) }}</div>
                            </td>
                            <td>
                                <div class="ip-line">
                                    <span class="ip">{{ v.ip }}</span>
                                    <span v-if="v.is_bot" class="badge warn">Bot</span>
                                    <button
                                        class="copy"
                                        :title="copiedIp === v.ip ? 'Copied!' : 'Copy IP address'"
                                        :aria-label="`Copy ${v.ip}`"
                                        @click.stop="copyIp(v.ip)"
                                    >
                                        <Icon :name="copiedIp === v.ip ? 'check' : 'copy'" :size="13" />
                                    </button>
                                </div>
                            </td>
                            <td data-label="Page">
                                <button class="path-pill" :title="`Filter by ${v.path}`" @click.stop="apply({ path: v.path })">{{ v.path }}</button>
                            </td>
                            <td data-label="Device">
                                <span class="inline"><Icon :name="deviceIcon(v.device)" :size="14" />{{ v.browser }} · {{ v.os }}</span>
                            </td>
                            <td class="ref" :class="{ muted: !v.referrer }">{{ host(v.referrer) }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="!recent.data.length" class="empty">
                    <Icon name="inbox" :size="28" />
                    <strong>No activity found</strong>
                    <p>Nothing matches your search and filters in this date range.</p>
                    <button v-if="chips.length" class="btn" @click="clearFilters">Clear filters</button>
                </div>
            </div>
            <footer v-if="recent.last_page > 1" class="pager">
                <span class="muted">{{ recent.from }}–{{ recent.to }} of {{ recent.total.toLocaleString() }}</span>
                <div class="pages">
                    <button
                        class="pg"
                        :disabled="recent.current_page <= 1"
                        aria-label="Previous page"
                        @click="goPage('rpage', recent.current_page - 1)"
                    >
                        <Icon name="chevron-left" :size="14" />
                    </button>
                    <button
                        v-for="p in pageWindow(recent.current_page, recent.last_page)"
                        :key="p"
                        class="pg"
                        :class="{ on: p === recent.current_page }"
                        :aria-current="p === recent.current_page ? 'page' : undefined"
                        @click="goPage('rpage', p)"
                    >
                        {{ p }}
                    </button>
                    <button
                        class="pg"
                        :disabled="recent.current_page >= recent.last_page"
                        aria-label="Next page"
                        @click="goPage('rpage', recent.current_page + 1)"
                    >
                        <Icon name="chevron-right" :size="14" />
                    </button>
                </div>
            </footer>
        </section>

        <p class="foot">Excluded from tracking: {{ excludedIps.join(', ') || 'none' }}</p>

        <VisitorDrawer
            v-if="drawerIp"
            :ip="drawerIp"
            :visitor="visitor"
            :loading="drawerLoading"
            @close="drawerIp = null"
            @filter-ip="filterFromDrawer({ ip: $event })"
            @filter-path="filterFromDrawer({ path: $event })"
        />
    </div>
</template>

<style scoped>
/* Built on the public site's tokens (--bg, --surface, --text, --muted, --border, --accent*) so both feel like one product. */
.admin {
    --card: var(--surface);
    --hover: color-mix(in srgb, var(--text) 5%, transparent);
    --grid: var(--border);
    --c1: var(--accent);
    --c2: var(--accent-2);
    --warn: #c98a0a;
    --danger: #e5484d;
    --accent-soft: color-mix(in srgb, var(--accent) 14%, transparent);
    --font-heading: 'Space Grotesk', 'Segoe UI', sans-serif;
    position: relative;
    min-height: 100vh;
    color: var(--text);
    font-size: 14px;
    padding: 12px 0 56px;
    width: min(1280px, 100% - 2rem);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    align-content: start;
    user-select: text;
}
:root[data-theme='dark'] .admin {
    --warn: var(--accent-3);
    --danger: #ff7b7b;
}
.admin section {
    margin: 0;
}
.admin *:focus-visible {
    outline: 2px solid var(--c1);
    outline-offset: 2px;
}
.muted {
    color: var(--muted);
}
.small {
    font-size: 11px;
}
.cap {
    text-transform: capitalize;
}

/* Loading */
.loadbar {
    position: fixed;
    inset: 0 0 auto 0;
    height: 2px;
    z-index: 100;
    background: linear-gradient(90deg, transparent, var(--c1), transparent);
    background-size: 40% 100%;
    background-repeat: no-repeat;
    animation: load 1s linear infinite;
}
@keyframes load {
    from {
        background-position: -40% 0;
    }
    to {
        background-position: 140% 0;
    }
}
.dim {
    opacity: 0.6;
    transition: opacity 0.15s;
    pointer-events: none;
}
.spin {
    animation: spin 0.8s linear infinite;
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Header & toolbar */
.topbar {
    position: sticky;
    top: 10px;
    z-index: 40;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 8px 8px 8px 20px;
    background: color-mix(in srgb, var(--surface) 92%, transparent);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 22px;
    box-shadow: 0 4px 20px rgb(0 0 0 / 0.04);
}
.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}
.mark {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.01em;
}
.mark b {
    color: var(--accent);
}
.eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 11px;
    font-weight: 700;
    color: var(--accent);
    background: var(--accent-soft);
    border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
    padding: 3px 10px;
}
.page-head {
    display: grid;
    gap: 6px;
    margin-top: 8px;
}
h1 {
    margin: 0;
    font-family: var(--font-heading);
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.05;
}
.desc {
    margin: 0;
    color: var(--muted);
    max-width: 560px;
    line-height: 1.6;
}
.head-actions {
    display: flex;
    gap: 8px;
}
.btn.icon-only {
    width: 40px;
    padding: 0;
    justify-content: center;
}
@media (max-width: 560px) {
    .btn .lbl {
        display: none;
    }
    .btn {
        padding: 0 10px;
    }
}
.btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 40px;
    padding: 0 16px;
    background: var(--card);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 999px;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition:
        background 0.2s,
        border-color 0.2s,
        transform 0.2s;
}
.btn:hover:not(:disabled) {
    background: var(--hover);
    border-color: var(--accent);
    transform: translateY(-1px);
}
.btn:disabled {
    opacity: 0.6;
    cursor: default;
}
.btn.active {
    border-color: var(--accent);
    color: var(--accent);
}
.btn.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    height: 32px;
}
.btn.primary:hover:not(:disabled) {
    background: var(--accent);
    filter: brightness(1.06);
}
.count {
    background: var(--accent-soft);
    color: var(--c1);
    border-radius: 999px;
    padding: 0 7px;
    font-size: 11px;
    font-weight: 600;
    line-height: 18px;
    margin-left: 2px;
}
.toolbar {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
}
.search {
    flex: 1 1 320px;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 40px;
    padding: 0 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--muted);
    transition: border-color 0.15s;
}
.search:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-soft);
}
.search input {
    flex: 1;
    min-width: 0;
    background: none;
    border: 0;
    outline: 0;
    color: var(--text);
    font: inherit;
    font-size: 13px;
}
.search input::-webkit-search-cancel-button {
    display: none;
}
kbd {
    font: inherit;
    font-size: 11px;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0 6px;
    line-height: 18px;
}
.clear {
    background: none;
    border: 0;
    color: var(--muted);
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 2px;
    border-radius: 4px;
}
.clear:hover {
    color: var(--text);
}
.seg {
    display: inline-flex;
    padding: 4px;
    gap: 2px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 999px;
}
.seg button {
    height: 30px;
    padding: 0 14px;
    background: none;
    border: 0;
    border-radius: 999px;
    color: var(--muted);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}
.seg button:hover {
    color: var(--text);
}
.seg button.on {
    background: var(--accent);
    color: #fff;
}

/* Filters popover */
.pop-wrap {
    position: relative;
}
.popover {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    z-index: 30;
    width: min(420px, calc(100vw - 40px));
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 16px;
    box-shadow: 0 12px 40px rgb(0 0 0 / 0.35);
    display: grid;
    gap: 14px;
    animation: pop 0.12s ease-out;
}
@keyframes pop {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
}
.pop-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}
.field {
    display: grid;
    gap: 5px;
    font-size: 12px;
    color: var(--muted);
}
.field select,
.field input {
    height: 34px;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 12px;
    padding: 0 12px;
    font: inherit;
    font-size: 13px;
    min-width: 0;
    width: 100%;
}
.switch {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    cursor: pointer;
}
.switch input {
    position: absolute;
    opacity: 0;
}
.track {
    width: 34px;
    height: 20px;
    border-radius: 999px;
    background: var(--border);
    position: relative;
    transition: background 0.15s;
    flex: none;
}
.track::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.15s;
}
.switch input:checked + .track {
    background: var(--c1);
}
.switch input:checked + .track::after {
    transform: translateX(14px);
}
.switch input:focus-visible + .track {
    outline: 2px solid var(--c1);
    outline-offset: 2px;
}
.pop-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border);
    padding-top: 12px;
}
.link {
    background: none;
    border: 0;
    color: var(--muted);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
}
.link:hover:not(:disabled) {
    color: var(--text);
    text-decoration: underline;
}
.link:disabled {
    opacity: 0.5;
    cursor: default;
}
.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-top: -6px;
}
.fchip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 26px;
    padding: 0 8px 0 10px;
    background: var(--accent-soft);
    color: var(--c1);
    border: 0;
    border-radius: 999px;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    max-width: 260px;
}
.fchip:hover {
    background: color-mix(in srgb, var(--c1) 26%, transparent);
}

/* KPIs: one connected strip instead of six identical cards */
.kpis {
    display: grid;
    grid-template-columns: 1.5fr 1.5fr repeat(4, 1fr);
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgb(0 0 0 / 0.03);
}
.kpi {
    padding: 14px 18px;
    border-left: 1px solid var(--border);
    display: grid;
    gap: 4px;
    align-content: start;
}
.kpi:first-child {
    border-left: 0;
}
.k-label {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--muted);
    font-size: 12px;
}
.hint {
    font-size: 11px;
    opacity: 0.7;
}
.k-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
}
.kpi strong {
    font-family: var(--font-heading);
    font-size: 22px;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
}
.kpi.primary strong {
    font-size: 28px;
}
.k-sub {
    font-size: 11px;
    color: var(--muted);
}
.delta {
    font-size: 12px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 6px;
}
.delta.up {
    color: var(--c2);
    background: color-mix(in srgb, var(--c2) 14%, transparent);
}
.delta.down {
    color: var(--danger);
    background: color-mix(in srgb, var(--danger) 14%, transparent);
}
.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--c2);
    display: inline-block;
}
.dot.live {
    animation: pulse 1.8s ease-in-out infinite;
}
@keyframes pulse {
    50% {
        opacity: 0.35;
    }
}

/* Tabs */
.tabs {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--border);
}
.tabs button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: 0;
    border-bottom: 2px solid transparent;
    color: var(--muted);
    padding: 10px 14px;
    margin-bottom: -1px;
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s;
}
.tabs button:hover {
    color: var(--text);
}
.tabs button.on {
    color: var(--text);
    border-color: var(--accent);
}
.tabs .count {
    background: var(--hover);
    color: var(--muted);
}
.tabs button.on .count {
    background: var(--accent-soft);
    color: var(--accent);
}

/* Panels */
.vstack {
    display: grid;
    gap: 18px;
}
.panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 22px;
    min-width: 0;
    box-shadow: 0 4px 20px rgb(0 0 0 / 0.03);
}
.panel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    flex-wrap: wrap;
}
.panel-head h2 {
    margin: 0;
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
}
.panel-head .muted {
    font-size: 12px;
}
.split {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 18px;
}
.split.even {
    grid-template-columns: 1fr 1fr;
}
.mini-tabs {
    display: inline-flex;
    gap: 2px;
    background: var(--bg);
    border-radius: 999px;
    padding: 3px;
}
.mini-tabs button {
    background: none;
    border: 0;
    color: var(--muted);
    font: inherit;
    font-size: 12px;
    padding: 3px 12px;
    border-radius: 999px;
    cursor: pointer;
}
.mini-tabs button.on {
    background: var(--card);
    color: var(--text);
    box-shadow: 0 0 0 1px var(--border);
}

/* Tables */
.table-panel {
    padding: 0;
    overflow: clip;
}
.scroll {
    overflow: visible;
}
table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 13px;
}
thead th {
    position: sticky;
    top: 82px;
    z-index: 2;
    background: var(--card);
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
}
th.num,
td.num {
    text-align: right;
}
.sort {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
    padding: 2px 4px;
    margin: -2px -4px;
    border-radius: 4px;
}
.sort .icon {
    opacity: 0.45;
}
.sort:hover {
    color: var(--text);
}
.sort.on {
    color: var(--text);
}
.sort.on .icon {
    opacity: 1;
    color: var(--accent);
}
td {
    padding: 11px 14px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
}
tr.row {
    cursor: pointer;
    transition: background 0.12s;
}
tr.row:hover td,
tr.row:focus-visible td {
    background: var(--hover);
}
tr.row:focus-visible {
    outline: 2px solid var(--c1);
    outline-offset: -2px;
}
tbody tr:last-child td {
    border-bottom: 0;
}
.visitor {
    display: flex;
    gap: 12px;
    align-items: center;
}
.avatar {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: var(--hover);
    color: var(--muted);
    display: grid;
    place-items: center;
    flex: none;
}
.avatar.bot {
    background: color-mix(in srgb, var(--warn) 14%, transparent);
    color: var(--warn);
}
.ip-line {
    display: flex;
    align-items: center;
    gap: 8px;
}
.ip {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    font-weight: 600;
}
.v-sub {
    color: var(--muted);
    font-size: 12px;
    margin-top: 1px;
}
.copy {
    background: none;
    border: 0;
    color: var(--muted);
    width: 24px;
    height: 24px;
    border-radius: 5px;
    display: grid;
    place-items: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.12s;
}
tr.row:hover .copy,
tr.row:focus-within .copy,
.copy:focus-visible {
    opacity: 1;
}
.copy:hover {
    background: var(--border);
    color: var(--text);
}
@media (hover: none) {
    .copy {
        opacity: 1;
    }
}
.badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 999px;
    padding: 1px 8px;
    font-size: 11px;
    font-weight: 500;
    line-height: 18px;
}
.badge.ok {
    background: color-mix(in srgb, var(--c2) 15%, transparent);
    color: var(--c2);
}
.badge.warn {
    background: color-mix(in srgb, var(--warn) 16%, transparent);
    color: var(--warn);
}
.badge.neutral {
    background: var(--hover);
    color: var(--text);
    text-transform: uppercase;
    border-radius: 5px;
}
.badge .dot {
    width: 6px;
    height: 6px;
}
.hits {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
}
.hbar {
    width: 56px;
    height: 4px;
    border-radius: 2px;
    background: var(--border);
    overflow: hidden;
}
.hbar i {
    display: block;
    height: 100%;
    background: var(--c1);
    border-radius: 2px;
}
.hits strong {
    min-width: 28px;
    text-align: right;
}
.seen {
    font-weight: 500;
}
.inline {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--muted);
}
.ref {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.path-pill {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    background: var(--hover);
    color: var(--text);
    border: 1px solid transparent;
    border-radius: 6px;
    padding: 2px 8px;
    cursor: pointer;
    transition: border-color 0.12s;
}
.path-pill:hover {
    border-color: var(--c1);
}
.empty {
    display: grid;
    justify-items: center;
    gap: 6px;
    padding: 56px 16px;
    color: var(--muted);
    text-align: center;
}
.empty strong {
    color: var(--text);
    font-size: 15px;
}
.empty p {
    margin: 0 0 8px;
}
.pager {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    border-top: 1px solid var(--border);
    font-size: 13px;
}
.pages {
    display: flex;
    gap: 4px;
}
.pg {
    min-width: 30px;
    height: 30px;
    padding: 0 8px;
    background: none;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--text);
    font: inherit;
    font-size: 13px;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
}
.pg:hover:not(:disabled) {
    background: var(--hover);
}
.pg.on {
    background: var(--accent-soft);
    color: var(--c1);
    font-weight: 600;
}
.pg:disabled {
    opacity: 0.35;
    cursor: default;
}
.foot {
    margin: 0;
    text-align: center;
    font-size: 12px;
    color: var(--muted);
}

@media (max-width: 1000px) {
    .kpis {
        grid-template-columns: repeat(3, 1fr);
    }
    .kpi:nth-child(4) {
        border-left: 0;
    }
    .kpi:nth-child(n + 4) {
        border-top: 1px solid var(--border);
    }
    .kpi:nth-child(3) {
        border-left: 1px solid var(--border);
    }
    .split,
    .split.even {
        grid-template-columns: 1fr;
    }
}
@media (max-width: 560px) {
    .admin {
        padding: 20px 16px 40px;
    }
    .kpis {
        grid-template-columns: 1fr 1fr;
    }
    .kpi,
    .kpi:nth-child(n) {
        border-left: 0;
        border-top: 1px solid var(--border);
    }
    .kpi:nth-child(-n + 2) {
        border-top: 0;
    }
    .kpi:nth-child(even) {
        border-left: 1px solid var(--border);
    }
    .seg {
        width: 100%;
    }
    .seg button {
        flex: 1;
        padding: 0 6px;
    }
    .pop-grid {
        grid-template-columns: 1fr;
    }
    .popover {
        position: fixed;
        left: 20px;
        right: 20px;
        top: auto;
        bottom: 20px;
        width: auto;
    }
}

/* Custom date range */
.seg .custom-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
}
.range-pop {
    width: min(340px, calc(100vw - 2rem));
}
.quick {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.quick button {
    background: var(--hover);
    border: 1px solid transparent;
    border-radius: 999px;
    color: var(--text);
    font: inherit;
    font-size: 12px;
    padding: 5px 12px;
    cursor: pointer;
    transition: border-color 0.15s;
}
.quick button:hover {
    border-color: var(--accent);
}
.field input[type='date'] {
    color-scheme: inherit;
}
.m-sort {
    display: none;
}

/* Tables become stacked cards on small screens, so nothing needs a horizontal scrollbar */
@media (max-width: 980px) {
    .m-sort {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
        border-bottom: 1px solid var(--border);
        font-size: 12px;
        color: var(--muted);
    }
    .m-sort select {
        flex: 1;
        height: 36px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 999px;
        color: var(--text);
        padding: 0 14px;
        font: inherit;
        font-size: 13px;
    }
    .m-sort .btn {
        height: 36px;
        width: 36px;
        padding: 0;
        justify-content: center;
    }
    table,
    tbody {
        display: block;
    }
    thead {
        display: none;
    }
    tr.row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px 16px;
        padding: 14px;
        border-bottom: 1px solid var(--border);
    }
    tbody tr:last-child {
        border-bottom: 0;
    }
    tr.row:hover {
        background: var(--hover);
    }
    tr.row td,
    tr.row:hover td {
        display: block;
        padding: 0;
        border: 0;
        background: none;
        white-space: normal;
        min-width: 0;
    }
    tr.row td:first-child {
        grid-column: 1 / -1;
    }
    tr.row td[data-label]::before {
        content: attr(data-label);
        display: block;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--muted);
        margin-bottom: 3px;
    }
    td.num {
        text-align: left;
    }
    .hits {
        justify-content: flex-start;
    }
    .hits strong {
        text-align: left;
    }
    .ref {
        max-width: none;
    }
    .copy {
        opacity: 1;
    }
}

@media (max-width: 560px) {
    .topbar {
        padding: 6px 6px 6px 14px;
        top: 6px;
    }
    .eyebrow {
        display: none;
    }
    .panel {
        padding: 16px;
        border-radius: 18px;
    }
    .table-panel {
        padding: 0;
    }
    .search {
        flex-basis: 100%;
    }
    .range-wrap {
        width: 100%;
    }
    .seg {
        flex-wrap: wrap;
        border-radius: 22px;
    }
    .seg button {
        flex: 1 1 auto;
        justify-content: center;
    }
    .toolbar > .pop-wrap:last-child,
    .toolbar > .pop-wrap:last-child .btn {
        width: 100%;
        justify-content: center;
    }
    .pager {
        flex-direction: column;
        gap: 10px;
    }
    .kpi.primary strong {
        font-size: 24px;
    }
    .tabs button {
        flex: 1;
        min-width: 0;
        justify-content: center;
        padding: 10px 4px;
        gap: 6px;
    }
    .tabs .icon {
        display: none;
    }
    .range-pop {
        position: fixed;
        left: 16px;
        right: 16px;
        top: auto;
        bottom: 16px;
        width: auto;
    }
}

@media (prefers-reduced-motion: reduce) {
    .loadbar,
    .spin,
    .dot.live,
    .popover {
        animation: none;
    }
}
</style>

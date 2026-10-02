<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref } from 'vue';

import BarList from '@/components/admin/BarList.vue';
import ColumnChart from '@/components/admin/ColumnChart.vue';
import LineChart from '@/components/admin/LineChart.vue';

type Item = { label: string; value: number };

const props = defineProps<{
    filters: { range: number; bots: boolean; ip: string };
    stats: { views: number; uniqueIps: number; today: number; onlineNow: number; bots: number };
    series: { date: string; views: number; visitors: number }[];
    hours: Item[];
    pages: Item[];
    devices: Item[];
    browsers: Item[];
    systems: Item[];
    locales: Item[];
    referrers: Item[];
    ips: { ip: string; hits: number; first_seen: string; last_seen: string; device: string; browser: string; os: string }[];
    recent: { id: number; ip: string; path: string; device: string; browser: string; os: string; referrer: string | null; is_bot: boolean; visited_at: string }[];
}>();

const ipSearch = ref(props.filters.ip);

function apply(next: Partial<{ range: number; bots: boolean; ip: string }>) {
    const f = { ...props.filters, ...next };
    router.get('/admin', { range: f.range, bots: f.bots ? 1 : undefined, ip: f.ip || undefined }, { preserveScroll: true, preserveState: true });
}

const fmt = (s: string) => new Date(s.replace(' ', 'T') + (s.includes('Z') ? '' : 'Z')).toLocaleString();
const logout = () => router.post('/admin/logout');
</script>

<template>
    <Head title="Visitors"><meta name="robots" content="noindex, nofollow" /></Head>
    <div class="admin">
        <header>
            <h1>Visitors</h1>
            <div class="controls">
                <div class="seg">
                    <button v-for="r in [1, 7, 30, 90]" :key="r" :class="{ on: filters.range === r }" @click="apply({ range: r })">
                        {{ r === 1 ? 'Today' : `${r}d` }}
                    </button>
                </div>
                <form @submit.prevent="apply({ ip: ipSearch })">
                    <input v-model="ipSearch" placeholder="Filter by IP…" />
                </form>
                <label class="check"><input type="checkbox" :checked="filters.bots" @change="apply({ bots: !filters.bots })" /> Include bots</label>
                <button class="ghost" @click="logout">Sign out</button>
            </div>
        </header>

        <section class="kpis">
            <div class="card"><small>Page views</small><b>{{ stats.views.toLocaleString() }}</b></div>
            <div class="card"><small>Unique IPs</small><b>{{ stats.uniqueIps.toLocaleString() }}</b></div>
            <div class="card"><small>Views today</small><b>{{ stats.today.toLocaleString() }}</b></div>
            <div class="card"><small>Active (5 min)</small><b>{{ stats.onlineNow }}</b></div>
            <div class="card"><small>Bot hits</small><b>{{ stats.bots.toLocaleString() }}</b></div>
        </section>

        <section class="card wide"><h2>Traffic</h2><LineChart :data="series" /></section>

        <section class="grid">
            <div class="card"><h2>By hour of day</h2><ColumnChart :items="hours" /></div>
            <div class="card"><h2>Top pages</h2><BarList :items="pages" /></div>
            <div class="card"><h2>Devices</h2><BarList :items="devices" color="var(--c2)" /></div>
            <div class="card"><h2>Browsers</h2><BarList :items="browsers" color="var(--c2)" /></div>
            <div class="card"><h2>Operating systems</h2><BarList :items="systems" color="var(--c2)" /></div>
            <div class="card"><h2>Languages</h2><BarList :items="locales" /></div>
            <div class="card"><h2>Referrers</h2><BarList :items="referrers" /></div>
        </section>

        <section class="card wide">
            <h2>Visitors by IP <small>top 50</small></h2>
            <div class="scroll">
                <table>
                    <thead><tr><th>IP address</th><th>Hits</th><th>Device</th><th>Browser / OS</th><th>First seen</th><th>Last seen</th></tr></thead>
                    <tbody>
                        <tr v-for="v in ips" :key="v.ip">
                            <td><a href="#" @click.prevent="ipSearch = v.ip; apply({ ip: v.ip })">{{ v.ip }}</a></td>
                            <td>{{ v.hits }}</td>
                            <td>{{ v.device }}</td>
                            <td>{{ v.browser }} / {{ v.os }}</td>
                            <td>{{ fmt(v.first_seen) }}</td>
                            <td>{{ fmt(v.last_seen) }}</td>
                        </tr>
                        <tr v-if="!ips.length"><td colspan="6" class="empty">No visits recorded in this range.</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="card wide">
            <h2>Latest activity</h2>
            <div class="scroll">
                <table>
                    <thead><tr><th>Time</th><th>IP</th><th>Page</th><th>Browser / OS</th><th>Referrer</th></tr></thead>
                    <tbody>
                        <tr v-for="v in recent" :key="v.id">
                            <td>{{ fmt(v.visited_at) }}</td>
                            <td>{{ v.ip }} <span v-if="v.is_bot" class="tag">bot</span></td>
                            <td>{{ v.path }}</td>
                            <td>{{ v.browser }} / {{ v.os }}</td>
                            <td class="ref">{{ v.referrer || '—' }}</td>
                        </tr>
                        <tr v-if="!recent.length"><td colspan="5" class="empty">Nothing yet.</td></tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<style scoped>
.admin { --bg: #0b0d12; --card: #141821; --border: #232a38; --grid: #232a38; --text: #e6e9ef; --muted: #8b93a5; --c1: #6aa2ff; --c2: #4cd4a0; min-height: 100vh; background: var(--bg); color: var(--text); padding: 24px 16px 48px; font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; display: grid; gap: 16px; }
@media (prefers-color-scheme: light) { .admin { --bg: #f5f6f9; --card: #fff; --border: #e3e6ee; --grid: #e8ebf2; --text: #161a23; --muted: #667085; --c1: #2f6df0; --c2: #0e9f6e; } }
header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; }
h1 { margin: 0; font-size: 22px; }
h2 { margin: 0 0 12px; font-size: 14px; font-weight: 600; }
h2 small { color: var(--muted); font-weight: 400; margin-left: 6px; }
.controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.seg { display: flex; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.seg button { background: var(--card); color: var(--muted); border: 0; padding: 7px 12px; cursor: pointer; font-size: 13px; }
.seg button.on { background: var(--c1); color: #fff; }
input[placeholder] { background: var(--card); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 7px 10px; font-size: 13px; width: 150px; }
.check { font-size: 13px; color: var(--muted); display: flex; gap: 6px; align-items: center; }
.ghost { background: none; border: 1px solid var(--border); color: var(--muted); border-radius: 8px; padding: 7px 12px; cursor: pointer; font-size: 13px; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; min-width: 0; }
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
.kpis small { color: var(--muted); font-size: 12px; display: block; }
.kpis b { font-size: 26px; font-variant-numeric: tabular-nums; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { text-align: left; color: var(--muted); font-weight: 500; padding: 6px 10px; border-bottom: 1px solid var(--border); white-space: nowrap; }
td { padding: 8px 10px; border-bottom: 1px solid var(--border); white-space: nowrap; font-variant-numeric: tabular-nums; }
td a { color: var(--c1); text-decoration: none; }
.ref { max-width: 260px; overflow: hidden; text-overflow: ellipsis; }
.empty { color: var(--muted); text-align: center; }
.tag { background: var(--grid); color: var(--muted); border-radius: 4px; padding: 1px 6px; font-size: 11px; margin-left: 4px; }
</style>

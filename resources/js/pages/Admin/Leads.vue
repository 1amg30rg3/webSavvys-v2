<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';

import Icon from '@/components/admin/Icon.vue';
import { useAdminTheme } from '@/composables/useAdminTheme';
import { ago, fmt, type Paginated } from '@/lib/admin';

type Status = 'new' | 'contacted';
type Lead = {
    id: number;
    name: string;
    phone: string;
    website_type: string | null;
    message: string | null;
    locale: string | null;
    status: Status;
    created_at: string;
};

const props = defineProps<{
    status: '' | Status;
    counts: { all: number; new: number; contacted: number };
    leads: Paginated<Lead>;
    typeLabels: Record<string, string>;
}>();

const { theme, toggle: toggleTheme } = useAdminTheme();
const busy = ref<number | null>(null);

const filters = [
    { value: '', label: 'All', count: 'all' },
    { value: 'new', label: 'New', count: 'new' },
    { value: 'contacted', label: 'Contacted', count: 'contacted' },
] as const;

const dial = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`;

// wa.me needs the country code: local Georgian mobiles (9 digits, starting with 5) get 995.
const whatsapp = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    return `https://wa.me/${digits.length === 9 && digits.startsWith('5') ? `995${digits}` : digits}`;
};

const typeLabel = (lead: Lead) => (lead.website_type ? (props.typeLabels[lead.website_type] ?? lead.website_type) : 'Not sure yet');

const show = (status: string, page = 1) =>
    router.get('/admin/leads', { ...(status ? { status } : {}), ...(page > 1 ? { page } : {}) }, { preserveScroll: page === 1 });

const setStatus = (lead: Lead, status: Status) => {
    busy.value = lead.id;
    router.patch(`/admin/leads/${lead.id}`, { status }, { preserveScroll: true, onFinish: () => (busy.value = null) });
};

const remove = (lead: Lead) => {
    if (!window.confirm(`Delete the request from ${lead.name}? This cannot be undone.`)) return;

    busy.value = lead.id;
    router.delete(`/admin/leads/${lead.id}`, { preserveScroll: true, onFinish: () => (busy.value = null) });
};

const logout = () => router.post('/admin/logout');
</script>

<template>
    <Head title="Requests"><meta name="robots" content="noindex, nofollow" /></Head>
    <div class="admin">
        <header class="topbar">
            <div class="brand">
                <span class="mark"><b>Web</b>Savvys</span>
                <span class="eyebrow">Admin</span>
            </div>
            <div class="head-actions">
                <Link class="btn" href="/admin"><Icon name="users" :size="15" /><span class="lbl">Visitors</span></Link>
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
            <h1>Requests</h1>
            <p class="desc">People who filled in the contact form on the website. Check for new ones and reach out.</p>
        </div>

        <div class="seg" role="radiogroup" aria-label="Filter by status">
            <button
                v-for="f in filters"
                :key="f.value"
                role="radio"
                :aria-checked="status === f.value"
                :class="{ on: status === f.value }"
                @click="show(f.value)"
            >
                {{ f.label }}<span class="count">{{ counts[f.count] }}</span>
            </button>
        </div>

        <div v-if="!leads.data.length" class="panel empty">
            <Icon name="inbox" :size="28" />
            <strong>{{ status ? 'No requests with this status' : 'No requests yet' }}</strong>
            <p class="muted">New requests from the website's contact form will appear here.</p>
        </div>

        <div v-else class="list">
            <article
                v-for="lead in leads.data"
                :key="lead.id"
                class="panel lead"
                :class="{ dim: busy === lead.id, done: lead.status === 'contacted' }"
            >
                <header class="lead-head">
                    <div>
                        <h2>{{ lead.name }}</h2>
                        <p class="muted small">
                            {{ ago(lead.created_at) }} · {{ fmt(lead.created_at) }} · {{ lead.locale === 'ka' ? 'Georgian' : 'English' }} page
                        </p>
                    </div>
                    <span class="badge" :class="lead.status">{{ lead.status === 'new' ? 'New' : 'Contacted' }}</span>
                </header>

                <div class="lead-meta">
                    <a class="pill" :href="dial(lead.phone)"><Icon name="phone" :size="14" />{{ lead.phone }}</a>
                    <a class="pill" :href="whatsapp(lead.phone)" target="_blank" rel="noopener"><Icon name="message-circle" :size="14" />WhatsApp</a>
                    <span class="pill plain"><Icon name="file" :size="14" />{{ typeLabel(lead) }}</span>
                </div>

                <p v-if="lead.message" class="lead-message">{{ lead.message }}</p>

                <footer class="lead-actions">
                    <button v-if="lead.status === 'new'" class="btn primary" @click="setStatus(lead, 'contacted')">
                        <Icon name="check" :size="15" />Mark as contacted
                    </button>
                    <button v-else class="btn" @click="setStatus(lead, 'new')">Move back to new</button>
                    <button class="btn danger" @click="remove(lead)"><Icon name="trash" :size="15" />Delete</button>
                </footer>
            </article>
        </div>

        <footer v-if="leads.last_page > 1" class="pager">
            <span class="muted">{{ leads.from }}–{{ leads.to }} of {{ leads.total.toLocaleString() }}</span>
            <div class="pages">
                <button
                    class="btn icon-only"
                    :disabled="leads.current_page <= 1"
                    aria-label="Previous page"
                    @click="show(status, leads.current_page - 1)"
                >
                    <Icon name="chevron-left" :size="14" />
                </button>
                <span class="muted">Page {{ leads.current_page }} of {{ leads.last_page }}</span>
                <button
                    class="btn icon-only"
                    :disabled="leads.current_page >= leads.last_page"
                    aria-label="Next page"
                    @click="show(status, leads.current_page + 1)"
                >
                    <Icon name="chevron-right" :size="14" />
                </button>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.admin {
    --card: var(--surface);
    --hover: color-mix(in srgb, var(--text) 5%, transparent);
    --danger: #e5484d;
    --accent-soft: color-mix(in srgb, var(--accent) 14%, transparent);
    --font-heading: 'Space Grotesk', 'Segoe UI', sans-serif;
    position: relative;
    min-height: 100vh;
    color: var(--text);
    font-size: 14px;
    padding: 12px 0 56px;
    width: min(960px, 100% - 2rem);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    align-content: start;
    user-select: text;
}
:root[data-theme='dark'] .admin {
    --danger: #ff7b7b;
}
.admin *:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}
.muted {
    color: var(--muted);
}
.small {
    font-size: 12px;
}
.dim {
    opacity: 0.6;
    pointer-events: none;
    transition: opacity 0.15s;
}

/* Header */
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
.head-actions {
    display: flex;
    gap: 8px;
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
    max-width: 620px;
    line-height: 1.6;
}

/* Buttons */
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
.btn.icon-only {
    width: 40px;
    padding: 0;
    justify-content: center;
}
.btn.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
}
.btn.primary:hover:not(:disabled) {
    background: var(--accent);
    filter: brightness(1.06);
}
.btn.danger {
    color: var(--danger);
}
.btn.danger:hover:not(:disabled) {
    border-color: var(--danger);
}

/* Status filter */
.seg {
    display: inline-flex;
    justify-self: start;
    padding: 4px;
    gap: 2px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 999px;
}
.seg button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
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
.seg button.on {
    background: var(--accent);
    color: #fff;
}
.count {
    background: var(--hover);
    border-radius: 999px;
    padding: 0 7px;
    font-size: 11px;
    font-weight: 600;
    line-height: 18px;
}
.seg button.on .count {
    background: rgb(255 255 255 / 0.25);
}

/* Requests */
.panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 22px;
    min-width: 0;
    box-shadow: 0 4px 20px rgb(0 0 0 / 0.03);
}
.list {
    display: grid;
    gap: 14px;
}
.lead {
    display: grid;
    gap: 14px;
    border-left: 4px solid var(--accent);
}
.lead.done {
    border-left-color: var(--accent-2);
}
.lead-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
}
.lead-head h2 {
    margin: 0 0 4px;
    font-family: var(--font-heading);
    font-size: 19px;
    letter-spacing: -0.01em;
    text-transform: none;
}
.lead-head p {
    margin: 0;
}
.badge {
    flex-shrink: 0;
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 11px;
    font-weight: 600;
    line-height: 18px;
}
.badge.new {
    background: var(--accent-soft);
    color: var(--accent);
}
.badge.contacted {
    background: color-mix(in srgb, var(--accent-2) 16%, transparent);
    color: var(--accent-2);
}
.lead-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    transition: border-color 0.2s;
}
a.pill:hover {
    border-color: var(--accent);
}
.pill.plain {
    background: var(--hover);
    border-color: transparent;
    color: var(--muted);
}
.lead-message {
    margin: 0;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--hover);
    line-height: 1.6;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
.lead-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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
}
.empty p {
    margin: 0;
}
.pager {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    font-size: 13px;
}
.pages {
    display: flex;
    align-items: center;
    gap: 10px;
}

@media (max-width: 560px) {
    .btn .lbl {
        display: none;
    }
    .head-actions .btn {
        padding: 0 10px;
    }
}
</style>

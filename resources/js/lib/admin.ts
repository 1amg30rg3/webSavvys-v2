export type Item = { label: string; value: number };
export type Filters = {
    range: number;
    from: string;
    to: string;
    custom: boolean;
    bots: boolean;
    q: string;
    ip: string;
    device: string;
    browser: string;
    os: string;
    locale: string;
    path: string;
    referrer: string;
};
export type Paginated<T> = { data: T[]; current_page: number; last_page: number; total: number; from: number | null; to: number | null };
export type IpRow = {
    ip: string;
    hits: number;
    pages: number;
    first_seen: string;
    last_seen: string;
    device: string;
    browser: string;
    os: string;
    locale: string | null;
    is_bot: number;
};
export type Hit = {
    id: number;
    ip: string;
    path: string;
    device: string;
    browser: string;
    os: string;
    referrer: string | null;
    is_bot: boolean;
    visited_at: string;
};
export type VisitorHit = Omit<Hit, 'ip'> & { locale: string | null };
export type Visitor = {
    ip: string;
    total: number;
    first_seen: string;
    last_seen: string;
    visits: VisitorHit[];
    pages: Item[];
};

export const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

/** The API returns UTC either as ISO strings or as naive `Y-m-d H:i:s` strings. */
export const toDate = (s: string) => new Date(s.includes('T') ? s : s.replace(' ', 'T') + 'Z');

export const fmt = (s: string) => toDate(s).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const fmtTime = (s: string) => toDate(s).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export function ago(s: string) {
    const sec = Math.max(0, (Date.now() - toDate(s).getTime()) / 1000);
    if (sec < 60) return 'just now';
    if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} h ago`;
    return `${Math.floor(sec / 86400)} d ago`;
}

export const isActive = (s: string) => Date.now() - toDate(s).getTime() < ACTIVE_WINDOW_MS;

export function host(r: string | null) {
    if (!r) return 'Direct';
    try {
        return new URL(r).host;
    } catch {
        return r;
    }
}

export const deviceIcon = (d: string) => (d === 'mobile' ? 'smartphone' : d === 'tablet' ? 'tablet' : 'monitor');

export function dayLabel(s: string) {
    const d = toDate(s);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export async function copyText(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return ok;
    }
}

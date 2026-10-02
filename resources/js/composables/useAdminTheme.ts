import { onMounted, ref, watch } from 'vue';

type Theme = 'light' | 'dark';

/** Shares the public site's theme (`ws-theme` in localStorage / `data-theme` on <html>). */
export function useAdminTheme() {
    const theme = ref<Theme>('light');

    onMounted(() => {
        const stored = localStorage.getItem('ws-theme') as Theme | null;
        theme.value = stored ?? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.dataset.theme = theme.value;
    });

    watch(theme, (value) => {
        document.documentElement.dataset.theme = value;
        localStorage.setItem('ws-theme', value);
    });

    const toggle = () => (theme.value = theme.value === 'light' ? 'dark' : 'light');

    return { theme, toggle };
}

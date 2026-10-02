<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';

import Icon from '@/components/admin/Icon.vue';
import { useAdminTheme } from '@/composables/useAdminTheme';

defineProps<{ configured: boolean }>();

const { theme, toggle } = useAdminTheme();
const form = useForm({ password: '' });
const submit = () => form.post('/admin/login');
</script>

<template>
    <Head title="Admin login"><meta name="robots" content="noindex, nofollow" /></Head>
    <div class="login">
        <button class="theme" :title="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'" aria-label="Toggle theme" @click="toggle">
            <Icon :name="theme === 'dark' ? 'sun' : 'moon'" :size="16" />
        </button>
        <form class="card" @submit.prevent="submit">
            <div class="brand">
                <span class="mark"><b>Web</b>Savvys</span><span class="eyebrow">Admin</span>
            </div>
            <h1>Sign in</h1>
            <p class="desc">Enter the admin password to view visitor analytics.</p>
            <p v-if="!configured" class="err">Set ADMIN_PASSWORD in .env to enable login.</p>
            <input v-model="form.password" type="password" placeholder="Password" aria-label="Password" autocomplete="current-password" autofocus />
            <p v-if="form.errors.password" class="err">{{ form.errors.password }}</p>
            <button class="submit" :disabled="form.processing">Sign in</button>
        </form>
    </div>
</template>

<style scoped>
.login {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 16px;
    position: relative;
    user-select: text;
}
.theme {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
}
.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 32px;
    width: 100%;
    max-width: 380px;
    display: grid;
    gap: 14px;
    box-shadow: var(--shadow);
}
.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}
.mark {
    font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
    font-weight: 700;
    font-size: 18px;
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
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
    padding: 3px 10px;
}
h1 {
    margin: 8px 0 0;
    font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
    font-size: 30px;
    letter-spacing: -0.02em;
}
.desc {
    margin: 0 0 6px;
    color: var(--muted);
    line-height: 1.6;
    font-size: 14px;
}
input {
    height: 44px;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 999px;
    padding: 0 18px;
    font: inherit;
    font-size: 14px;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
}
input:focus {
    outline: 0;
    border-color: var(--accent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 14%, transparent);
}
.submit {
    height: 44px;
    background: var(--accent);
    color: #fff;
    border: 0;
    border-radius: 999px;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    transition:
        transform 0.2s,
        filter 0.2s;
}
.submit:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.06);
}
.submit:disabled {
    opacity: 0.6;
}
.err {
    color: #e5484d;
    margin: 0;
    font-size: 13px;
}
</style>

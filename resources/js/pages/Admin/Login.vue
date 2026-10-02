<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';

defineProps<{ configured: boolean }>();

const form = useForm({ password: '' });
const submit = () => form.post('/admin/login');
</script>

<template>
    <Head title="Admin login"><meta name="robots" content="noindex, nofollow" /></Head>
    <div class="admin login">
        <form class="card" @submit.prevent="submit">
            <h1>Admin</h1>
            <p v-if="!configured" class="err">Set ADMIN_PASSWORD in .env to enable login.</p>
            <input v-model="form.password" type="password" placeholder="Password" autocomplete="current-password" autofocus />
            <p v-if="form.errors.password" class="err">{{ form.errors.password }}</p>
            <button :disabled="form.processing">Sign in</button>
        </form>
    </div>
</template>

<style scoped>
.admin { --bg: #0b0d12; --card: #141821; --border: #232a38; --text: #e6e9ef; --muted: #8b93a5; --c1: #6aa2ff; min-height: 100vh; background: var(--bg); color: var(--text); display: grid; place-items: center; padding: 16px; font-family: system-ui, sans-serif; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 28px; width: 100%; max-width: 340px; display: grid; gap: 12px; }
h1 { margin: 0; font-size: 20px; }
input { background: var(--bg); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 10px 12px; font-size: 14px; }
button { background: var(--c1); color: #08101f; border: 0; border-radius: 8px; padding: 10px; font-weight: 600; cursor: pointer; }
button:disabled { opacity: 0.6; }
.err { color: #ff8a8a; margin: 0; font-size: 13px; }
</style>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
    chatUrl: string;
}>();

const { t, tm, locale } = useI18n();

const websiteTypes = computed(() => (tm('pricing.types') as Array<{ key: string; name: string }>) ?? []);

// `lead_ref` is a honeypot: it is hidden from people, so only bots fill it.
const emptyForm = () => ({ name: '', phone: '', website_type: '', message: '', lead_ref: '' });
const form = reactive(emptyForm());

const sending = ref(false);
const sent = ref(false);
const sentName = ref('');
const invalid = ref<string[]>([]);
const failure = ref<'generic' | 'throttled' | null>(null);

const xsrfToken = () => decodeURIComponent(document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)?.[1] ?? '');

const post = () =>
    fetch('/leads', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': xsrfToken() },
        body: JSON.stringify({ ...form, locale: locale.value }),
    });

const submit = async () => {
    if (sending.value) return;

    sending.value = true;
    invalid.value = [];
    failure.value = null;

    try {
        let response = await post();

        // 419: the CSRF token expired. A GET renews it, then retry once.
        if (response.status === 419) {
            await fetch(window.location.href, { credentials: 'same-origin' });
            response = await post();
        }

        if (response.status === 422) {
            const { errors } = (await response.json()) as { errors?: Record<string, unknown> };
            invalid.value = Object.keys(errors ?? {});
            failure.value = invalid.value.some((field) => field !== 'name' && field !== 'phone') ? 'generic' : null;
        } else if (!response.ok) {
            failure.value = response.status === 429 ? 'throttled' : 'generic';
        } else {
            sentName.value = form.name.trim();
            Object.assign(form, emptyForm());
            sent.value = true;
        }
    } catch {
        failure.value = 'generic';
    } finally {
        sending.value = false;
    }
};
</script>

<template>
    <div class="contact-form-card" data-animate="fade-up" data-delay="200">
        <div v-if="sent" class="contact-form-success" role="status">
            <span class="contact-form-success-icon"><font-awesome-icon :icon="['fas', 'check']" /></span>
            <h3>{{ t('contact.form.successTitle', { name: sentName }) }}</h3>
            <p>{{ t('contact.form.successText') }}</p>
            <button class="contact-form-link" type="button" @click="sent = false">{{ t('contact.form.again') }}</button>
        </div>

        <form v-else class="contact-form" @submit.prevent="submit">
            <h3 class="contact-form-title">{{ t('contact.form.title') }}</h3>
            <p class="contact-form-text">{{ t('contact.form.text') }}</p>

            <div class="contact-form-row">
                <label class="contact-field" :class="{ 'has-error': invalid.includes('name') }">
                    <span>{{ t('contact.form.name') }}</span>
                    <input
                        v-model="form.name"
                        type="text"
                        name="name"
                        autocomplete="name"
                        minlength="2"
                        maxlength="100"
                        :aria-invalid="invalid.includes('name')"
                        required
                    />
                    <small v-if="invalid.includes('name')">{{ t('contact.form.errors.name') }}</small>
                </label>
                <label class="contact-field" :class="{ 'has-error': invalid.includes('phone') }">
                    <span>{{ t('contact.form.phone') }}</span>
                    <input
                        v-model="form.phone"
                        type="tel"
                        name="phone"
                        inputmode="tel"
                        autocomplete="tel"
                        maxlength="32"
                        pattern="\+?[0-9\s\(\)\.\-]{6,}"
                        :title="t('contact.form.phoneHint')"
                        :aria-invalid="invalid.includes('phone')"
                        required
                    />
                    <small v-if="invalid.includes('phone')">{{ t('contact.form.errors.phone') }}</small>
                </label>
            </div>

            <label class="contact-field">
                <span>{{ t('contact.form.type') }}</span>
                <select v-model="form.website_type" name="website_type">
                    <option value="">{{ t('contact.form.typeUnsure') }}</option>
                    <option v-for="type in websiteTypes" :key="type.key" :value="type.key">{{ type.name }}</option>
                </select>
            </label>

            <label class="contact-field">
                <span>
                    {{ t('contact.form.message') }}
                    <em>{{ t('contact.form.optional') }}</em>
                </span>
                <textarea
                    v-model="form.message"
                    name="message"
                    rows="3"
                    maxlength="2000"
                    :placeholder="t('contact.form.messagePlaceholder')"
                ></textarea>
            </label>

            <div class="contact-form-trap" aria-hidden="true">
                <input v-model="form.lead_ref" type="text" name="lead_ref" tabindex="-1" autocomplete="off" />
            </div>

            <p v-if="failure" class="contact-form-failure" role="alert">
                {{ t(`contact.form.errors.${failure}`) }}
                <a :href="chatUrl" target="_blank" rel="noopener">{{ t('contact.form.errors.whatsapp') }}</a>
            </p>

            <button class="primary-button primary-button-large contact-form-submit" type="submit" :disabled="sending">
                {{ sending ? t('contact.form.sending') : t('contact.form.submit') }}
                <font-awesome-icon :icon="['fas', 'paper-plane']" />
            </button>
            <p class="contact-form-note">{{ t('contact.form.consent') }}</p>
        </form>
    </div>
</template>

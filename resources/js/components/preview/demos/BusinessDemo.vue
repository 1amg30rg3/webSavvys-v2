<script setup lang="ts">
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { computed, nextTick, ref } from 'vue';
import { previewContent, type BusinessPage, type PreviewLocale } from '../content';

const props = defineProps<{
    locale: PreviewLocale;
}>();

const c = computed(() => previewContent[props.locale].business);
const pages: BusinessPage[] = ['home', 'services', 'about', 'contact'];

const scrollRef = ref<HTMLElement | null>(null);
const page = ref<BusinessPage>('home');
const menuOpen = ref(false);

const name = ref('');
const phone = ref('');
const message = ref('');
const sent = ref(false);

const go = async (target: BusinessPage) => {
    page.value = target;
    menuOpen.value = false;
    await nextTick();
    scrollRef.value?.scrollTo({ top: 0 });
};

// "Dr. Nino K." -> "N": the first letter of the given name.
const initial = (fullName: string) => fullName.split(' ')[1]?.[0] ?? fullName[0];
</script>

<template>
    <div class="demo bz">
        <div class="bz-scroll" ref="scrollRef">
            <header class="bz-top">
                <button class="bz-logo" type="button" @click="go('home')"><i></i>{{ c.brand }}</button>

                <nav class="bz-nav" :class="{ 'is-open': menuOpen }">
                    <button
                        v-for="key in pages"
                        :key="key"
                        type="button"
                        :class="{ 'is-active': page === key }"
                        :aria-current="page === key ? 'page' : undefined"
                        @click="go(key)"
                    >
                        {{ c.nav[key] }}
                    </button>
                </nav>

                <span class="bz-phone"><font-awesome-icon :icon="faPhone" />{{ c.phone }}</span>

                <button class="bz-burger" type="button" :aria-expanded="menuOpen" :aria-label="c.menuLabel" @click="menuOpen = !menuOpen">
                    <font-awesome-icon :icon="menuOpen ? faXmark : faBars" />
                </button>
            </header>

            <!-- Home -->
            <div v-if="page === 'home'" class="bz-page">
                <div class="bz-hero">
                    <div>
                        <span class="bz-badge">{{ c.home.badge }}</span>
                        <h1>{{ c.home.title }}</h1>
                        <p>{{ c.home.subtitle }}</p>
                        <div class="bz-actions">
                            <button class="bz-btn" type="button" @click="go('contact')">{{ c.home.cta }}</button>
                            <button class="bz-btn bz-btn--ghost" type="button" @click="go('services')">{{ c.home.secondary }}</button>
                        </div>
                    </div>
                    <div class="bz-visual">
                        <div class="bz-visual-card">
                            <span>{{ c.home.cardLabel }}</span>
                            <strong>{{ c.home.cardValue }}</strong>
                            <button class="bz-btn bz-btn--sm" type="button" @click="go('contact')">{{ c.home.cardCta }}</button>
                        </div>
                    </div>
                </div>

                <ul class="bz-highlights">
                    <li v-for="item in c.home.highlights" :key="item.title">
                        <span class="bz-tick"><font-awesome-icon :icon="faCheck" /></span>
                        <div>
                            <h3>{{ item.title }}</h3>
                            <p>{{ item.text }}</p>
                        </div>
                    </li>
                </ul>

                <div class="bz-head">
                    <h2>{{ c.home.servicesTitle }}</h2>
                    <button class="bz-more" type="button" @click="go('services')">
                        {{ c.home.allServices }}
                        <font-awesome-icon :icon="faArrowRight" />
                    </button>
                </div>
                <ul class="bz-cards">
                    <li v-for="item in c.services.items.slice(0, 3)" :key="item.name">
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.text }}</p>
                        <strong>{{ item.price }}</strong>
                    </li>
                </ul>
            </div>

            <!-- Services -->
            <div v-else-if="page === 'services'" class="bz-page">
                <div class="bz-intro">
                    <h1>{{ c.services.title }}</h1>
                    <p>{{ c.services.subtitle }}</p>
                </div>
                <ul class="bz-cards">
                    <li v-for="item in c.services.items" :key="item.name">
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.text }}</p>
                        <strong>{{ item.price }}</strong>
                    </li>
                </ul>
                <div class="bz-cta-band">
                    <button class="bz-btn" type="button" @click="go('contact')">{{ c.home.cta }}</button>
                </div>
            </div>

            <!-- About -->
            <div v-else-if="page === 'about'" class="bz-page">
                <div class="bz-intro">
                    <h1>{{ c.about.title }}</h1>
                    <p>{{ c.about.text }}</p>
                </div>
                <ul class="bz-stats">
                    <li v-for="stat in c.about.stats" :key="stat.label">
                        <strong>{{ stat.value }}</strong>
                        <span>{{ stat.label }}</span>
                    </li>
                </ul>
                <div class="bz-head">
                    <h2>{{ c.about.teamTitle }}</h2>
                </div>
                <ul class="bz-team">
                    <li v-for="member in c.about.team" :key="member.name">
                        <span class="bz-avatar">{{ initial(member.name) }}</span>
                        <h3>{{ member.name }}</h3>
                        <p>{{ member.role }}</p>
                    </li>
                </ul>
            </div>

            <!-- Contact -->
            <div v-else class="bz-page">
                <div class="bz-intro">
                    <h1>{{ c.contact.title }}</h1>
                    <p>{{ c.contact.subtitle }}</p>
                </div>
                <div class="bz-contact">
                    <div class="bz-contact-info">
                        <ul>
                            <li>
                                <span class="bz-tick"><font-awesome-icon :icon="faLocationDot" /></span>
                                <div>
                                    <h3>{{ c.contact.addressLabel }}</h3>
                                    <p>{{ c.contact.address }}</p>
                                </div>
                            </li>
                            <li>
                                <span class="bz-tick"><font-awesome-icon :icon="faClock" /></span>
                                <div>
                                    <h3>{{ c.contact.hoursLabel }}</h3>
                                    <p>{{ c.contact.hours }}</p>
                                </div>
                            </li>
                            <li>
                                <span class="bz-tick"><font-awesome-icon :icon="faPhone" /></span>
                                <div>
                                    <h3>{{ c.contact.phoneLabel }}</h3>
                                    <p>{{ c.phone }}</p>
                                </div>
                            </li>
                        </ul>
                        <div class="bz-map" aria-hidden="true">
                            <span class="bz-pin"><font-awesome-icon :icon="faLocationDot" /></span>
                        </div>
                    </div>

                    <div v-if="sent" class="bz-form bz-form--done" role="status">
                        <span class="bz-done-icon"><font-awesome-icon :icon="faCheck" /></span>
                        <h2>{{ c.contact.successTitle }}</h2>
                        <p>{{ c.contact.successText.replace('{name}', name.trim()) }}</p>
                    </div>
                    <form v-else class="bz-form" @submit.prevent="sent = true">
                        <h2>{{ c.contact.formTitle }}</h2>
                        <label>
                            <span>{{ c.contact.nameLabel }}</span>
                            <input v-model="name" type="text" autocomplete="off" required />
                        </label>
                        <label>
                            <span>{{ c.contact.phoneFieldLabel }}</span>
                            <input v-model="phone" type="tel" inputmode="tel" autocomplete="off" required />
                        </label>
                        <label>
                            <span>{{ c.contact.messageLabel }}</span>
                            <textarea v-model="message" rows="3"></textarea>
                        </label>
                        <button class="bz-btn" type="submit">{{ c.contact.submit }}</button>
                    </form>
                </div>
            </div>

            <footer class="bz-foot">{{ c.footer }}</footer>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bz {
    --d-ink: #10283a;
    --d-muted: #5d6f7c;
    --d-bg: #ffffff;
    --d-soft: #eef7f7;
    --d-line: #dde8eb;
    --d-accent: #0e8f8a;
    --d-accent-dark: #0a6f6b;
    --d-pad: 30px;

    background: var(--d-bg);
    color: var(--d-ink);
}

.bz-scroll {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.bz-top {
    position: sticky;
    top: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 12px var(--d-pad);
    background: rgba(255, 255, 255, 0.92);
    border-bottom: 1px solid var(--d-line);
    backdrop-filter: blur(10px);
}

.bz-logo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 18px;
    font-weight: 700;
    white-space: nowrap;

    i {
        width: 14px;
        height: 14px;
        border-radius: 5px 5px 50% 50%;
        background: var(--d-accent);
    }
}

.bz-nav {
    display: flex;
    gap: 4px;
    margin-left: auto;

    button {
        padding: 8px 12px;
        border-radius: 999px;
        color: var(--d-muted);
        font-weight: 600;
        white-space: nowrap;
        transition:
            color 0.2s ease,
            background 0.2s ease;

        &:hover {
            color: var(--d-ink);
        }

        &.is-active {
            background: var(--d-soft);
            color: var(--d-accent-dark);
        }
    }
}

.bz-phone {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--d-accent-dark);
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
}

.bz-burger {
    display: none;
    width: 38px;
    height: 38px;
    margin-left: auto;
    border: 1px solid var(--d-line);
    border-radius: 12px;
    font-size: 16px;
}

.bz-page {
    flex: 1;
    padding: 0 var(--d-pad) 12px;
    animation: bzIn 0.35s ease;
}

@keyframes bzIn {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
}

.bz-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 22px;
    border-radius: 12px;
    background: var(--d-accent);
    color: #fff;
    font-weight: 700;
    transition:
        background 0.2s ease,
        transform 0.2s ease;

    &:hover {
        background: var(--d-accent-dark);
        transform: translateY(-1px);
    }

    &--ghost {
        background: transparent;
        box-shadow: inset 0 0 0 1px var(--d-line);
        color: var(--d-ink);

        &:hover {
            background: var(--d-soft);
        }
    }

    &--sm {
        padding: 8px 14px;
        font-size: 13px;
    }
}

.bz-hero {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
    gap: 32px;
    padding: 40px 0 34px;

    h1 {
        margin: 14px 0 12px;
        font-size: clamp(27px, 5cqi, 42px);
    }

    p {
        max-width: 440px;
        margin-bottom: 22px;
        color: var(--d-muted);
        font-size: 15px;
    }
}

.bz-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--d-soft);
    color: var(--d-accent-dark);
    font-size: 12px;
    font-weight: 700;
}

.bz-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.bz-visual {
    position: relative;
    display: grid;
    place-items: end start;
    min-height: 230px;
    padding: 18px;
    border-radius: 26px;
    background:
        radial-gradient(160px circle at 78% 26%, rgba(255, 255, 255, 0.55), transparent 70%),
        radial-gradient(260px circle at 20% 90%, rgba(255, 255, 255, 0.25), transparent 70%), linear-gradient(140deg, #7fd3cf, var(--d-accent));
}

.bz-visual-card {
    display: grid;
    gap: 4px;
    justify-items: start;
    padding: 16px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 18px 40px rgba(16, 40, 58, 0.22);

    span {
        color: var(--d-muted);
        font-size: 12px;
    }

    strong {
        margin-bottom: 8px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 19px;
    }
}

.bz-highlights {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    padding: 22px;
    border-radius: 20px;
    background: var(--d-soft);

    li {
        display: flex;
        gap: 12px;
    }

    h3 {
        font-size: 15px;
    }

    p {
        color: var(--d-muted);
        font-size: 13px;
    }
}

.bz-tick {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: var(--d-accent);
    color: #fff;
    font-size: 12px;
}

.bz-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 34px 0 14px;

    h2 {
        font-size: 22px;
    }
}

.bz-more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--d-accent-dark);
    font-weight: 700;
}

.bz-cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;

    li {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 20px;
        border: 1px solid var(--d-line);
        border-radius: 18px;
        transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;

        &:hover {
            border-color: var(--d-accent);
            box-shadow: 0 12px 28px rgba(16, 40, 58, 0.08);
        }
    }

    h3 {
        font-size: 16px;
    }

    p {
        flex: 1;
        color: var(--d-muted);
        font-size: 13px;
    }

    strong {
        margin-top: 6px;
        color: var(--d-accent-dark);
    }
}

.bz-intro {
    padding: 36px 0 22px;

    h1 {
        margin-bottom: 10px;
        font-size: clamp(26px, 4.6cqi, 38px);
    }

    p {
        max-width: 600px;
        color: var(--d-muted);
        font-size: 15px;
    }
}

.bz-cta-band {
    display: grid;
    place-items: center;
    margin-top: 22px;
    padding: 24px;
    border-radius: 20px;
    background: var(--d-soft);
}

.bz-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;

    li {
        display: grid;
        gap: 2px;
        padding: 20px;
        border-radius: 18px;
        background: var(--d-soft);
    }

    strong {
        color: var(--d-accent-dark);
        font-family: 'Space Grotesk', sans-serif;
        font-size: 28px;
    }

    span {
        color: var(--d-muted);
        font-size: 13px;
    }
}

.bz-team {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;

    li {
        display: grid;
        gap: 4px;
        justify-items: center;
        padding: 22px 16px;
        border: 1px solid var(--d-line);
        border-radius: 18px;
        text-align: center;
    }

    h3 {
        margin-top: 8px;
        font-size: 15px;
    }

    p {
        color: var(--d-muted);
        font-size: 13px;
    }
}

.bz-avatar {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: linear-gradient(140deg, #7fd3cf, var(--d-accent));
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
}

.bz-contact {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.bz-contact-info {
    display: grid;
    gap: 16px;
    align-content: start;

    ul {
        display: grid;
        gap: 14px;
    }

    li {
        display: flex;
        gap: 12px;
    }

    h3 {
        font-size: 14px;
    }

    p {
        color: var(--d-muted);
        font-size: 13px;
    }
}

.bz-map {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 130px;
    border-radius: 18px;
    background:
        linear-gradient(115deg, transparent 46%, #fff 46%, #fff 52%, transparent 52%),
        linear-gradient(25deg, transparent 58%, #fff 58%, #fff 63%, transparent 63%),
        linear-gradient(var(--d-line) 1px, transparent 1px) 0 0 / 26px 26px,
        linear-gradient(90deg, var(--d-line) 1px, transparent 1px) 0 0 / 26px 26px,
        var(--d-soft);
}

.bz-pin {
    color: var(--d-accent);
    font-size: 30px;
    filter: drop-shadow(0 6px 6px rgba(16, 40, 58, 0.25));
    animation: bzPin 1.8s ease-in-out infinite;
}

@keyframes bzPin {
    50% {
        transform: translateY(-6px);
    }
}

.bz-form {
    display: grid;
    align-content: start;
    gap: 12px;
    padding: 22px;
    border: 1px solid var(--d-line);
    border-radius: 20px;
    box-shadow: 0 16px 36px rgba(16, 40, 58, 0.08);

    h2 {
        font-size: 19px;
    }

    label {
        display: grid;
        gap: 5px;
    }

    span {
        color: var(--d-muted);
        font-size: 12px;
        font-weight: 600;
    }

    input,
    textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--d-line);
        border-radius: 12px;
        background: #fff;
        outline: none;
        resize: none;
        transition: border-color 0.2s ease;

        &:focus {
            border-color: var(--d-accent);
        }
    }

    &--done {
        justify-items: center;
        align-content: center;
        text-align: center;

        p {
            color: var(--d-muted);
        }
    }
}

.bz-done-icon {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--d-accent);
    color: #fff;
    font-size: 20px;
}

.bz-foot {
    margin-top: 28px;
    padding: 20px var(--d-pad);
    border-top: 1px solid var(--d-line);
    color: var(--d-muted);
    font-size: 12px;
    text-align: center;
}

@container (max-width: 640px) {
    .bz {
        --d-pad: 18px;
    }

    .bz-phone {
        display: none;
    }

    .bz-burger {
        display: grid;
        place-items: center;
    }

    .bz-nav {
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
        display: none;
        flex-direction: column;
        gap: 2px;
        padding: 10px var(--d-pad) 14px;
        background: #fff;
        border-bottom: 1px solid var(--d-line);
        box-shadow: 0 18px 30px rgba(16, 40, 58, 0.1);

        &.is-open {
            display: flex;
        }

        button {
            padding: 12px 14px;
            border-radius: 12px;
            text-align: left;
        }
    }

    .bz-hero,
    .bz-contact,
    .bz-highlights,
    .bz-cards,
    .bz-team {
        grid-template-columns: 1fr;
    }

    .bz-hero {
        padding-top: 28px;
    }

    .bz-visual {
        min-height: 180px;
    }

    .bz-stats {
        gap: 8px;

        li {
            padding: 14px 12px;
        }

        strong {
            font-size: 22px;
        }
    }
}
</style>

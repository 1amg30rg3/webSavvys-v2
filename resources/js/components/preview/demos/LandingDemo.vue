<script setup lang="ts">
import { faBolt } from '@fortawesome/free-solid-svg-icons/faBolt';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons/faUserGroup';
import { computed, ref } from 'vue';
import { previewContent, type PreviewLocale } from '../content';

const props = defineProps<{
    locale: PreviewLocale;
}>();

const c = computed(() => previewContent[props.locale].landing);
const benefitIcons = [faClock, faUserGroup, faBolt];

const scrollRef = ref<HTMLElement | null>(null);
const formRef = ref<HTMLElement | null>(null);

const name = ref('');
const phone = ref('');
const chosenClass = ref(0);
const sent = ref(false);

const goToForm = () => {
    if (!scrollRef.value || !formRef.value) return;
    scrollRef.value.scrollTo({ top: formRef.value.offsetTop - 80, behavior: 'smooth' });
};

const pickClass = (index: number) => {
    chosenClass.value = index;
    goToForm();
};

const reset = () => {
    sent.value = false;
    name.value = '';
    phone.value = '';
};
</script>

<template>
    <div class="demo ld">
        <div class="ld-scroll" ref="scrollRef">
            <header class="ld-top">
                <span class="ld-logo"><i></i>{{ c.brand }}</span>
                <button class="ld-btn ld-btn--sm" type="button" @click="goToForm">{{ c.navCta }}</button>
            </header>

            <div class="ld-hero">
                <div class="ld-hero-text">
                    <span class="ld-badge">{{ c.badge }}</span>
                    <h1>{{ c.title }}</h1>
                    <p>{{ c.subtitle }}</p>
                    <button class="ld-btn" type="button" @click="goToForm">{{ c.cta }}</button>
                    <ul class="ld-stats">
                        <li v-for="stat in c.stats" :key="stat.label">
                            <strong>{{ stat.value }}</strong>
                            <span>{{ stat.label }}</span>
                        </li>
                    </ul>
                </div>

                <div class="ld-schedule">
                    <p class="ld-schedule-title">{{ c.scheduleTitle }}</p>
                    <button
                        v-for="(slot, index) in c.schedule"
                        :key="slot.time"
                        class="ld-slot"
                        :class="{ 'is-picked': chosenClass === index }"
                        type="button"
                        @click="pickClass(index)"
                    >
                        <span class="ld-slot-time">{{ slot.time }}</span>
                        <span class="ld-slot-name">
                            {{ slot.name }}
                            <small>{{ slot.coach }}</small>
                        </span>
                        <span class="ld-slot-check"><font-awesome-icon :icon="faCheck" /></span>
                    </button>
                </div>
            </div>

            <div class="ld-block">
                <h2>{{ c.benefitsTitle }}</h2>
                <ul class="ld-benefits">
                    <li v-for="(benefit, index) in c.benefits" :key="benefit.title">
                        <span class="ld-benefit-icon"><font-awesome-icon :icon="benefitIcons[index]" /></span>
                        <h3>{{ benefit.title }}</h3>
                        <p>{{ benefit.text }}</p>
                    </li>
                </ul>
            </div>

            <figure class="ld-quote">
                <div class="ld-stars">
                    <font-awesome-icon v-for="n in 5" :key="n" :icon="faStar" />
                </div>
                <blockquote>{{ c.quote }}</blockquote>
                <figcaption>{{ c.quoteAuthor }}</figcaption>
            </figure>

            <div class="ld-signup" ref="formRef">
                <div class="ld-signup-text">
                    <h2>{{ c.formTitle }}</h2>
                    <p>{{ c.formText }}</p>
                </div>

                <div v-if="sent" class="ld-success" role="status">
                    <span class="ld-success-icon"><font-awesome-icon :icon="faCheck" /></span>
                    <h3>{{ c.successTitle.replace('{name}', name.trim()) }}</h3>
                    <p>{{ c.successText }}</p>
                    <button class="ld-link" type="button" @click="reset">{{ c.again }}</button>
                </div>

                <form v-else class="ld-form" @submit.prevent="sent = true">
                    <label>
                        <span>{{ c.nameLabel }}</span>
                        <input v-model="name" type="text" autocomplete="off" required />
                    </label>
                    <label>
                        <span>{{ c.phoneLabel }}</span>
                        <input v-model="phone" type="tel" inputmode="tel" autocomplete="off" required />
                    </label>
                    <label>
                        <span>{{ c.classLabel }}</span>
                        <select v-model="chosenClass">
                            <option v-for="(slot, index) in c.schedule" :key="slot.time" :value="index">{{ slot.time }} · {{ slot.name }}</option>
                        </select>
                    </label>
                    <button class="ld-btn" type="submit">{{ c.submit }}</button>
                </form>
            </div>

            <footer class="ld-foot">{{ c.footer }}</footer>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ld {
    --d-ink: #f4f5fb;
    --d-muted: #a7acc8;
    --d-bg: #0e1120;
    --d-panel: #171b31;
    --d-line: rgba(255, 255, 255, 0.1);
    --d-hot: #ff5a47;
    --d-warm: #ffb347;
    --d-pad: 30px;

    background: var(--d-bg);
    color: var(--d-ink);
}

.ld-scroll {
    position: relative;
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.ld-top {
    position: sticky;
    top: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px var(--d-pad);
    background: rgba(14, 17, 32, 0.82);
    border-bottom: 1px solid var(--d-line);
    backdrop-filter: blur(10px);
}

.ld-logo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 18px;
    font-weight: 700;

    i {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--d-hot), var(--d-warm));
    }
}

.ld-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 13px 24px;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--d-hot), var(--d-warm));
    color: #1a1208;
    font-weight: 700;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 26px rgba(255, 90, 71, 0.35);
    }

    &--sm {
        padding: 8px 16px;
        font-size: 13px;
    }
}

.ld-hero {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    align-items: center;
    gap: 32px;
    padding: 46px var(--d-pad) 40px;
    background:
        radial-gradient(520px circle at 12% 0%, rgba(255, 90, 71, 0.22), transparent 62%),
        radial-gradient(420px circle at 100% 100%, rgba(255, 179, 71, 0.14), transparent 60%);

    h1 {
        margin: 14px 0 12px;
        font-size: clamp(28px, 5.4cqi, 46px);
    }

    p {
        max-width: 460px;
        margin-bottom: 22px;
        color: var(--d-muted);
        font-size: 15px;
    }
}

.ld-badge {
    display: inline-block;
    padding: 6px 12px;
    border: 1px solid rgba(255, 179, 71, 0.4);
    border-radius: 999px;
    color: var(--d-warm);
    font-size: 12px;
    font-weight: 600;
}

.ld-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 14px 28px;
    margin-top: 26px;

    li {
        display: flex;
        flex-direction: column;
    }

    strong {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 22px;
    }

    span {
        color: var(--d-muted);
        font-size: 12px;
    }
}

.ld-schedule {
    display: grid;
    gap: 8px;
    padding: 16px;
    border: 1px solid var(--d-line);
    border-radius: 20px;
    background: var(--d-panel);
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.35);
}

.ld-schedule-title {
    margin-bottom: 4px;
    color: var(--d-muted);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.ld-slot {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px;
    border: 1px solid var(--d-line);
    border-radius: 14px;
    text-align: left;
    transition:
        border-color 0.2s ease,
        background 0.2s ease;

    &:hover {
        border-color: rgba(255, 179, 71, 0.5);
    }

    &.is-picked {
        border-color: var(--d-hot);
        background: rgba(255, 90, 71, 0.12);

        .ld-slot-check {
            opacity: 1;
            transform: scale(1);
        }
    }
}

.ld-slot-time {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 15px;
    font-weight: 700;
}

.ld-slot-name {
    display: flex;
    flex-direction: column;
    font-weight: 600;

    small {
        color: var(--d-muted);
        font-size: 12px;
        font-weight: 400;
    }
}

.ld-slot-check {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--d-hot);
    color: #fff;
    font-size: 11px;
    opacity: 0;
    transform: scale(0.6);
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.ld-block {
    padding: 36px var(--d-pad) 8px;

    h2 {
        margin-bottom: 18px;
        font-size: 24px;
    }
}

.ld-benefits {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;

    li {
        padding: 20px;
        border: 1px solid var(--d-line);
        border-radius: 18px;
        background: var(--d-panel);
    }

    h3 {
        margin: 14px 0 6px;
        font-size: 16px;
    }

    p {
        color: var(--d-muted);
        font-size: 13px;
    }
}

.ld-benefit-icon {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: rgba(255, 90, 71, 0.16);
    color: var(--d-warm);
}

.ld-quote {
    margin: 28px var(--d-pad) 0;
    padding: 26px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(255, 90, 71, 0.16), rgba(255, 179, 71, 0.08));
    text-align: center;

    blockquote {
        max-width: 560px;
        margin: 12px auto;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 19px;
        line-height: 1.4;
    }

    figcaption {
        color: var(--d-muted);
        font-size: 13px;
    }
}

.ld-stars {
    display: inline-flex;
    gap: 4px;
    color: var(--d-warm);
    font-size: 13px;
}

.ld-signup {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 28px;
    margin: 28px var(--d-pad) 0;
    padding: 28px;
    border: 1px solid var(--d-line);
    border-radius: 22px;
    background: var(--d-panel);
}

.ld-signup-text {
    h2 {
        margin-bottom: 8px;
        font-size: 26px;
    }

    p {
        color: var(--d-muted);
    }
}

.ld-form {
    display: grid;
    gap: 12px;

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
    select {
        width: 100%;
        padding: 11px 12px;
        border: 1px solid var(--d-line);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.06);
        outline: none;
        transition: border-color 0.2s ease;

        &:focus {
            border-color: var(--d-warm);
        }
    }

    option {
        color: #111;
    }

    .ld-btn {
        margin-top: 4px;
    }
}

.ld-success {
    display: grid;
    justify-items: center;
    gap: 8px;
    padding: 12px;
    text-align: center;

    h3 {
        font-size: 20px;
    }

    p {
        color: var(--d-muted);
    }
}

.ld-success-icon {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--d-hot), var(--d-warm));
    color: #1a1208;
    font-size: 20px;
    animation: ldPop 0.4s cubic-bezier(0.22, 1.4, 0.36, 1);
}

@keyframes ldPop {
    from {
        transform: scale(0.4);
        opacity: 0;
    }
}

.ld-link {
    margin-top: 4px;
    color: var(--d-warm);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
}

.ld-foot {
    padding: 28px var(--d-pad);
    color: var(--d-muted);
    font-size: 12px;
    text-align: center;
}

@container (max-width: 640px) {
    .ld {
        --d-pad: 18px;
    }

    .ld-hero,
    .ld-signup {
        grid-template-columns: 1fr;
    }

    .ld-hero {
        padding-top: 30px;
    }

    .ld-benefits {
        grid-template-columns: 1fr;
    }

    .ld-signup {
        padding: 20px;
    }
}
</style>

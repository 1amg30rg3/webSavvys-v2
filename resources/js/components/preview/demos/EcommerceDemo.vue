<script setup lang="ts">
import { faBagShopping } from '@fortawesome/free-solid-svg-icons/faBagShopping';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { computed, onBeforeUnmount, ref } from 'vue';
import { previewContent, type PreviewLocale, type ProductCategory } from '../content';

const props = defineProps<{
    locale: PreviewLocale;
}>();

const c = computed(() => previewContent[props.locale].ecommerce);

// Names and prices come from content.ts, aligned by index.
const catalog: Array<{ id: string; category: ProductCategory; shape: 'cup' | 'plate' | 'vase' | 'bowl'; color: string; tint: string }> = [
    { id: 'mug', category: 'cups', shape: 'cup', color: '#c4623f', tint: '#f6e7dd' },
    { id: 'plate', category: 'plates', shape: 'plate', color: '#7a9a8a', tint: '#e6efe9' },
    { id: 'bud-vase', category: 'vases', shape: 'vase', color: '#d9a441', tint: '#f8eed8' },
    { id: 'bowl', category: 'plates', shape: 'bowl', color: '#4f6d8f', tint: '#e3eaf2' },
    { id: 'espresso', category: 'cups', shape: 'cup', color: '#3a332e', tint: '#ece7e1' },
    { id: 'tall-vase', category: 'vases', shape: 'vase', color: '#b9744f', tint: '#f4e6dc' },
    { id: 'platter', category: 'plates', shape: 'plate', color: '#cdb596', tint: '#f3ede4' },
    { id: 'tea-cup', category: 'cups', shape: 'cup', color: '#8fae9d', tint: '#e8f0eb' },
];

const categories: Array<'all' | ProductCategory> = ['all', 'cups', 'plates', 'vases'];

const products = computed(() => catalog.map((item, index) => ({ ...item, ...c.value.products[index] })));

const query = ref('');
const category = ref<'all' | ProductCategory>('all');

const visible = computed(() => {
    const needle = query.value.trim().toLowerCase();

    return products.value.filter(
        (product) => (category.value === 'all' || product.category === category.value) && product.name.toLowerCase().includes(needle),
    );
});

const cart = ref<Record<string, number>>({});
const cartOpen = ref(false);
const ordered = ref(false);
const justAdded = ref<string | null>(null);
let addedTimer: number | undefined;

const cartItems = computed(() =>
    products.value.filter((product) => cart.value[product.id]).map((product) => ({ ...product, qty: cart.value[product.id] })),
);
const count = computed(() => cartItems.value.reduce((sum, item) => sum + item.qty, 0));
const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.qty * item.price, 0));

const money = (amount: number) => `${c.value.currency.prefix}${amount}${c.value.currency.suffix}`;

const add = (id: string) => {
    cart.value = { ...cart.value, [id]: (cart.value[id] ?? 0) + 1 };
    justAdded.value = id;
    window.clearTimeout(addedTimer);
    addedTimer = window.setTimeout(() => (justAdded.value = null), 1200);
};

const changeQty = (id: string, delta: number) => {
    const next = { ...cart.value, [id]: (cart.value[id] ?? 0) + delta };
    if (next[id] <= 0) delete next[id];
    cart.value = next;
};

const checkout = () => {
    ordered.value = true;
    cart.value = {};
};

const closeCart = () => {
    cartOpen.value = false;
    ordered.value = false;
};

onBeforeUnmount(() => window.clearTimeout(addedTimer));
</script>

<template>
    <div class="demo ec">
        <div class="ec-scroll">
            <header class="ec-top">
                <span class="ec-logo">{{ c.brand }}</span>
                <label class="ec-search">
                    <font-awesome-icon :icon="faMagnifyingGlass" />
                    <input v-model="query" type="search" :placeholder="c.searchPlaceholder" :aria-label="c.searchPlaceholder" />
                </label>
                <button class="ec-cart-btn" type="button" :aria-label="`${c.cartLabel}: ${count}`" @click="cartOpen = true">
                    <font-awesome-icon :icon="faBagShopping" />
                    <span v-if="count" :key="count" class="ec-count">{{ count }}</span>
                </button>
            </header>

            <div class="ec-hero">
                <h1>{{ c.heroTitle }}</h1>
                <p>{{ c.heroText }}</p>
            </div>

            <div class="ec-chips">
                <button
                    v-for="key in categories"
                    :key="key"
                    type="button"
                    :class="{ 'is-active': category === key }"
                    :aria-pressed="category === key"
                    @click="category = key"
                >
                    {{ c.categories[key] }}
                </button>
            </div>

            <ul v-if="visible.length" class="ec-grid">
                <li v-for="product in visible" :key="product.id" class="ec-card">
                    <div class="ec-art" :class="`ec-art--${product.shape}`" :style="{ '--glaze': product.color, '--tint': product.tint }">
                        <span v-if="product.badge" class="ec-tag">{{ product.badge }}</span>
                        <i></i>
                    </div>
                    <h3>{{ product.name }}</h3>
                    <div class="ec-card-foot">
                        <strong>{{ money(product.price) }}</strong>
                        <button class="ec-add" :class="{ 'is-added': justAdded === product.id }" type="button" @click="add(product.id)">
                            <font-awesome-icon :icon="justAdded === product.id ? faCheck : faPlus" />
                            {{ justAdded === product.id ? c.added : c.add }}
                        </button>
                    </div>
                </li>
            </ul>
            <p v-else class="ec-empty">{{ c.empty }}</p>

            <footer class="ec-foot">{{ c.footer }}</footer>
        </div>

        <Transition name="ec-fade">
            <div v-if="cartOpen" class="ec-backdrop" @click="closeCart"></div>
        </Transition>

        <Transition name="ec-slide">
            <aside v-if="cartOpen" class="ec-drawer" :aria-label="c.cartTitle">
                <div class="ec-drawer-head">
                    <h2>{{ c.cartTitle }}</h2>
                    <button type="button" :aria-label="c.close" @click="closeCart">
                        <font-awesome-icon :icon="faXmark" />
                    </button>
                </div>

                <div v-if="ordered" class="ec-order" role="status">
                    <span class="ec-order-icon"><font-awesome-icon :icon="faCheck" /></span>
                    <h3>{{ c.orderTitle }}</h3>
                    <p>{{ c.orderText }}</p>
                    <button class="ec-checkout" type="button" @click="closeCart">{{ c.keepShopping }}</button>
                </div>

                <template v-else-if="cartItems.length">
                    <ul class="ec-lines">
                        <li v-for="item in cartItems" :key="item.id">
                            <div class="ec-art ec-art--mini" :class="`ec-art--${item.shape}`" :style="{ '--glaze': item.color, '--tint': item.tint }">
                                <i></i>
                            </div>
                            <div class="ec-line-body">
                                <h3>{{ item.name }}</h3>
                                <span>{{ money(item.price) }}</span>
                                <button class="ec-remove" type="button" @click="changeQty(item.id, -item.qty)">{{ c.remove }}</button>
                            </div>
                            <div class="ec-qty">
                                <button type="button" aria-label="−" @click="changeQty(item.id, -1)"><font-awesome-icon :icon="faMinus" /></button>
                                <span>{{ item.qty }}</span>
                                <button type="button" aria-label="+" @click="changeQty(item.id, 1)"><font-awesome-icon :icon="faPlus" /></button>
                            </div>
                        </li>
                    </ul>
                    <div class="ec-summary">
                        <p>
                            <span>{{ c.shipping }}</span>
                            <span>{{ c.shippingValue }}</span>
                        </p>
                        <p class="ec-total">
                            <span>{{ c.subtotal }}</span>
                            <strong>{{ money(subtotal) }}</strong>
                        </p>
                        <button class="ec-checkout" type="button" @click="checkout">{{ c.checkout }}</button>
                    </div>
                </template>

                <p v-else class="ec-empty">{{ c.cartEmpty }}</p>
            </aside>
        </Transition>
    </div>
</template>

<style lang="scss" scoped>
.ec {
    --d-ink: #2b2622;
    --d-muted: #8a7f76;
    --d-bg: #faf6f0;
    --d-card: #ffffff;
    --d-line: #ebe3d9;
    --d-accent: #c4623f;
    --d-accent-dark: #a54e2f;
    --d-pad: 30px;

    position: relative;
    overflow: hidden;
    background: var(--d-bg);
    color: var(--d-ink);
}

.ec-scroll {
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.ec-top {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px var(--d-pad);
    background: rgba(250, 246, 240, 0.92);
    border-bottom: 1px solid var(--d-line);
    backdrop-filter: blur(10px);
}

.ec-logo {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.ec-search {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 10px;
    max-width: 380px;
    margin-left: auto;
    padding: 9px 14px;
    border: 1px solid var(--d-line);
    border-radius: 999px;
    background: var(--d-card);
    color: var(--d-muted);
    transition: border-color 0.2s ease;

    &:focus-within {
        border-color: var(--d-accent);
    }

    input {
        flex: 1;
        min-width: 0;
        border: 0;
        background: none;
        color: var(--d-ink);
        outline: none;

        &::-webkit-search-cancel-button {
            display: none;
        }
    }
}

.ec-cart-btn {
    position: relative;
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--d-ink);
    color: #fff;
    font-size: 16px;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.06);
    }
}

.ec-count {
    position: absolute;
    top: -4px;
    right: -4px;
    display: grid;
    place-items: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--d-accent);
    font-size: 11px;
    font-weight: 700;
    animation: ecBump 0.35s cubic-bezier(0.22, 1.6, 0.36, 1);
}

@keyframes ecBump {
    from {
        transform: scale(0.4);
    }
}

.ec-hero {
    padding: 34px var(--d-pad) 6px;

    h1 {
        max-width: 560px;
        margin-bottom: 8px;
        font-size: clamp(24px, 4.4cqi, 36px);
    }

    p {
        max-width: 520px;
        color: var(--d-muted);
        font-size: 15px;
    }
}

.ec-chips {
    display: flex;
    gap: 8px;
    padding: 20px var(--d-pad) 4px;
    overflow-x: auto;
    scrollbar-width: none;

    button {
        flex-shrink: 0;
        padding: 8px 16px;
        border: 1px solid var(--d-line);
        border-radius: 999px;
        background: var(--d-card);
        font-weight: 600;
        transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;

        &:hover {
            border-color: var(--d-ink);
        }

        &.is-active {
            border-color: var(--d-ink);
            background: var(--d-ink);
            color: #fff;
        }
    }
}

.ec-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    padding: 16px var(--d-pad) 8px;
}

.ec-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border: 1px solid var(--d-line);
    border-radius: 20px;
    background: var(--d-card);
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 18px 34px rgba(43, 38, 34, 0.1);

        .ec-art i {
            transform: scale(1.06) rotate(-2deg);
        }
    }

    h3 {
        flex: 1;
        padding: 0 4px;
        font-size: 15px;
    }
}

.ec-card-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0 4px 4px;

    strong {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 17px;
    }
}

.ec-add {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 999px;
    background: var(--d-accent);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
    transition: background 0.2s ease;

    &:hover {
        background: var(--d-accent-dark);
    }

    &.is-added {
        background: #4d8b6c;
    }
}

// ── Product "photos": ceramic shapes drawn in CSS ─────────────────────────────
.ec-art {
    --stroke: 7px;

    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 4 / 3;
    border-radius: 14px;
    background: var(--tint);

    i {
        position: relative;
        display: block;
        background: var(--glaze);
        filter: drop-shadow(0 10px 8px rgba(43, 38, 34, 0.16));
        transition: transform 0.3s ease;
    }

    &--cup i {
        width: 34%;
        aspect-ratio: 1 / 0.92;
        border-radius: 6% 6% 38% 38%;

        &::after {
            content: '';
            position: absolute;
            top: 16%;
            left: 96%;
            width: 34%;
            height: 46%;
            border: var(--stroke) solid var(--glaze);
            border-left: 0;
            border-radius: 0 50% 50% 0;
        }
    }

    &--plate i {
        width: 52%;
        aspect-ratio: 1;
        border-radius: 50%;
        box-shadow: inset 0 0 0 calc(var(--stroke) * 1.6) rgba(255, 255, 255, 0.32);
    }

    &--bowl i {
        width: 54%;
        aspect-ratio: 2 / 1;
        border-radius: 4% 4% 50% 50% / 8% 8% 92% 92%;
    }

    &--vase i {
        width: 22%;
        aspect-ratio: 1 / 2.1;
        border-radius: 42% 42% 46% 46% / 24% 24% 62% 62%;

        &::before {
            content: '';
            position: absolute;
            top: -9%;
            left: 26%;
            width: 48%;
            height: 16%;
            border-radius: 20%;
            background: var(--glaze);
        }
    }

    &--mini {
        --stroke: 3px;

        flex-shrink: 0;
        width: 58px;
        aspect-ratio: 1;
        border-radius: 12px;
    }
}

.ec-tag {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 4px 9px;
    border-radius: 999px;
    background: var(--d-ink);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
}

.ec-empty {
    padding: 40px var(--d-pad);
    color: var(--d-muted);
    text-align: center;
}

.ec-foot {
    padding: 26px var(--d-pad);
    color: var(--d-muted);
    font-size: 12px;
    text-align: center;
}

// ── Cart drawer ───────────────────────────────────────────────────────────────
.ec-backdrop {
    position: absolute;
    inset: 0;
    z-index: 4;
    background: rgba(43, 38, 34, 0.4);
}

.ec-drawer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    width: min(360px, 88%);
    background: var(--d-card);
    box-shadow: -20px 0 50px rgba(43, 38, 34, 0.18);
}

.ec-drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid var(--d-line);

    h2 {
        font-size: 19px;
    }

    button {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--d-bg);
    }
}

.ec-lines {
    display: grid;
    flex: 1;
    align-content: start;
    gap: 14px;
    padding: 18px 20px;
    overflow-y: auto;
    overscroll-behavior: contain;

    li {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    h3 {
        font-size: 14px;
    }
}

.ec-line-body {
    display: grid;
    flex: 1;
    gap: 2px;
    justify-items: start;
    min-width: 0;

    span {
        color: var(--d-muted);
        font-size: 13px;
    }
}

.ec-remove {
    color: var(--d-accent-dark);
    font-size: 12px;
    text-decoration: underline;
    text-underline-offset: 2px;
}

.ec-qty {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    border: 1px solid var(--d-line);
    border-radius: 999px;
    font-weight: 700;

    button {
        display: grid;
        place-items: center;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--d-bg);
        font-size: 10px;
    }
}

.ec-summary {
    display: grid;
    gap: 8px;
    padding: 18px 20px 20px;
    border-top: 1px solid var(--d-line);

    p {
        display: flex;
        justify-content: space-between;
        color: var(--d-muted);
    }
}

.ec-total {
    color: var(--d-ink) !important;
    font-weight: 700;

    strong {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 20px;
    }
}

.ec-checkout {
    margin-top: 6px;
    padding: 14px;
    border-radius: 14px;
    background: var(--d-ink);
    color: #fff;
    font-weight: 700;
    transition: background 0.2s ease;

    &:hover {
        background: var(--d-accent-dark);
    }
}

.ec-order {
    display: grid;
    flex: 1;
    align-content: center;
    justify-items: center;
    gap: 10px;
    padding: 24px;
    text-align: center;

    h3 {
        font-size: 20px;
    }

    p {
        color: var(--d-muted);
        font-size: 13px;
    }

    .ec-checkout {
        width: 100%;
    }
}

.ec-order-icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #4d8b6c;
    color: #fff;
    font-size: 22px;
    animation: ecBump 0.4s cubic-bezier(0.22, 1.6, 0.36, 1);
}

.ec-fade-enter-active,
.ec-fade-leave-active {
    transition: opacity 0.25s ease;
}

.ec-fade-enter-from,
.ec-fade-leave-to {
    opacity: 0;
}

.ec-slide-enter-active,
.ec-slide-leave-active {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.ec-slide-enter-from,
.ec-slide-leave-to {
    transform: translateX(100%);
}

@container (max-width: 900px) {
    .ec-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@container (max-width: 640px) {
    .ec {
        --d-pad: 16px;
    }

    .ec-logo {
        font-size: 18px;
    }

    .ec-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }

    .ec-card {
        padding: 8px;
        border-radius: 16px;
    }

    .ec-add {
        flex: 1;
        justify-content: center;
    }
}
</style>

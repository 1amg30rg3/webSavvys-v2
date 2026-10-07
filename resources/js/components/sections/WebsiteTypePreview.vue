<script setup lang="ts">
defineProps<{
    type: string;
}>();
</script>

<template>
    <div class="wtype-preview" aria-hidden="true">
        <div class="mock" :class="`mock--${type}`">
            <div class="mock-bar">
                <i></i>
                <i></i>
                <i></i>
                <span class="mock-url"></span>
            </div>

            <!-- Landing page -->
            <div v-if="type === 'landing'" class="mock-screen">
                <span class="mk-line mk-line--title"></span>
                <span class="mk-line mk-line--sub"></span>
                <span class="mk-btn"></span>
                <div class="mk-trio">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="mk-band"></span>
            </div>

            <!-- Business website -->
            <div v-else-if="type === 'business'" class="mock-screen">
                <div class="mk-nav">
                    <span class="mk-logo"></span>
                    <span class="mk-link"></span>
                    <span class="mk-link"></span>
                    <span class="mk-link"></span>
                    <span class="mk-link"></span>
                </div>
                <div class="mk-split">
                    <div class="mk-split-text">
                        <span class="mk-line mk-line--title"></span>
                        <span class="mk-line mk-line--sub"></span>
                        <span class="mk-btn"></span>
                    </div>
                    <span class="mk-image"></span>
                </div>
                <div class="mk-trio">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <!-- E-commerce -->
            <div v-else-if="type === 'ecommerce'" class="mock-screen">
                <div class="mk-nav">
                    <span class="mk-logo"></span>
                    <span class="mk-search"></span>
                    <span class="mk-cart"></span>
                </div>
                <div class="mk-products">
                    <div v-for="n in 6" :key="n" class="mk-product">
                        <span class="mk-product-image"></span>
                        <span class="mk-line mk-line--sub"></span>
                        <span class="mk-product-price"></span>
                    </div>
                </div>
            </div>

            <!-- Web application -->
            <div v-else class="mock-screen">
                <div class="mk-sidebar">
                    <span class="mk-logo"></span>
                    <span class="mk-side-item is-active"></span>
                    <span class="mk-side-item"></span>
                    <span class="mk-side-item"></span>
                    <span class="mk-side-item"></span>
                </div>
                <div class="mk-main">
                    <div class="mk-trio">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="mk-chart">
                        <span style="--h: 38%"></span>
                        <span style="--h: 62%"></span>
                        <span style="--h: 48%"></span>
                        <span style="--h: 82%"></span>
                        <span style="--h: 58%"></span>
                        <span style="--h: 96%"></span>
                        <span style="--h: 72%"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

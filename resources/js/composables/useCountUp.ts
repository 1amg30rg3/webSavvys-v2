import { onMounted, onUnmounted, ref, type Ref } from 'vue';

interface CountUpOptions {
    duration?: number;
    decimals?: number;
}

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

export function useCountUp(target: Ref<HTMLElement | null>, endValue: number, options: CountUpOptions = {}) {
    const { duration = 1400, decimals = 0 } = options;
    const value = ref(0);
    let observer: IntersectionObserver | null = null;
    let hasAnimated = false;

    const animate = () => {
        if (typeof window === 'undefined') return;

        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            value.value = endValue;
            return;
        }

        const start = performance.now();

        const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            value.value = Number((easeOutQuint(progress) * endValue).toFixed(decimals));
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    };

    onMounted(() => {
        if (typeof window === 'undefined' || !target.value) return;

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        hasAnimated = true;
                        animate();
                    }
                });
            },
            { threshold: 0.4 },
        );

        observer.observe(target.value);
    });

    onUnmounted(() => {
        observer?.disconnect();
    });

    return { value };
}

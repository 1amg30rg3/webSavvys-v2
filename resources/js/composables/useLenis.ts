import Lenis from 'lenis';
import { onMounted, onUnmounted } from 'vue';

export function useLenis() {
    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
    };

    onMounted(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return;
        }

        lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        rafId = requestAnimationFrame(raf);
    });

    onUnmounted(() => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
        }
        lenis?.destroy();
        lenis = null;
    });
}

import { onMounted, onUnmounted, type Directive, type Ref } from 'vue';

interface TiltOptions {
    max?: number;
}

function attachTilt(el: HTMLElement, options: TiltOptions = {}): () => void {
    if (typeof window === 'undefined') return () => {};

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches;
    if (prefersReducedMotion || isCoarsePointer) return () => {};

    const { max = 8 } = options;

    const handlePointerMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;

        const rotateY = (px - 0.5) * max * 2;
        const rotateX = (0.5 - py) * max * 2;

        el.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
        el.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`);
        el.style.setProperty('--glare-opacity', '1');
    };

    const handlePointerLeave = () => {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
        el.style.setProperty('--glare-opacity', '0');
    };

    el.classList.add('is-tilt');
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
        el.removeEventListener('pointermove', handlePointerMove);
        el.removeEventListener('pointerleave', handlePointerLeave);
    };
}

/** For a single named element via template ref. */
export function useTilt(target: Ref<HTMLElement | null>, options: TiltOptions = {}) {
    let cleanup: (() => void) | null = null;

    onMounted(() => {
        if (!target.value) return;
        cleanup = attachTilt(target.value, options);
    });

    onUnmounted(() => {
        cleanup?.();
        cleanup = null;
    });
}

/** For repeated elements (v-for grids/lists): `v-tilt` or `v-tilt="{ max: 6 }"`. */
export const vTilt: Directive<HTMLElement, TiltOptions | undefined> = {
    mounted(el, binding) {
        (el as HTMLElement & { __tiltCleanup?: () => void }).__tiltCleanup = attachTilt(el, binding.value ?? {});
    },
    unmounted(el) {
        (el as HTMLElement & { __tiltCleanup?: () => void }).__tiltCleanup?.();
    },
};

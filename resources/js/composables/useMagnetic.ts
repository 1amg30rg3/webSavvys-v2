import { onMounted, onUnmounted, type Directive, type Ref } from 'vue';

interface MagneticOptions {
    strength?: number;
    maxOffset?: number;
}

function attachMagnetic(el: HTMLElement, options: MagneticOptions = {}): () => void {
    if (typeof window === 'undefined') return () => {};

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches;
    if (prefersReducedMotion || isCoarsePointer) return () => {};

    const { strength = 0.35, maxOffset = 14 } = options;

    const handlePointerMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const offsetX = event.clientX - (rect.left + rect.width / 2);
        const offsetY = event.clientY - (rect.top + rect.height / 2);

        const x = Math.max(-maxOffset, Math.min(maxOffset, offsetX * strength));
        const y = Math.max(-maxOffset, Math.min(maxOffset, offsetY * strength));

        el.style.setProperty('--magnetic-x', `${x.toFixed(1)}px`);
        el.style.setProperty('--magnetic-y', `${y.toFixed(1)}px`);

        // Also expose pointer position as a percentage, for a cursor-glow layered under the effect.
        const glowX = ((event.clientX - rect.left) / rect.width) * 100;
        const glowY = ((event.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--btn-glow-x', `${glowX.toFixed(1)}%`);
        el.style.setProperty('--btn-glow-y', `${glowY.toFixed(1)}%`);
        el.style.setProperty('--btn-glow-opacity', '1');
    };

    const handlePointerLeave = () => {
        el.style.setProperty('--magnetic-x', '0px');
        el.style.setProperty('--magnetic-y', '0px');
        el.style.setProperty('--btn-glow-opacity', '0');
    };

    el.classList.add('is-magnetic');
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
        el.removeEventListener('pointermove', handlePointerMove);
        el.removeEventListener('pointerleave', handlePointerLeave);
    };
}

/** For a single named element via template ref. */
export function useMagnetic(target: Ref<HTMLElement | null>, options: MagneticOptions = {}) {
    let cleanup: (() => void) | null = null;

    onMounted(() => {
        if (!target.value) return;
        cleanup = attachMagnetic(target.value, options);
    });

    onUnmounted(() => {
        cleanup?.();
        cleanup = null;
    });
}

/** For repeated elements (v-for grids/lists): `v-magnetic` or `v-magnetic="{ strength: 0.2 }"`. */
export const vMagnetic: Directive<HTMLElement, MagneticOptions | undefined> = {
    mounted(el, binding) {
        (el as HTMLElement & { __magneticCleanup?: () => void }).__magneticCleanup = attachMagnetic(el, binding.value ?? {});
    },
    unmounted(el) {
        (el as HTMLElement & { __magneticCleanup?: () => void }).__magneticCleanup?.();
    },
};

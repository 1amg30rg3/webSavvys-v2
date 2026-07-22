import { onMounted, onUnmounted, ref } from 'vue';

export function useActiveSection(ids: string[]) {
    const activeId = ref<string | null>(null);
    let observer: IntersectionObserver | null = null;

    onMounted(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);

        if (!elements.length) {
            return;
        }

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeId.value = entry.target.id;
                    }
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
        );

        elements.forEach((el) => observer?.observe(el));
    });

    onUnmounted(() => {
        observer?.disconnect();
    });

    return { activeId };
}

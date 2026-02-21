// Minimal scroll animation composable - intersection observer only
import { onMounted, onUnmounted, ref } from 'vue';

export function useScrollAnimation(threshold = 0.1) {
    const sectionRef = ref<HTMLElement | null>(null);
    let observer: IntersectionObserver | null = null;

    onMounted(() => {
        if (!sectionRef.value) return;

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const animatedElements = entry.target.querySelectorAll('[data-animate]');
                        animatedElements.forEach((el) => {
                            const delay = el.getAttribute('data-delay');
                            if (delay) {
                                setTimeout(() => {
                                    el.classList.add('is-visible');
                                }, parseInt(delay));
                            } else {
                                el.classList.add('is-visible');
                            }
                        });
                    }
                });
            },
            { threshold }
        );

        observer.observe(sectionRef.value);
    });

    onUnmounted(() => {
        if (observer) {
            observer.disconnect();
        }
    });

    return { sectionRef };
}

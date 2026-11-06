import { createApp, defineComponent, h, onMounted, onUnmounted, ref } from 'vue';
import { mountRevenueChart, setupPage } from './showcase';

const RevenueChart = defineComponent({
  setup() {
    const container = ref<HTMLElement>();
    let dispose: (() => void) | undefined;

    onMounted(() => {
      dispose = mountRevenueChart(container.value!);
    });
    onUnmounted(() => dispose?.());

    return () => h('div', { class: 'chart', ref: container });
  },
});

const app = createApp(RevenueChart);
app.mount(setupPage('Vue'));
import.meta.hot?.dispose(() => app.unmount());

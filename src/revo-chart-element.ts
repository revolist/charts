import { createChart, type ChartOptions, type ChartRef } from '@revolist/charts-trial';

export type RevoChartOptions = Omit<ChartOptions, 'container'>;

/** Example custom element that serializes asynchronous chart mounts. */
export class RevoChartElement extends HTMLElement {
  private readonly container = document.createElement('div');
  private currentOptions: RevoChartOptions | undefined;
  private chart: ChartRef | undefined;
  private revision = 0;
  private pending = Promise.resolve();

  get options(): RevoChartOptions | undefined {
    return this.currentOptions;
  }

  set options(value: RevoChartOptions | undefined) {
    this.currentOptions = value;
    this.requestRender();
  }

  connectedCallback() {
    const assigned = Object.getOwnPropertyDescriptor(this, 'options');
    if (assigned) {
      Reflect.deleteProperty(this, 'options');
      this.currentOptions = assigned.value;
    }
    this.style.display ||= 'block';
    this.style.height ||= '400px';
    this.container.style.height = '100%';
    this.append(this.container);
    this.requestRender();
  }

  disconnectedCallback() {
    this.revision++;
    this.chart?.destroy();
    this.chart = undefined;
  }

  private requestRender() {
    const revision = ++this.revision;
    this.pending = this.pending.then(async () => {
      if (!this.isConnected || revision !== this.revision) return;
      this.chart?.destroy();
      this.chart = undefined;
      if (!this.currentOptions) return;

      const chart = await createChart({ ...this.currentOptions, container: this.container });
      if (!this.isConnected || revision !== this.revision) {
        chart.destroy();
        return;
      }
      this.chart = chart;
      this.dispatchEvent(new CustomEvent('chart-ready', {
        detail: chart,
        bubbles: true,
        composed: true,
      }));
    }).catch((error: unknown) => {
      if (this.isConnected && revision === this.revision) {
        this.dispatchEvent(new CustomEvent('chart-error', {
          detail: error,
          bubbles: true,
          composed: true,
        }));
      }
    });
  }
}

if (!customElements.get('revo-chart')) {
  customElements.define('revo-chart', RevoChartElement);
}

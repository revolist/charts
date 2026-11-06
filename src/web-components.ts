import './revo-chart-element';
import type { RevoChartElement } from './revo-chart-element';
import { createRevenueOptions, setupPage } from './showcase';

const chart = document.createElement('revo-chart') as RevoChartElement;
chart.options = createRevenueOptions();
chart.addEventListener('chart-error', (event) => console.error((event as CustomEvent).detail));
setupPage('Web Components').append(chart);

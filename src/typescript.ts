import { mountRevenueChart, setupPage } from './showcase';

const host = setupPage('TypeScript');
host.className = 'chart';
const dispose = mountRevenueChart(host);
window.addEventListener('pagehide', dispose, { once: true });
import.meta.hot?.dispose(dispose);

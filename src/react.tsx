import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { mountRevenueChart, setupPage } from './showcase';

function RevenueChart() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => mountRevenueChart(container.current!), []);

  return <div className="chart" ref={container} />;
}

const root = createRoot(setupPage('React'));
root.render(<RevenueChart />);
import.meta.hot?.dispose(() => root.unmount());

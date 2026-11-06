import { createChart, type ChartOptions } from '@revolist/charts-trial';
import './styles.css';

const messages = {
  en: {
    framework: 'Framework',
    title: 'Revenue at a glance',
    description: 'Compare monthly revenue with the plan using the same data across framework and Web Component integrations.',
    revenue: 'Revenue',
    plan: 'Plan',
    line: 'Line chart',
    columns: 'Column chart',
    trial: 'Commercial chart library · 30-day evaluation',
    docs: 'Explore the chart catalog and documentation',
    error: 'The chart could not load. Check the browser console for details.',
  },
  pt: {
    framework: 'Integração',
    title: 'Receita em destaque',
    description: 'Compare a receita mensal com o plano usando os mesmos dados em integrações de frameworks e Web Components.',
    revenue: 'Receita',
    plan: 'Plano',
    line: 'Gráfico de linhas',
    columns: 'Gráfico de colunas',
    trial: 'Biblioteca comercial de gráficos · avaliação de 30 dias',
    docs: 'Explore o catálogo de gráficos e a documentação',
    error: 'Não foi possível carregar o gráfico. Consulte a consola do navegador.',
  },
};

const query = new URLSearchParams(location.search);
const language = query.get('lang') === 'pt' ? 'pt' : 'en';
const labels = messages[language];
const chartType = query.get('type') === 'line' ? 'line' : 'groupedColumn';

export function setupPage(framework: string): HTMLElement {
  document.documentElement.lang = language;
  document.getElementById('frameworks')!.setAttribute('aria-label', labels.framework);
  document.getElementById('eyebrow')!.textContent = framework;
  document.getElementById('title')!.textContent = labels.title;
  document.getElementById('description')!.textContent = labels.description;
  document.getElementById('trial')!.textContent = labels.trial;
  document.getElementById('docs')!.textContent = labels.docs;

  const navigation = document.getElementById('chart-types')!;
  navigation.setAttribute('aria-label', labels.title);
  for (const [type, label] of [['groupedColumn', labels.columns], ['line', labels.line]]) {
    const link = document.createElement('a');
    link.href = `?type=${type}&lang=${language}`;
    link.textContent = label;
    if (type === chartType) link.setAttribute('aria-current', 'true');
    navigation.append(link);
  }
  return document.getElementById('app')!;
}

export function createRevenueOptions(): Omit<ChartOptions, 'container'> {
  const month = new Intl.DateTimeFormat(language, { month: 'short' });
  const revenue = [128, 146, 139, 172, 188, 205];
  const plan = [130, 140, 150, 165, 180, 195];

  return {
    chartType,
    data: revenue.map((value, index) => ({
      month: month.format(new Date(2026, index, 1)),
      revenue: value,
      plan: plan[index],
    })),
    mapping: {
      category: { field: 'month' },
      series: [
        { field: 'revenue', label: labels.revenue },
        { field: 'plan', label: labels.plan },
      ],
    },
    presentation: { title: labels.title },
  };
}

export function mountRevenueChart(container: HTMLElement): () => void {
  let disposed = false;
  let destroy: (() => void) | undefined;
  void createChart({ ...createRevenueOptions(), container }).then((chart) => {
    destroy = () => chart.destroy();
    if (disposed) destroy();
  }).catch((error: unknown) => {
    console.error(error);
    if (!disposed) container.textContent = labels.error;
  });

  return () => {
    disposed = true;
    destroy?.();
  };
}

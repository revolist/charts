import '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { mountRevenueChart, setupPage } from './showcase';

class RevenueChart implements AfterViewInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private dispose: (() => void) | undefined;

  ngAfterViewInit() {
    this.dispose = mountRevenueChart(this.element.nativeElement);
  }

  ngOnDestroy() {
    this.dispose?.();
  }
}

Component({
  selector: 'revenue-chart',
  standalone: true,
  template: '',
  host: { class: 'chart' },
})(RevenueChart);

setupPage('Angular').append(document.createElement('revenue-chart'));
const application = bootstrapApplication(RevenueChart);
import.meta.hot?.dispose(() => void application.then((app) => app.destroy()));

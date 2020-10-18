import { Component } from '@angular/core';
import { ApiStatusReport } from '..';
import { getAllStatusReportFailures } from '../actions/reports';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public latestFailures: Array<ApiStatusReport> = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.fetch();
  }

  async fetch(): Promise<void> {
    try {
      this.latestFailures = await getAllStatusReportFailures();
    } catch (error) {
      this.latestFailures = [];
      console.error(error);
    } finally {
      setTimeout(() => this.fetch(), 25 * 1000);
    }
  }
}

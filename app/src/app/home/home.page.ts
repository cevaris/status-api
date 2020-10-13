import { Component } from '@angular/core';
import { StatusReport } from '..';
import { getAllStatusReportFailures } from '../actions/reports';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public latestFailures: Array<StatusReport> = [];

  constructor() { }

  ngAfterViewInit(): void {
    // fire off update on load, then refresh every 25 seconds
    setInterval((ref) => this.update(ref), 25 * 1000, this);
    // kick off first run
    this.update(this);
  }

  async update(ref: HomePage): Promise<void> {
    try {
      this.latestFailures = await getAllStatusReportFailures();
    } catch (error) {
      this.latestFailures = [];
      console.error(error);
    }
  }
}

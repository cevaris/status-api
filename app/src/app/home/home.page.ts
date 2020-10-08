import { Component } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { StatusReport } from '..';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public latestFailures: Array<StatusReport>;

  constructor() { }

  ngAfterViewInit(): void {
    // fire off update on load, then refresh every 25 seconds
    setInterval((ref) => this.updateGraph(ref), 25 * 1000, this);
    // kick off first run
    this.updateGraph(this);
  }

  async updateGraph(ref: HomePage): Promise<void> {
    try {
      const latestFailuresResponse = await axios.get<StatusReport[]>(`${environment.apiHost}/reports/failures.json`);
      this.latestFailures = latestFailuresResponse.data;
    } catch (error) {
      console.error(error);
    }
  }
}

import { Component } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { StatusReport, StatusReportMetadata } from '..';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public latestFailures: Array<StatusReport>;
  // public metadata: Map<String, StatusReportMetadata>;

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

      // const metadataResponse = await axios.get<Array<StatusReportMetadata>>(`${environment.apiHost}/report_metadata.json`);
      // if (metadataResponse.data?.length > 0) {
      //   this.metadata = new Map(metadataResponse.data.map(m => [m.key, m]));
      //   console.log(this.metadata);
      // } else {
      //   console.error('StatusReportMetadata query returned no result');
      // }

    } catch (error) {
      console.error(error);
    }
  }
}

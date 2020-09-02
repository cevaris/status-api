import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { Chart, ChartOptions } from "chart.js";
import { StatusReport, StatusReportMetadata } from '..';
import { environment } from '../../environments/environment';

enum ApiStatus {
  Healthy = 'Healthy',
  Recovering = 'Recovering',
  Failing = 'Failing',
}

@Component({
  selector: 'app-report',
  templateUrl: 'report.page.html',
  styleUrls: ['report.page.scss'],
})
export class ReportPage implements OnInit {
  key: string = null;

  @ViewChild("lineCanvasLatency") lineCanvasLatency: ElementRef;
  @ViewChild("lineCanvasOk") lineCanvasOk: ElementRef;

  public lineChartLatency: Chart;
  public lineChartOk: Chart;
  public metadata: StatusReportMetadata;
  public reportName: string;
  public latestFailures: Array<StatusReport>;
  public healthiness: ApiStatus;


  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.key = this.route.snapshot.paramMap.get('key');
  }

  ngAfterViewInit(): void {
    const lineOptions: ChartOptions = {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              minute: 'h:mm a'
            }
          }
        }]
      }
    };

    this.lineChartLatency = new Chart(this.lineCanvasLatency.nativeElement, {
      type: "line",
      data: {
        datasets: [
          {
            label: "",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
            spanGaps: false
          }
        ]
      },
      options: lineOptions
    });

    this.lineChartOk = new Chart(this.lineCanvasOk.nativeElement, {
      type: "line",
      data: {
        datasets: [
          {
            label: "",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
            spanGaps: false
          }
        ]
      },
      options: lineOptions
    });

    // fetch report metadata for labeling, then fetch report data
    this.fetchMetadata()
      .then(() => this.updateGraph(this));

    // fire off update on load, then refresh every 25 seconds
    setInterval((ref) => this.updateGraph(ref), 25 * 1000, this);
  }

  async fetchMetadata(): Promise<void> {
    const metadataResponse = await axios.get<StatusReportMetadata>(`${environment.apiHost}/report_metadata/${this.key}.json`);
    this.metadata = metadataResponse.data;

    const latestFailuresResponse = await axios.get<StatusReport[]>(`${environment.apiHost}/reports/${this.key}.json?latest_failures=10`);
    this.latestFailures = latestFailuresResponse.data;

    const region = this.metadata.region === 'global' ? '' : this.metadata.region + ' ';
    this.reportName = `${this.metadata.service} ${region}${this.metadata.api} ${this.metadata.action}`;
  }

  async updateGraph(ref: ReportPage): Promise<void> {
    try {
      const latestFailuresResponse = await axios.get<StatusReport[]>(`${environment.apiHost}/reports/${this.key}.json?latest_failures=10`);
      this.latestFailures = latestFailuresResponse.data;

      const response = await axios.get<Array<StatusReport>>(`${environment.apiHost}/reports/${this.key}.json`);

      const latencyValues = response.data.map(sr => {
        return { x: sr.startDate, y: sr.latencyMs };
      });
      ref.lineChartLatency.data.datasets[0].data = latencyValues;
      ref.lineChartLatency.data.datasets[0].label = `${this.reportName} latency (ms)`;
      ref.lineChartLatency.update();

      const okValues = response.data.map(sr => {
        const value = sr.ok ? 1 : 0;
        return { x: sr.startDate, y: value };
      });
      ref.lineChartOk.data.datasets[0].data = okValues;
      ref.lineChartOk.data.datasets[0].label = `0 = not healthy; 1 = is healthy`;
      ref.lineChartOk.update();

      this.healthiness = this.determineHealth(response.data.map(sr => sr.ok));
    } catch (error) {
      console.error(error);
    }
  }

  determineHealth(data: Array<Boolean>): ApiStatus {
    const N = 10;
    // get last N minutes
    const lastNMins = data.slice(-N);
    const successes = lastNMins.filter(x => x === true);
    if (successes.length === N) {
      // all last N minutes need to be successful to be healthy
      return ApiStatus.Healthy;
    } else {
      console.log(lastNMins)
      if (lastNMins[lastNMins.length - 1] === false) {
        // if last N minutes contains failures and last minute failed
        return ApiStatus.Failing;
      } else {
        // if last N minutes contains failures and last minute succeeded
        return ApiStatus.Recovering;
      }
    }
  }

}

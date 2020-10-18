import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, ChartOptions } from "chart.js";
import { ApiStatusReport, ApiStatusReportMetadata } from '..';
import { getReportMetadata } from '../actions/reportMetadata';
import { getStatusReportFailures, getStatusReports } from '../actions/reports';

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
  public metadata: ApiStatusReportMetadata;
  public reportName: string;
  public latestFailures: Array<ApiStatusReport>;
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
              minute: 'HH:mm'
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

    this.fetchMetadata();
    this.fetch();
  }

  async fetchMetadata(): Promise<void> {
    this.metadata = await getReportMetadata(this.key);
    const region = this.metadata.region === 'global' ? '' : this.metadata.region + ' ';
    this.reportName = `${this.metadata.service} ${region}${this.metadata.api} ${this.metadata.action}`;
  }

  async fetch(): Promise<void> {
    try {
      const statusReports: ApiStatusReport[] = await getStatusReports(this.key);
      const latestFailures: ApiStatusReport[] = await getStatusReportFailures(this.key, 10);
      this.update(statusReports, latestFailures);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => this.fetch(), 25 * 1000);
    }
  }

  update(statusReports: ApiStatusReport[], latestFailures: ApiStatusReport[]): void {
    const latencyValues = statusReports.map(sr => {
      return { x: sr.start_date, y: sr.latency_ms };
    });
    this.lineChartLatency.data.datasets[0].data = latencyValues;
    this.lineChartLatency.data.datasets[0].label = `${this.reportName} latency (ms)`;
    this.lineChartLatency.update();

    const okValues = statusReports.map(sr => {
      const value = sr.success ? 1 : 0;
      return { x: sr.start_date, y: value };
    });
    this.lineChartOk.data.datasets[0].data = okValues;
    this.lineChartOk.data.datasets[0].label = `0 = not healthy; 1 = is healthy`;
    this.lineChartOk.update();

    this.latestFailures = latestFailures;
    this.healthiness = determineHealth(statusReports.map(sr => sr.success));
  }

}

function determineHealth(data: Array<Boolean>): ApiStatus {
  const N = 10;
  // get last N minutes
  const lastNMins = data.slice(-N);
  const successes = lastNMins.filter(x => x === true);
  if (successes.length === N) {
    // all last N minutes need to be successful to be healthy
    return ApiStatus.Healthy;
  } else {
    if (lastNMins[lastNMins.length - 1] === false) {
      // if last N minutes contains failures and last minute failed
      return ApiStatus.Failing;
    } else {
      // if last N minutes contains failures and last minute succeeded
      return ApiStatus.Recovering;
    }
  }
}
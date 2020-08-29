import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { StatusReportMetadata } from '..';
import { ActivatedRoute, Router } from '@angular/router';

interface InputTextEvent {
  srcElement: {
    value: string;
  }
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;

  reportMetadata: Array<StatusReportMetadata>

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.route.queryParamMap
      .subscribe(params => {
        const q = params.get('q') || this.searchbar.value;
        if (q) {
          this.searchbar.value = q;
        } else {
          this.filter();
        }

        this.searchbar.setFocus();
      });
  }

  navigate(item: StatusReportMetadata) {
    this.router.navigate([`/reports/${item.key}`]);
  }

  async onChange($event: InputTextEvent) {
    await this.filter($event.srcElement.value);
  }

  async search(q?: string): Promise<Array<StatusReportMetadata>> {
    const promise = q === undefined ?
      axios.get<Array<StatusReportMetadata>>(`${environment.apiHost}/report_metadata.json`) :
      axios.get<Array<StatusReportMetadata>>(`${environment.apiHost}/report_metadata.json?q=${q}`);
    const response = await promise;
    return response.data;
  }

  async filter(q?: string): Promise<void> {
    // update url with new query so back button works
    this.router.navigate([], { queryParams: { q: q } });

    const results = await this.search(q);
    results.sort((a, b) => (a.key > b.key) ? 1 : -1);
    this.reportMetadata = results;
  }

}

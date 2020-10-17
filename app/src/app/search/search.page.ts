import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { StatusReportMetadata } from '..';
import { queryReportMetadata } from '../actions/reportMetadata';

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

  async filter(q?: string): Promise<void> {
    // update url with new query so back button works
    this.router.navigate([], { queryParams: { q: q } });

    const results = await queryReportMetadata(q);
    results.sort((a, b) => (a.key > b.key) ? 1 : -1);
    this.reportMetadata = results;
  }

}

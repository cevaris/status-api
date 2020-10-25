import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AppRoute } from 'src/app';
import { appRoutes } from './routes';

// https://devdactic.com/horizontal-navigation-ionic-desktop/

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() displayBackArrow: boolean;
  routes: Array<AppRoute> = appRoutes;

  isDesktop = new BehaviorSubject<boolean>(false);

  constructor(private platform: Platform, private router: Router) {}

  ngOnInit(): void {
    this.resize(this.platform.width());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resize(event.target.innerWidth);
  }

  navigateTo(appRoute: AppRoute) {
    if (appRoute.external) {
      window.location.href = appRoute.route;
    } else {
      this.router.navigate([appRoute.route]);
    }
  }

  private resize(size: number) {
    if (size < 568) {
      this.isDesktop.next(false);
    } else {
      this.isDesktop.next(true);
    }
  }
}

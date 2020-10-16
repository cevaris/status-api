import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

// https://devdactic.com/horizontal-navigation-ionic-desktop/

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() displayBackArrow: boolean;

  private isDesktop = new BehaviorSubject<boolean>(false);

  constructor(private menu: MenuController, private platform: Platform) {
  }
  ngOnInit(): void {
    // this.menu.enable(true, 'first');
    // this.menu.open('first');

    this.resize(this.platform.width());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resize(event.target.innerWidth);
  }

  private resize(size: number) {
    if (size < 568) {
      this.isDesktop.next(false);
    } else {
      this.isDesktop.next(true);
    }

    console.log(this.isDesktop.value);
  }

  isDesktopView(): Observable<boolean> {
    return this.isDesktop.asObservable().pipe(distinctUntilChanged());
  }

  openFirst() {
    // this.menu.enable(true, 'first');
    // this.menu.open('first');
  }

}
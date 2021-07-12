import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
// import { AuthService } from './auth/auth/auth.service';
import { LoggingService } from './logging.service';
import * as fromRoot from './store/app.reducer';
import * as AuthActions from './auth/auth/store/auth.actions';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    // private authService: AuthService,
    private store: Store<fromRoot.AppState>,
    private loggingService: LoggingService,
    @Inject(PLATFORM_ID) private platformID
  ) {}

  ngOnInit() {
    // this.authService.autoLogin();

    if (isPlatformBrowser(this.platformID) === true) {
      this.store.dispatch(new AuthActions.AutoLogin());
    }

    this.loggingService.printLog("Hello from AppComponent ngOnInit");
  }
}
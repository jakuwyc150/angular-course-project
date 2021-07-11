import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import * as AuthActions from './store/auth.actions';
import * as fromRoot from 'src/app/store/app.reducer';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild(PlaceholderDirective) alertPlaceholder: PlaceholderDirective;

  private alertCloseSubscription: Subscription;
  private storeSubscription: Subscription;

  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromRoot.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.error = authState.authError;
      this.isLoading = authState.loading;

      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    // let authenticationObservable: Observable<AuthResponseData>;
    // this.isLoading = true;

    if (this.isLoginMode) {
      // authenticationObservable = this.authService.login(email, password);

      this.store.dispatch(new AuthActions.LoginStart({
        email, password
      }));
    } else {
      // authenticationObservable = this.authService.signup(email, password);

      this.store.dispatch(new AuthActions.SignupStart({
        email, password
      }));
    }

    // authenticationObservable.subscribe(responseData => {
    //   console.log(responseData);

    //   this.isLoading = false;
    //   this.router.navigate(['/recipes']);
    // }, errorMessage => {
    //   console.log(errorMessage);

    //   this.error = errorMessage;
    //   this.isLoading = false;
    //   this.showErrorAlert(errorMessage);
    // });

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(message: string) {
    // const alertComponent = new AlertComponent();
    const alertFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const viewContainerRef = this.alertPlaceholder.viewContainerRef;
    viewContainerRef.clear();

    const alertComponent: ComponentRef<AlertComponent> = viewContainerRef.createComponent(alertFactory);
    alertComponent.instance.message = message;

    this.alertCloseSubscription = alertComponent.instance.close.subscribe(() => {
      this.alertCloseSubscription.unsubscribe();
      viewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.alertCloseSubscription) {
      this.alertCloseSubscription.unsubscribe();
    }

    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }
}

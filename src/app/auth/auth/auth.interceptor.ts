import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, exhaustMap, take } from 'rxjs/operators';
import { Store } from "@ngrx/store";
import * as fromRoot from "src/app/store/app.reducer";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.AppState>
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }

        const newRequest = req.clone({
          params: new HttpParams().set('auth', user.token)
        });

        return next.handle(newRequest);
      })
    );
  }
}
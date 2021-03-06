import { NgModule } from "@angular/core";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth/auth/auth.interceptor";
// import { ShoppingListService } from "./shopping-list/shopping-list.service";
// import { LoggingService } from "./logging.service";

@NgModule({
  providers: [
    // LoggingService,
    // ShoppingListService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
})
export class CoreModule {}
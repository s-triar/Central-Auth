import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { NotifSnackbarService } from '../services/notif-snackbar.service';
import { tap, catchError } from 'rxjs/operators';
import { ResponseContextGetter } from '../utils/response-context-getter';

@Injectable()
export class NotifyInterceptor implements HttpInterceptor {

  constructor(private _notifService: NotifSnackbarService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            try {
              const context = ResponseContextGetter.GetCustomResponseContext<any>(event.body);
              if (!request.headers.has('reqnonotify')) {
                this._notifService.showSnack(context);
              }
            } catch (error) {

            }
          }

        },
        // (error: any) => {
        //   if (error instanceof HttpErrorResponse) {
        //     const context = ResponseContextGetter.GetErrorContext<any>(error);
        //     this._notifService.showSnack(context);
        //   }
        // }
      ),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          const context = ResponseContextGetter.GetErrorContext<any>(error);
          this._notifService.showSnack(context);
        }
        return throwError(error);
      })
    );
  }
}

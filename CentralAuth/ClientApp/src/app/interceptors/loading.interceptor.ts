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
import { tap, catchError } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private _loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.headers.has('reqnoloadingdialog')) {
      this._loadingService.showLoading();
    }
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          // if (event instanceof HttpResponse) {
            setTimeout(() => {
              this._loadingService.hideLoading();
            }, 300);
          // }
        },
        // (error: any) => {
        //   if (error instanceof HttpErrorResponse) {
        //     this._loadingService.hideLoading();
        //   }
        // }
      ),
      catchError((error: any) => {
        this._loadingService.hideLoading();
        return throwError(error);
      })
    );
  }
}

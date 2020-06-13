import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './loading.interceptor';
import { NotifyInterceptor } from './notify.interceptor';
import { TokenInterceptor } from './token.interceptor';
import { IllegalInterceptor } from './illegal.interceptor';

export const interceptorProviders =
[
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: IllegalInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NotifyInterceptor, multi: true },
];

import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authenticationService: AuthenticationService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue();

        if (currentUser) {

            if (currentUser.token)
                request = this.addTokenHeader(request, currentUser.token['access']);

            return next.handle(request).pipe(catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(request, next, currentUser.token['refresh']);
                }
                return throwError(error);
            }))
        }

        return next.handle(request);
    }

    private addTokenHeader(request: HttpRequest<any>, token: string){
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler, refreshToken: any){
        if(!this.isRefreshing){
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            // this.authenticationService.setUserSubject(null);

            if (refreshToken){
                return this.authenticationService.refreshToken(refreshToken).pipe(
                    switchMap((token: any) => {
                        this.isRefreshing = false;
                        // let currentUser = this.authenticationService.currentUserValue();
                        this.authenticationService.updateData(token);

                        return next.handle(this.addTokenHeader(request, token['access']));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;
                        this.authenticationService.logout();
                        return throwError(err);
                    })
                )
            }
        }
        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addTokenHeader(request, token)))
          );
    }
}

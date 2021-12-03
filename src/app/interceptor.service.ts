import { Observable } from "rxjs";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

export class AddHeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedReq = req.clone({
      headers: req.headers.append('content-Type', `application/json;odata=verbose`).append('accept', 'application/json;odata=verbose'),
    });
    return next.handle(modifiedReq);
  }

}
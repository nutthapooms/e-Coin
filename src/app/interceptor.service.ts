import { from, Observable, throwError } from "rxjs";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError} from "rxjs/operators"

export class AddHeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedReq = req.clone({
      headers: req.headers.append('content-Type', `application/json;odata=verbose`).append('accept', 'application/json;odata=verbose'),
    });
    return next.handle(modifiedReq).pipe(
      catchError((error:HttpErrorResponse)=>{
        if(error.error instanceof ErrorEvent){
          alert('this is client side Error :' + error.error.message);
        }
        else{
          alert('this is server side Error :'+error.url+" " + error.status+" "+error.statusText);

        }
        return throwError(error.error.message);
        
      })
    );
  }

}
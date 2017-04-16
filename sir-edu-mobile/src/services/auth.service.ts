import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export default class AuthService {
  private authUrl = '/api/authenticate';  // URL to web API
  constructor (private http: Http) {}

  login (credentials: Object): Promise<any> {
  return this.http.post(this.authUrl, credentials)
             .toPromise()
             .then(this.extractData)
             .catch(this.handleError);
}

private extractData(res: Response) {
  let body = res.json();
  return body || {};
}

private handleError (error: Response | any) {
  // In a real world app, we might use a remote logging infrastructure
  let errMsg: string;
  if (error instanceof Response) {
    const body = error.json() || '';
    const err = JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  console.error(errMsg);
  return Promise.reject(errMsg);
}
}
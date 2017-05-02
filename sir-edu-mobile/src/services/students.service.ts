import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { BASE_URL, BASE_URL_API } from '../app/app.settings'; 
import 'rxjs/add/operator/toPromise';

@Injectable()
export default class StudentsService {
  private studentsUrl = BASE_URL_API + 'students';  // URL to web API
  private headers = new Headers();
  private token: string;

  constructor (private http: Http) {
    this.token =  localStorage.getItem('authToken');
    this.headers.append('Authorization', 'Bearer ' + this.token);
  }

  getStudentList (): Promise<any> {
    console.log(this.token);
    return this.http.get(this.studentsUrl, { headers: this.headers } )
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }

  saveStudent (student): Promise<any> {
    return this.http.post(this.studentsUrl, student, { headers: this.headers })
                    .toPromise()
                    .then(res => res.json())
                    .catch(this.handleError);
  }

  deleteStudent(studentId): Promise<any> {
    return this.http.delete(this.studentsUrl + studentId, { headers: this.headers })
                    .toPromise()
                    .then(res => res.json())
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();

    body.map((k) => {
      if(k.avatar) {
        k.avatar.path = BASE_URL + k.avatar.path;
      }
    })
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
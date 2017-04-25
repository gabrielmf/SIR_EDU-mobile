import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BASE_URL, BASE_URL_API } from '../app/app.settings'; 
import 'rxjs/add/operator/toPromise';

@Injectable()
export default class StudentsService {
  private studentsUrl = BASE_URL_API + 'students';  // URL to web API
  
  constructor (private http: Http) {}

  getStudentList (): Promise<any> {
    return this.http.get(this.studentsUrl)
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }

  deleteStudent(studentId): Promise<any> {
    return this.http.delete(this.studentsUrl, { params: {id: studentId }})
                    .toPromise();
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
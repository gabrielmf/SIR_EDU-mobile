import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http';
import { Http, Response, Headers } from '@angular/http';
import { BASE_URL, BASE_URL_API } from '../app/app.settings'; 
import 'rxjs/add/operator/toPromise';

@Injectable()
export default class FilesService {
  private filesUrl = BASE_URL_API + 'files';  // URL to web API
  private headers = new Headers();
  private token: string;

  constructor (private nativeHttp: HTTP, private http: Http) {
    this.token =  localStorage.getItem('authToken');
    this.headers.append('Authorization', 'Bearer ' + this.token);
  }

  uploadFile(file, body): Promise<any> {
    let headers = { Authorization: 'Bearer ' + this.token };
    return this.nativeHttp.uploadFile(this.filesUrl, body, headers, file.src, file.name);
  }

  getFilesList(studentId: String): Promise<any> {
      return this.http.get(this.filesUrl, { headers: this.headers, params: { studentId } })
          .toPromise()
          .then(this.extractData.bind(this))
          .catch(this.handleError);
  }

  removeFile(fileId) {
      return this.http.delete(this.filesUrl + '/' + fileId, { headers: this.headers })
          .toPromise()
          .then(res => res.json())
          .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json() || {};
    
    body.forEach((data) => {
      data['url'] = this.filesUrl + '/' + data._id + '?token=' + this.token;
    });

    return Promise.resolve(body);
  }

  private handleError (error: Response | any) {
    console.log(error);
    return Promise.reject(error);
  }
}
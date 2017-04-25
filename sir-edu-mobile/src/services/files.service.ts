import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http';
import { Http, Response } from '@angular/http';
import { BASE_URL, BASE_URL_API } from '../app/app.settings'; 
import 'rxjs/add/operator/toPromise';

@Injectable()
export default class FilesService {
  private filesUrl = BASE_URL_API + 'files/';  // URL to web API
  
  constructor (private nativeHttp: HTTP, private http: Http) {}

  uploadFile(file, body): Promise<any> {
    return this.nativeHttp.uploadFile(this.filesUrl, body, {}, file.src, file.name);
  }

  getFilesList(studentId: String): Promise<any> {
      return this.http.get(this.filesUrl, { params: { studentId } })
          .toPromise()
          .then(this.extractData.bind(this))
          .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json() || {};
    
    body.forEach((data) => {
      data['url'] = this.filesUrl + data._id;
    });

    return Promise.resolve(body);
  }

  private handleError (error: Response | any) {
    console.log(error);
    return Promise.reject(error);
  }
}
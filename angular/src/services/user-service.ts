import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

    list(){
        return this.http.get('http://127.0.0.1:8000/api/users/');
    }

}
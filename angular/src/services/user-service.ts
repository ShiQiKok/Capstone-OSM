import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

    list(){
        return this.http.get('/api/users/');
    }

}
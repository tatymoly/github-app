import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };
  myParams;
  private url = 'https://api.github.com/users/';

  constructor(private http: HttpClient) {}

  searchUserRepositories(user) {
    return this.http.get<any>(this.url + user + '/repos').pipe(
      map(res => {
        return res;
      })
    );
  }
}

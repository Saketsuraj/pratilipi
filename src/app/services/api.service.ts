import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService { 

  baseUrl = "http://localhost:4000/user/";

  constructor(private http: HttpClient) { }

  register(data){
    return this.http.post(this.baseUrl+'signup', data);
  }

  login(data){
    return this.http.post(this.baseUrl+'login', data);
  }

  storylist(){
    return this.http.get(this.baseUrl+'all/stories');
  }

  story(title){
    return this.http.get(this.baseUrl+'story/'+title);
  }
}
 
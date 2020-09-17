import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { Location } from '@angular/common';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {

  email = "";
  title = "";
  content = "";
  totalcount = 0;
  currentCount = 0;
  constructor(public location: Location,public apiService: ApiService, public route: Router, public activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userdetails')){
      this.email = JSON.parse(sessionStorage.getItem('userdetails'))['email'];
      this.apiService.story(this.activateRoute.params['_value']['title']).subscribe(res=>{
        this.title = res['title'];
        this.content = res['content'];
      });

      let countObj = {
        "email": this.email,
        "_id": this.activateRoute.params['_value']['id']
      }
      this.apiService.totalcount(countObj).subscribe(res=>{
        this.totalcount = res['count'];
      });

      let socket = io.connect('https://pratilipi123.herokuapp.com:7777');
      socket.on("connect", ()=> {
          // Setup your connection on the server-side by providing it
          // some config variables.
          var config = {
              story: this.activateRoute.params['_value']['id'],
              username: this.email
          };
          socket.emit("setup", config);

          socket.on('message', (data)=> {
              this.currentCount = data.count;
              console.log(this.currentCount);
          });
      });
    }
  }

  goback(){
    this.location.back();
  }

}

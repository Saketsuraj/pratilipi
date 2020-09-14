import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {

  email = "";
  title = "";
  content = "";
  constructor(public apiService: ApiService, public route: Router, public activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userdetails')){
      this.email = JSON.parse(sessionStorage.getItem('userdetails'))['email'];
      this.apiService.story(this.activateRoute.params['_value']['title']).subscribe(res=>{
        this.title = res['title'];
        this.content = res['content'];
      });
    }
  }

}

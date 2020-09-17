import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-storylist',
  templateUrl: './storylist.component.html',
  styleUrls: ['./storylist.component.scss']
})
export class StorylistComponent implements OnInit {

  email  = "";
  storyList:any;
  constructor(public apiService: ApiService, public route: Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userdetails')){
      this.email = JSON.parse(sessionStorage.getItem('userdetails'))['email'];
      this.apiService.storylist().subscribe(res=>{
        this.storyList = res;
      });
    }
    else{
      this.route.navigate(['/login']);
    }
  }

}

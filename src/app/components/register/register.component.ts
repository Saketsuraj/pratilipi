import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../services/api.service';
import { ToastrService } from 'ngx-toastr';

declare var gapi : any;

declare var FB: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required],
  });
  gapiSetup = false;
  authInstance:any;
  submitBtnText = 'SIGN UP';

  formSubmitted = true;
  isSubmitBtnDisabled = false;

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    public apiService: ApiService
  ) { }

  ngOnInit(): void {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '597829377577631',
        cookie: true,
        xfbml: true,
        version: 'v8.0',
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  resetForm() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  facebookRegistration(){
    FB.login((response)=>
      {
        if (response.authResponse)
        {
          this.apiService.register(response.authResponse).subscribe(
            (res) => {
              this.toastr.success(
                'Successfully Registered',
                'You are registered sucessfully on this app'
              );
              this.isSubmitBtnDisabled = false;
              this.submitBtnText = 'SIGN UP';
              this.resetForm();
            },
            (err) => {
              this.isSubmitBtnDisabled = false;
              this.toastr.error('Error occurred', err.error.error);
              this.submitBtnText = 'SIGN UP';
            }
          );
        }
        else
        {
        console.log('User login failed');
      }
    });

  }

  async initGoogleAuth(): Promise<void> {
    //  Create a new Promise where the resolve 
    // function is the callback passed to gapi.load
    const pload = new Promise((resolve) => {
      gapi.load('auth2', resolve);
    });

    // When the first promise resolves, it means we have gapi
    // loaded and that we can call gapi.init
    return pload.then(async () => {
      await gapi.auth2
        .init({ client_id: '125105046637-flmg16l2ij1seo7j5h07eigb68kfhmva.apps.googleusercontent.com' })
        .then(auth => {
          this.gapiSetup = true;
          this.authInstance = auth;
        });
    });
  }

  async googleRegistration(): Promise<gapi.auth2.GoogleUser>{
 
      // Initialize gapi if not done yet
      if (!this.gapiSetup) {
        await this.initGoogleAuth();
      }
  
      // Resolve or reject signin Promise
      return new Promise(async () => {
        await this.authInstance.signIn().then(
          user => console.log(user),
          error => console.log(error));
      });
    
  }

  ngAfterViewInit(){
    function onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }
  }

  onSubmit() {
    this.formSubmitted = false;
    if (this.signupForm.invalid) {
      return;
    }
    this.formSubmitted = true;
    this.submitBtnText = 'Submitting, please wait...';
    this.isSubmitBtnDisabled = true;
    this.apiService.register(this.signupForm.value).subscribe(
      (res) => {
        this.toastr.success(
          'Successfully Registered',
          'You are registered sucessfully on this app'
        );
        this.isSubmitBtnDisabled = false;
        this.submitBtnText = 'SIGN UP';
        this.resetForm();
      },
      (err) => {
        this.isSubmitBtnDisabled = false;
        this.toastr.error('Error occurred', err.error.error);
        this.submitBtnText = 'SIGN UP';
      }
    );
  }
}

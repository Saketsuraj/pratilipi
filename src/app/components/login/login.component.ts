import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

declare var gapi : any;

declare var FB: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    password: ['', Validators.required],
    email: ['', Validators.required],
  });
  gapiSetup = false;
  authInstance:any;
  submitBtnText = 'LOG IN';

  formSubmitted = true;
  isSubmitBtnDisabled = false;

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    public apiService: ApiService,
    public route: Router
  ) { }

  ngOnInit(): void {
   if(sessionStorage.getItem('userdetails')){
    this.route.navigate(['/storylist']);
   }
  }

  resetForm() {
    this.loginForm = this.fb.group({
      password: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  onSubmit() {
    this.formSubmitted = false;
    if (this.loginForm.invalid) {
      return;
    }
    this.formSubmitted = true;
    this.submitBtnText = 'Submitting, please wait...';
    this.isSubmitBtnDisabled = true;
    this.apiService.login(this.loginForm.value).subscribe(
      (res) => {
        this.toastr.success(
          'Logged In Successfully',
          ''
        );
        sessionStorage.setItem('userdetails', JSON.stringify(res));
        this.isSubmitBtnDisabled = false;
        this.submitBtnText = 'LOG IN';
        this.resetForm();
        this.route.navigate(['/storylist']);
      },
      (err) => {
        this.isSubmitBtnDisabled = false;
        this.toastr.error('Error occurred', err.error.error);
        this.submitBtnText = 'LOG IN';
      }
    );
  }
}

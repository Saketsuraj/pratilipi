import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signupForm = this.fb.group({
    password: ['', Validators.required],
    email: ['', Validators.required],
  });
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
   

  }

  resetForm() {
    this.signupForm = this.fb.group({
      password: ['', Validators.required],
      email: ['', Validators.required],
    });
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

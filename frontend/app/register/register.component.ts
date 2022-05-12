import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {SignupInfo} from '../auth/signup-info';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {};
  signupInfo: SignupInfo;
  isSignedUp = false;
  isSignUpFailed = false;
  isBand = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit() { }

  onSubmit(): void{
    console.log(this.form);
    let role;
    let enabled;
    if (this.form.role){
      role = ['band'];
      enabled = false;
    }
    else{
      role = [];
      enabled = true;
    }
    this.signupInfo = new SignupInfo(
      this.form.username,
      role,
      this.form.password,
      this.form.email,
      enabled);

    this.authService.signUp(this.signupInfo).subscribe(
      data => {
        console.log(data);
        if (this.form.role){
          this.isBand = true;
        }
        this.isSignedUp = true;
        this.isSignUpFailed = false;
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}

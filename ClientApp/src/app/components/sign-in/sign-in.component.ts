import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  signUpVisible = false;

  constructor(private userService: UserService) { }
  username: string;
  password: string;
  passwordAgain: string;

  loading = false;
  errors: string[] = undefined;

  signin() {
    const call = this.signUpVisible ? this.userService.signUp : this.userService.signIn;
    this.loading = true;
    this.errors = undefined;
    call.bind(this.userService)(this.username, this.password).subscribe(() => {
      this.loading = false;
    }, (error: (HttpResponse<any> & { error: any })) => {
      this.loading = false;
      if (error.error instanceof Array) {
        this.errors = error.error;
      } else this.errors = [error.statusText];
    });
  }
}

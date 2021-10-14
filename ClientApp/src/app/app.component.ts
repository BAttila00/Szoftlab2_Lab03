import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { User } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  dropdownVisible = false;
  signingOut = false;
  user: User;
  constructor(public userService: UserService) {
    userService.user$.subscribe(u => this.user = u);
  }
  logout() {
    this.signingOut = true;
    const req = this.userService.signOut();
    req.subscribe(() => {
      this.signingOut = false;
    });
  }
}

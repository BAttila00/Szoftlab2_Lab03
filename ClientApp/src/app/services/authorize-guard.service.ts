import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuardService implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate() {
    if (this.userService.user)
      return true;
    return this.userService.user$.pipe(map(user => {
      if (!user) {
        this.router.navigate(["/signin"]);
      }
      return !!user;
    }));
  }
}

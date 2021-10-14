import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { share } from 'rxjs/operators';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public get user$() { return this._user$; }
  private _user$: Observable<User>;
  public get user() { return this._user; }
  private _user: User;
  private userSubject$: ReplaySubject<User>;
  private gettingUser = false;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject$ = new ReplaySubject(1);
    this.userSubject$.subscribe(u => this._user = u);
    this._user$ = this.userSubject$.asObservable().pipe(share());
    this.tryGetUser();
  }

  tryGetUser() {
    if (!this._user && !this.gettingUser) {
      this.gettingUser = true;
      this.http.get<User>("/api/user").subscribe(user => {
        this.gettingUser = false;
        this.userSubject$.next(user);
        this.onSignedIn(user);
      }, err => {
        console.error(err);
        this.gettingUser = false;
        this.userSubject$.next(undefined);
      });
    }
    return this._user$;
  }

  onSignedIn(user: User) {
    this.userSubject$.next(user);
    this.router.navigate(["/"]);
  }

  signIn(userName: string, password: string) {
    const req = this.http.post<User>("/api/user/signin", { userName, password }, { observe: "response" }).pipe(share());
    req.subscribe(user => {
      this.onSignedIn(user.body);
    }, console.error);
    return req;
  }

  signOut() {
    const req = this.http.post("api/user/signout", {}).pipe(share());
    req.subscribe(() => {
      this.userSubject$.next(undefined);
      this.router.navigate(["/signin"]);
    }, console.error);
    return req;
  }

  signUp(userName: string, password: string) {
    const req = this.http.post<User>("/api/user/signup", { userName, password }, { observe: "response" }).pipe(share());
    req.subscribe(user => {
      this.onSignedIn(user.body);
    }, console.error);
    return req;
  }
}

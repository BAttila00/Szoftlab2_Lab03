import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { RoomComponent } from './components/room/room.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthorizeGuardService } from './services/authorize-guard.service';
import { ChatStreamComponent } from './components/chat-stream/chat-stream.component';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    RoomComponent,
    SignInComponent,
    ChatStreamComponent
  ],
  imports: [
    RouterModule.forRoot([
      {
        path: "", canActivate: [AuthorizeGuardService], children: [
          { path: "", pathMatch: "full", component: LobbyComponent },
          { path: "room/:id", component: RoomComponent }
        ]
      },
      { path: "signin", component: SignInComponent }
    ]),
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

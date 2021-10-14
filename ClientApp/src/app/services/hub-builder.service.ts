import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr'; // A signalR objektumban eltároljuk a csomagból
// exportált összes szimbólumot (osztályokat, konstansokat stb.)

@Injectable({
  providedIn: 'root'
})
export class HubBuilderService {

  getConnection() {
    return new signalR.HubConnectionBuilder()
    .withUrl("/chattrhub")
    .configureLogging(signalR.LogLevel.Information)
    .build();
  }
  constructor() { }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Room, User, Message } from '../../models';
import * as signalR from '@aspnet/signalr';
import { HubBuilderService } from 'src/app/services/hub-builder.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  activeTab: 'rooms' | 'peeps' = 'peeps';

  rooms: Room[];
  peeps: User[];

  newRoomName: string;
  newRoomIsPrivate: boolean = false;
  newRoomPasskey: string;

  lobbyMessages: Message[];
  lobbyLoading: boolean = false;

  chatMessage: string;
  connection: signalR.HubConnection; // Ne felejtsük el, hogy a kettősponttal történő deklaráció csak
// a típust deklarálja, értéket nem ad a változónak!

constructor(hubBuilder: HubBuilderService) {
  this.connection = hubBuilder.getConnection();
  // Beregisztráljuk a szervertől érkező üzenetek eseménykezelőjét. Típusosan is tudnánk kezelni egy
  // olyan objektum tulajdonságainak bejárásával, aminek tulajdonságai az eseménykezelők.
  this.connection.on("SetUsers", users => this.setUsers(users));
  this.connection.on("UserEntered", user => this.userEntered(user));
  this.connection.on("UserLeft", userId => this.userLeft(userId));
  this.connection.on("SetMessages", messages => this.setMessages(messages));
  this.connection.on("RecieveMessage", message => this.recieveMessage(message));
  // TODO: További eseménykezelőket is kell majd beregisztrálnunk itt.
  this.peeps = [];
  this.lobbyMessages = [];
  this.connection.start().then(() => {
  this.connection.invoke("EnterLobby");
  });
  }

  ngOnInit() {
/* A korábbi mock adatokat töröljük */
  }

  ngOnDestroy() {
    // Amikor a komponens megsemmisül (pl. navigáció esetén), zárjuk a kapcsolatot. Ne felejtsük el az
    // eseménykezelőket leiratkoztatni, különben memory leakünk lesz!
    this.connection.off("SetUsers");
    this.connection.off("UserEntered");
    this.connection.off("UserLeft");
    this.connection.off("SetMessages");
    // TODO: A később felregisztrált eseménykezelőket is itt iratkoztassuk le!
    this.connection.stop(); // A stop() függvény valójában aszinkron, egy Promise-szal tér vissza. A
    // kapcsolat lebontása időt vesz igénybe, de nem használjuk újra a connection objektumot, ezért
    // nem okoz gondot, ha néhány másodpercig még élni fog az az objektum.
  }

  recieveMessage(message: Message) {
    // A szerver új üzenet érkezését jelzi:
    this.lobbyMessages.splice(0, 0, message);
  }

  userEntered(user: User) {
    // a szerver azt jelezte, hogy az aktuális szobába csatlakozott egy user. Ezt el kell
    // tárolnunk a felhasználókat tároló tömbben.
    this.peeps.push(user);
  }

  userLeft(userId: string) {
    // a szerver azt jelezte, hogy a megadott ID-jú felhasználó elhagyta a szobát, így ki kell
    // vennünk a felhasználót a felhasználók tömbjéből ID alapján.
    delete this.peeps[userId];
  }

  setUsers(users: User[]) {
    // A szerver belépés után leküldi nekünk a teljes user listát:
    this.peeps = users;
  }

  setMessages(messages: Message[]) {
    // A szerver belépés után leküldi nekünk a korábban érkezett üzeneteket:
    this.lobbyMessages = messages;
  }

  sendMessage() {
    // A szervernek az invoke függvény meghívásával tudunk küldeni üzenetet.
    this.connection.invoke("SendMessageToLobby", this.chatMessage);
    // A kérés szintén egy Promise, tehát feliratkoztathatnánk rá eseménykezelőt, ami akkor sül el, ha
    // a szerver jóváhagyta a kérést (vagy esetleg hibára futott). A szerver egyes metódusai Task
    // helyett Task<T>-vel is visszatérhetnek, ekkor a válasz eseménykezelőjében megkapjuk a válasz
    // objektumot is:
    // this.connection.invoke("SendMessageToLobby", this.chatMessage)
    // .then((t: T) => {
    // console.log(t);
    // })
    // .catch(console.error);
    this.chatMessage = "";
  }

  createRoom() {
    // TODO: szoba létrehozása szerveren, majd navigáció a szoba útvonalára, szükség esetén megadni a passkey-t
  }

  roomCreated(room: Room) {
    // TODO: szobalista frissítése
  }

  roomAbandoned(roomName: string) {
    // TODO: szobalista frissítése
  }

  enterRoom(room: Room) {
    // TODO: navigáció a szoba útvonlára, figyelve, hogy kell-e megadni passkey-t
  }
}

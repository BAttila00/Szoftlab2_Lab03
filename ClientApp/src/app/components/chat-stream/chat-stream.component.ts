import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat-stream',
  templateUrl: './chat-stream.component.html',
  styleUrls: ['./chat-stream.component.css']
})
export class ChatStreamComponent {
  @Input() messages: Message[];
  constructor(private userService: UserService) { }

  isOwnMessage(message: Message) {
    return message.senderId === (this.userService.user && this.userService.user.id);
  }
}

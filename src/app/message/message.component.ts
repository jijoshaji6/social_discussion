import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  currentUserId: string = '1';
  currentUser: any;
  users: any[] = [];
  selectedUser: any = null;
  messages: any[] = [];
  newMessage: string = '';

  constructor(private userService: UserService, private authService: AuthService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: firebase.User | null) => {
      if (user) {
        this.currentUserId = user.uid;
        this.authService.getUserData(this.currentUserId).subscribe((currentUser: any) => {
          this.currentUser = currentUser;
          this.userService.getUsersExceptCurrentUser(this.currentUserId).subscribe(users => {
            this.users = users;
          });
        });
      }
    });
  }

  selectUser(userId: string) {
    this.userService.getUserById(userId).subscribe(user => {
      this.selectedUser = user;
      this.messages = this.messageService.getMessagesBetweenUsers(this.currentUserId, userId);
    });
  }

  sendMessage() {
    if (this.selectedUser && this.newMessage.trim()) {
      const message = {
        content: this.newMessage,
        senderId: this.currentUserId,
        senderName: this.currentUser.username,
        receiverId: this.selectedUser.id,
        receiverName: this.selectedUser.username,
        timestamp: new Date()
      };
      this.messageService.sendMessage(message);
      this.messages = this.messageService.getMessagesBetweenUsers(this.currentUserId, this.selectedUser.id);
      this.newMessage = '';
    }
  }
}

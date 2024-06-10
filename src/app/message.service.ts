import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: any[]=[];

  constructor() { }

  getMessages():any[]{
    return[...this.messages];
  }

  sendMessage(message:any):void{
    this.messages.push(message);
  }

  getMessagesBetweenUsers(userId1:string,userId2:string):any[]{
    return this.messages.filter(message=>
      (message.senderId === userId1 && message.receiverId === userId2) ||
      (message.senderId === userId2 && message.receiverId === userId1)
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  id: string;
  username: string;
  email: string;
  deactivated: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users.map(user => ({
        id: user.key,
        ...user.payload.val()
      }));
      console.log(this.users);
    });
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter(user => user.id!== userId);
      },
      error => console.error('Error deleting user:', error)
    );
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    console.log(this.selectedUser);
  }

  updateUser(user: User) {
    if (this.selectedUser) {
      console.log(this.selectedUser);
      
      this.userService.updateUser(user.id, this.selectedUser).subscribe(
        () => {
          this.selectedUser = null;
        },
        error => console.error('Error updating user:', error)
      );
    }
  }
  

  cancelEdit() {
    this.selectedUser = null;
  }

  isEditing(user: User): boolean {
    return !!this.selectedUser && this.selectedUser.id === user.id;
  }

  toggleUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.deactivated =!user.deactivated; 
      this.userService.toggleUser(userId).subscribe(
        () => {},
        (error: any) => console.error('Error toggling user status:', error) 
      );
    }
  }
}

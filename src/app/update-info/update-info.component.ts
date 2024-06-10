import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.css']
})
export class UpdateInfoComponent implements OnInit {
  currentUser: any;
  updatedUser: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.authService.getUserData(user.uid).subscribe(userData => {
          this.currentUser = user;
          this.updatedUser = { ...userData, username: user.displayName };
        });
      }
    });
  }

  updateProfile(): void {
    this.authService.updateUser(this.updatedUser).subscribe(
      () => {
        alert('Profile Updated Successfully');
        this.router.navigate(['/']);
      },
      error => {
        alert('Update Failed: ' + error.message);
      }
    );
  }
}

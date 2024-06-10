import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink,CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.signup(this.email, this.password, this.username).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ChatBubble';
  isAuthenticated = false;
  currentUsername: string | null = null;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(
      switchMap((user: any) => {
        if (user) {
          this.isAuthenticated = true;
          return this.authService.getUserData(user.uid);
        } else {
          this.isAuthenticated = false;
          return of(null);
        }
      })
    ).subscribe((userData: any) => {
      this.currentUsername = userData ? userData.username : null;
      this.isAdmin = userData ? userData.isAdmin : false;
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.isAuthenticated = false;
      this.currentUsername = null;
      this.isAdmin = false;
      this.router.navigate(['/']);
    });
  }
}

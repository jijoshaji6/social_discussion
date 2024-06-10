import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(private authService:AuthService){}

  logout(){
    this.authService.logout();
  }

}

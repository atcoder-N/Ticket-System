import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from './services/auth';
import { ToastService } from './services/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(
    public authService: AuthService,
    public toastService: ToastService,
    private router: Router
  ) {}

  isLoginPage() {
    return this.router.url.includes('/login');
  }

  logout() {
    this.toastService.info('Logged out successfully');
    this.authService.logout();
  }
}
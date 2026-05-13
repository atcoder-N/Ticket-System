import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  username = '';
  password = '';
  error = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.error = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Username aur password required hai';
      return;
    }

    const success = this.authService.login(this.username, this.password);

    if (!success) {
      this.error = 'Invalid username ya password';
      return;
    }

    this.router.navigate(['/dashboard']);
  }

  fillDemo(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type Role = 'admin' | 'it-support' | 'employee';

export interface User {
  username: string;
  password: string;
  role: Role;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {

    if (typeof window !== 'undefined') {

      const defaultUsers: User[] = [
        {
          username: 'admin',
          password: 'admin123',
          role: 'admin'
        },
        {
          username: 'support',
          password: 'support123',
          role: 'it-support'
        },
        {
          username: 'employee',
          password: 'employee123',
          role: 'employee'
        }
      ];

      localStorage.setItem(
        'users',
        JSON.stringify(defaultUsers)
      );
    }
  }

  login(username: string, password: string): boolean {

    if (typeof window === 'undefined') return false;

    const users: User[] = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const user = users.find(
      u =>
        u.username === username &&
        u.password === password
    );

    if (!user) return false;

    localStorage.setItem(
      'token',
      'jwt-token-' + Date.now()
    );

    localStorage.setItem(
      'currentUser',
      JSON.stringify(user)
    );

    return true;
  }

  logout() {

    if (typeof window !== 'undefined') {

      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }

    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {

    if (typeof window === 'undefined') return false;

    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {

    if (typeof window === 'undefined') return null;

    const user = localStorage.getItem('currentUser');

    return user ? JSON.parse(user) : null;
  }

  getRole(): Role | null {
    return this.getCurrentUser()?.role || null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isSupport(): boolean {
    return this.getRole() === 'it-support';
  }

  isEmployee(): boolean {
    return this.getRole() === 'employee';
  }
}
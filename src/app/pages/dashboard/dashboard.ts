import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  title = '';
  desc = '';
  priority = 'Medium';
  status = 'Open';
  assignedTo = 'support';

  tickets: any[] = [];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    if (typeof window === 'undefined') return;

    const data = localStorage.getItem('tickets');
    this.tickets = data ? JSON.parse(data) : [];
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get visibleTickets() {
    if (!this.currentUser) return [];

    if (this.authService.isAdmin()) {
      return this.tickets;
    }

    if (this.authService.isSupport()) {
      return this.tickets.filter(
        t => t.assignedTo === this.currentUser?.username
      );
    }

    return this.tickets.filter(
      t => t.createdBy === this.currentUser?.username
    );
  }

  getTotal() {
    return this.visibleTickets.length;
  }

  getOpen() {
    return this.visibleTickets.filter(t => t.status === 'Open').length;
  }

  getInProgress() {
    return this.visibleTickets.filter(t => t.status === 'In-Progress').length;
  }

  getClosed() {
    return this.visibleTickets.filter(t => t.status === 'Closed').length;
  }

  getLowPriority() {
    return this.visibleTickets.filter(t => t.priority === 'Low').length;
  }

  getMediumPriority() {
    return this.visibleTickets.filter(t => t.priority === 'Medium').length;
  }

  getHighPriority() {
    return this.visibleTickets.filter(t => t.priority === 'High').length;
  }

  getStatusPercent(count: number) {
    const total = this.getTotal();
    return total ? Math.round((count / total) * 100) : 0;
  }

  getPriorityPercent(count: number) {
    const total = this.getTotal();
    return total ? Math.round((count / total) * 100) : 0;
  }

  getRecentActivity() {
    return [...this.visibleTickets]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }

  add() {
    if (!this.title.trim()) return;
    if (!this.currentUser) return;

    const now = new Date().toLocaleString();

    this.tickets.unshift({
      id: Date.now(),
      title: this.title,
      desc: this.desc,
      priority: this.priority,
      status: this.status.replace(' ', '-'),
      createdBy: this.currentUser.username,
      assignedTo: this.assignedTo,
      createdAt: now,
      comments: [],
      attachments: [],
      history: [
        {
          action: 'Ticket created',
          by: this.currentUser.username,
          time: now
        }
      ]
    });

    this.save();

    this.title = '';
    this.desc = '';
    this.priority = 'Medium';
    this.status = 'Open';
    this.assignedTo = 'support';
  }

  save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('tickets', JSON.stringify(this.tickets));
  }

  updateStatus(t: any, newStatus: string) {
    if (!(this.authService.isAdmin() || this.authService.isSupport())) return;

    const user = this.authService.getCurrentUser();
    const now = new Date().toLocaleString();

    t.status = newStatus.replace(' ', '-');
    t.updatedAt = now;

    if (!t.history) t.history = [];

    t.history.push({
      action: 'Status changed to ' + newStatus,
      by: user?.username || 'System',
      time: now
    });

    this.save();
  }

  delete(t: any) {
    if (!this.authService.isAdmin()) return;

    this.tickets = this.tickets.filter(x => x.id !== t.id);
    this.save();
  }
}
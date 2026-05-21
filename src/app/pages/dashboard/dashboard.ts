import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth';
import { TicketService, Ticket } from '../../services/ticket.service';

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
  priority: 'Low' | 'Medium' | 'High' = 'Medium';
  assignedTo = 'support';

  tickets: Ticket[] = [];

  constructor(
    public authService: AuthService,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.tickets = this.ticketService.getTickets();
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

    this.ticketService.addTicket(
      {
        title: this.title,
        desc: this.desc,
        priority: this.priority,
        status: 'Open',
        createdBy: this.currentUser.username,
        assignedTo: this.assignedTo
      },
      this.currentUser.username
    );

    this.loadTickets();

    this.title = '';
    this.desc = '';
    this.priority = 'Medium';
    this.assignedTo = 'support';
  }

  updateStatus(t: Ticket, newStatus: string) {
    if (!(this.authService.isAdmin() || this.authService.isSupport())) return;

    const user = this.authService.getCurrentUser();
    const status = newStatus.replace(' ', '-') as Ticket['status'];

    this.ticketService.changeStatus(
      t.id,
      status,
      user?.username || 'System'
    );

    this.loadTickets();
  }

  delete(t: Ticket) {
    if (!this.authService.isAdmin()) return;

    this.ticketService.deleteTicket(t.id);
    this.loadTickets();
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ticket-list.html',
  styleUrls: ['./ticket-list.css']
})
export class TicketList implements OnInit {

  tickets: Ticket[] = [];

  searchText = '';
  statusFilter = 'All';
  priorityFilter = 'All';

  page = 1;
  pageSize = 5;

  constructor(
    private ticketService: TicketService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    const allTickets = this.ticketService.getTickets();
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.tickets = [];
      return;
    }

    if (this.authService.isAdmin()) {
      this.tickets = allTickets;
    } else if (this.authService.isSupport()) {
      this.tickets = allTickets.filter(
        t => t.assignedTo === currentUser.username
      );
    } else {
      this.tickets = allTickets.filter(
        t => t.createdBy === currentUser.username
      );
    }
  }

  get filteredTickets() {
    return this.tickets.filter(t => {
      const search = this.searchText.toLowerCase();

      const matchSearch =
        t.title.toLowerCase().includes(search) ||
        t.desc.toLowerCase().includes(search) ||
        t.createdBy.toLowerCase().includes(search) ||
        t.assignedTo.toLowerCase().includes(search);

      const matchStatus =
        this.statusFilter === 'All' ||
        t.status === this.statusFilter;

      const matchPriority =
        this.priorityFilter === 'All' ||
        t.priority === this.priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }

  get paginatedTickets() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredTickets.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredTickets.length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  close(id: number) {
    if (!(this.authService.isAdmin() || this.authService.isSupport())) return;

    const user = this.authService.getCurrentUser();

    this.ticketService.changeStatus(
      id,
      'Closed',
      user?.username || 'System'
    );

    this.loadTickets();
  }

  delete(id: number) {
    if (!this.authService.isAdmin()) return;

    this.ticketService.deleteTicket(id);
    this.loadTickets();
  }
}
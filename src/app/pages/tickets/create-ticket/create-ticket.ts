import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-ticket.html',
  styleUrls: ['./create-ticket.css']
})
export class CreateTicket {

  title = '';
  desc = '';
  priority: 'Low' | 'Medium' | 'High' = 'Medium';
  assignedTo = 'support';
  error = '';

  constructor(
    private ticketService: TicketService,
    public authService: AuthService,
    private router: Router
  ) {}

  create() {
    this.error = '';

    if (!this.title.trim()) {
      this.error = 'Ticket title required hai';
      return;
    }

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) return;

    this.ticketService.addTicket(
      {
        title: this.title,
        desc: this.desc,
        priority: this.priority,
        createdBy: currentUser.username,
        assignedTo: this.assignedTo
      },
      currentUser.username
    );

    this.router.navigate(['/tickets']);
  }
}
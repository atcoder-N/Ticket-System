import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TicketService, Ticket } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-detail.html',
  styleUrls: ['./ticket-detail.css']
})
export class TicketDetail {

  ticket?: Ticket;

  editMode = false;
  commentText = '';

  editData = {
    title: '',
    desc: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    status: 'Open' as 'Open' | 'In-Progress' | 'Closed',
    assignedTo: 'support'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    public authService: AuthService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ticket = this.ticketService.getById(id);

    if (this.ticket) {
      this.editData = {
        title: this.ticket.title,
        desc: this.ticket.desc,
        priority: this.ticket.priority,
        status: this.ticket.status,
        assignedTo: this.ticket.assignedTo
      };
    }
  }

  canEdit() {
    return this.authService.isAdmin() || this.authService.isSupport();
  }

  canDelete() {
    return this.authService.isAdmin();
  }

  saveEdit() {
    if (!this.ticket) return;

    const user = this.authService.getCurrentUser();

    this.ticketService.updateTicket(
      this.ticket.id,
      {
        title: this.editData.title,
        desc: this.editData.desc,
        priority: this.editData.priority,
        status: this.editData.status,
        assignedTo: this.editData.assignedTo
      },
      user?.username || 'System'
    );

    this.ticket = this.ticketService.getById(this.ticket.id);
    this.editMode = false;
  }

  changeStatus(status: 'Open' | 'In-Progress' | 'Closed') {
    if (!this.ticket) return;

    const user = this.authService.getCurrentUser();

    this.ticketService.changeStatus(
      this.ticket.id,
      status,
      user?.username || 'System'
    );

    this.ticket = this.ticketService.getById(this.ticket.id);
  }

  addComment() {
    if (!this.ticket || !this.commentText.trim()) return;

    const user = this.authService.getCurrentUser();

    this.ticketService.addComment(this.ticket.id, {
      message: this.commentText,
      author: user?.username || 'Unknown'
    });

    this.commentText = '';
    this.ticket = this.ticketService.getById(this.ticket.id);
  }

  onFileSelected(event: any) {
    if (!this.ticket) return;

    const file = event.target.files[0];

    if (!file) return;

    const user = this.authService.getCurrentUser();

    this.ticketService.addAttachment(this.ticket.id, {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: user?.username || 'Unknown'
    });

    this.ticket = this.ticketService.getById(this.ticket.id);
  }

  deleteTicket() {
    if (!this.ticket) return;

    this.ticketService.deleteTicket(this.ticket.id);
    this.router.navigate(['/tickets']);
  }
}
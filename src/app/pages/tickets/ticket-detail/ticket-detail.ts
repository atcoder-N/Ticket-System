import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-detail.html'
})
export class TicketDetail {

  ticket: any;

  constructor(
    private route: ActivatedRoute,
    private service: TicketService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ticket = this.service.getById(id);
  }

  close() {
    this.service.closeTicket(this.ticket.id);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-list.html'
})
export class TicketList implements OnInit {

  tickets: any[] = [];

  constructor(private service: TicketService) {}

  ngOnInit() {
    this.tickets = this.service.getTickets();
  }

  close(id: number) {
    this.service.closeTicket(id);
  }

  delete(id: number) {
    this.service.deleteTicket(id);
    this.tickets = this.service.getTickets();
  }
}
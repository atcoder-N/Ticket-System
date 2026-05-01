import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  tickets: any[] = JSON.parse(localStorage.getItem('tickets') || '[]');

  save() {
    localStorage.setItem('tickets', JSON.stringify(this.tickets));
  }

  getTickets() {
    return this.tickets;
  }

  addTicket(ticket: any) {
    this.tickets.push({
      id: Date.now(),
      ...ticket,
      status: 'Open'
    });
    this.save();
  }

  closeTicket(id: number) {
    const t = this.tickets.find(x => x.id === id);
    if (t) t.status = 'Closed';
    this.save();
  }

  deleteTicket(id: number) {
    this.tickets = this.tickets.filter(t => t.id !== id);
    this.save();
  }

  getById(id: number) {
    return this.tickets.find(t => t.id === id);
  }
}
import { Injectable } from '@angular/core';

export interface TicketHistory {
  action: string;
  by: string;
  time: string;
}

export interface Ticket {
  id: number;
  title: string;
  desc: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In-Progress' | 'Closed';
  createdBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt?: string;
  comments: any[];
  attachments: any[];
  history: TicketHistory[];
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private tickets: Ticket[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;

    this.tickets = JSON.parse(
      localStorage.getItem('tickets') || '[]'
    );

    this.tickets = this.tickets.map(t => ({
      ...t,
      comments: t.comments || [],
      attachments: t.attachments || [],
      history: t.history || []
    }));
  }

  private save() {
    if (typeof window === 'undefined') return;

    localStorage.setItem(
      'tickets',
      JSON.stringify(this.tickets)
    );
  }

  getTickets() {
    this.load();
    return this.tickets;
  }

  getById(id: number) {
    this.load();
    return this.tickets.find(t => t.id === id);
  }

  addTicket(ticket: Partial<Ticket>, by = 'System') {

    const now = new Date().toLocaleString();

    const newTicket: Ticket = {
      id: Date.now(),
      title: ticket.title || '',
      desc: ticket.desc || '',
      priority: ticket.priority || 'Medium',
      status: 'Open',
      createdBy: ticket.createdBy || '',
      assignedTo: ticket.assignedTo || 'support',
      createdAt: now,
      comments: [],
      attachments: [],
      history: [
        {
          action: 'Ticket created',
          by,
          time: now
        }
      ]
    };

    this.tickets.unshift(newTicket);
    this.save();
  }

  updateTicket(
    id: number,
    data: Partial<Ticket>,
    by = 'System'
  ) {

    const index = this.tickets.findIndex(
      t => t.id === id
    );

    if (index === -1) return;

    const now = new Date().toLocaleString();

    this.tickets[index] = {
      ...this.tickets[index],
      ...data,
      updatedAt: now,
      history: [
        ...(this.tickets[index].history || []),
        {
          action: 'Ticket updated',
          by,
          time: now
        }
      ]
    };

    this.save();
  }

  changeStatus(
    id: number,
    status: Ticket['status'],
    by = 'System'
  ) {

    this.updateTicket(id, { status }, by);
  }

  deleteTicket(id: number) {

    this.tickets = this.tickets.filter(
      t => t.id !== id
    );

    this.save();
  }

  addComment(id: number, comment: any) {

    const ticket = this.getById(id);

    if (!ticket) return;

    const now = new Date().toLocaleString();

    ticket.comments.push({
      id: Date.now(),
      ...comment,
      createdAt: now
    });

    ticket.history.push({
      action: 'Comment added',
      by: comment.author || 'Unknown',
      time: now
    });

    this.save();
  }

  addAttachment(id: number, file: any) {

    const ticket = this.getById(id);

    if (!ticket) return;

    const now = new Date().toLocaleString();

    ticket.attachments.push({
      id: Date.now(),
      ...file,
      uploadedAt: now
    });

    ticket.history.push({
      action: 'Attachment added',
      by: 'User',
      time: now
    });

    this.save();
  }
}
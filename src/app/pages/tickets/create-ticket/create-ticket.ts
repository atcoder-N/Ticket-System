import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../../services/ticket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-ticket.html'
})
export class CreateTicket {

  title = '';

  constructor(private service: TicketService, private router: Router) {}

  create() {
    if (!this.title.trim()) return;

    this.service.addTicket({ title: this.title });
    this.router.navigate(['/tickets']);
  }
}
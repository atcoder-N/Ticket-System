import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  tickets: any[] = [];

  ngOnInit() {
    const data = localStorage.getItem('tickets');
    if (data) this.tickets = JSON.parse(data);
  }

  add() {
    if (!this.title) return;

    this.tickets.push({
      id: Date.now(),
      title: this.title,
      desc: this.desc,
      priority: this.priority,
      status: this.status.replace(' ', '-') // ✅ FIX
    });

    this.save();

    this.title = '';
    this.desc = '';
    this.priority = 'Medium';
    this.status = 'Open';
  }

  save() {
    localStorage.setItem('tickets', JSON.stringify(this.tickets));
  }

  updateStatus(t: any, newStatus: string) {
    t.status = newStatus.replace(' ', '-'); // ✅ FIX
    this.save();
  }

  delete(t: any) {
    this.tickets = this.tickets.filter(x => x.id !== t.id);
    this.save();
  }

  getOpen() {
    return this.tickets.filter(t => t.status === 'Open').length;
  }

  getClosed() {
    return this.tickets.filter(t => t.status === 'Closed').length;
  }
}
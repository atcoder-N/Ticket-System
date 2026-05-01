import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { CreateTicket } from './pages/tickets/create-ticket/create-ticket';
import { TicketList } from './pages/tickets/ticket-list/ticket-list';
import { TicketDetail } from './pages/tickets/ticket-detail/ticket-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },

  { path: 'tickets', component: TicketList },
  { path: 'tickets/create', component: CreateTicket },
  { path: 'tickets/:id', component: TicketDetail },
];
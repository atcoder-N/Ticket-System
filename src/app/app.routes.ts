import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { CreateTicket } from './pages/tickets/create-ticket/create-ticket';
import { TicketList } from './pages/tickets/ticket-list/ticket-list';
import { TicketDetail } from './pages/tickets/ticket-detail/ticket-detail';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'tickets', component: TicketList, canActivate: [authGuard] },
  { path: 'tickets/create', component: CreateTicket, canActivate: [authGuard] },
  { path: 'tickets/:id', component: TicketDetail, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];
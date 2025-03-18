import { Routes } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      {
        path: 'chat/:chatId',
        loadComponent: () =>
          import('./pages/chat/chat.component').then((m) => m.ChatComponent),
      },
    ],
  },
];

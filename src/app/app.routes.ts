import { Routes } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ListChatComponent } from './pages/list-chat/list-chat.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListChatComponent,
      },
      {
        path: 'chat/:chatId',
        loadComponent: () =>
          import('./pages/chat/chat.component').then((m) => m.ChatComponent),
      },
    ],
  },
];

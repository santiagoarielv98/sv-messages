import { Routes } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      {
        path: '',
        component: ChatComponent,
      },
    ],
  },
];

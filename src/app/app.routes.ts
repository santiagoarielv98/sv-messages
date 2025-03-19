import { Routes } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ChatComponent } from './pages/chat/chat.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'chat',
        component: ChatComponent,
      },
    ],
  },
];

import { Routes } from '@angular/router';
import { ChatComponent } from './presentation/chat/chat.component';
import { MainLayoutComponent } from './presentation/layouts/main/main.layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: ChatComponent,
      },
    ],
  },
];

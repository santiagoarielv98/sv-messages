import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavService } from '../../services/sidenav.service';
import { ChatListComponent } from '../chat-list/chat-list.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule,
    MatButtonModule,
    ChatListComponent,
  ],
})
export class SidenavComponent {
  title = 'SVChat';

  sidenavService = inject(SidenavService);

  isHandset$ = this.sidenavService.isHandset$;
}

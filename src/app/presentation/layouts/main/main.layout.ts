import { Component } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';

@Component({
  selector: 'app-main-layout',
  imports: [SidenavComponent],
  templateUrl: './main.layout.html',
  styleUrl: './main.layout.scss',
})
export class MainLayoutComponent {}

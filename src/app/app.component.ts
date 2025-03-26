import { Component, inject } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { AuthDialogService } from './services/auth-dialog.service';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  template: `<app-layout />`,
  styles: [],
})
export class AppComponent {
  private readonly authDialog = inject(AuthDialogService);
}

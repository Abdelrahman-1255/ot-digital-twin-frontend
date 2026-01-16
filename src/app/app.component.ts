import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>settings_input_component</mat-icon>
      <span style="margin-left: 8px;">ControlPoint - Asset Monitoring</span>
      <span style="flex: 1;"></span>
      <button mat-button routerLink="/assets">
        <mat-icon>list</mat-icon>
        Assets
      </button>
    </mat-toolbar>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .content {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
  `]
})
export class AppComponent {
  title = 'ControlPoint';
}

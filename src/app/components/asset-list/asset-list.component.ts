import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { interval, Subscription } from 'rxjs';
import { Asset } from '../../models/asset.model';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <mat-icon>devices</mat-icon>
          Asset List
        </mat-card-title>
        <span style="flex: 1;"></span>
        <button mat-icon-button (click)="loadAssets()" matTooltip="Refresh">
          <mat-icon>refresh</mat-icon>
        </button>
      </mat-card-header>
      
      <mat-card-content>
        @if (loading) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading assets...</p>
          </div>
        } @else if (assets.length === 0) {
          <div class="empty-state">
            <mat-icon>inventory_2</mat-icon>
            <p>No assets found</p>
          </div>
        } @else {
          <table mat-table [dataSource]="assets" class="asset-table">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let asset">{{ asset.id }}</td>
            </ng-container>

            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let asset">{{ asset.name }}</td>
            </ng-container>

            <!-- Type Column -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let asset">{{ asset.type }}</td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let asset">
                <span class="status-badge" [ngClass]="getStatusClass(asset.status)">
                  {{ asset.status }}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let asset">
                <button mat-icon-button [routerLink]="['/assets', asset.id]" matTooltip="View Details">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        }
      </mat-card-content>
    </mat-card>

    <div class="auto-refresh-info">
      <mat-icon>autorenew</mat-icon>
      <span>Auto-refreshing every 5 seconds</span>
    </div>
  `,
  styles: [`
    mat-card {
      margin-bottom: 16px;
    }
    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }
    .asset-table {
      width: 100%;
    }
    .loading-container, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #666;
    }
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    .auto-refresh-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
      margin-top: 16px;
    }
  `]
})
export class AssetListComponent implements OnInit, OnDestroy {
  assets: Asset[] = [];
  loading = true;
  displayedColumns = ['id', 'name', 'type', 'status', 'actions'];
  private refreshSubscription?: Subscription;

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    this.loadAssets();
    // Auto-refresh every 5 seconds
    this.refreshSubscription = interval(5000).subscribe(() => {
      this.loadAssets();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadAssets(): void {
    this.assetService.getAllAssets().subscribe({
      next: (assets) => {
        this.assets = assets;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading assets:', error);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}

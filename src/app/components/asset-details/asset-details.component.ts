import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { interval, Subscription } from 'rxjs';
import { Asset } from '../../models/asset.model';
import { SensorReading } from '../../models/sensor-reading.model';
import { AssetService } from '../../services/asset.service';
import { SensorReadingService } from '../../services/sensor-reading.service';

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <button mat-button routerLink="/assets" class="back-button">
      <mat-icon>arrow_back</mat-icon>
      Back to Assets
    </button>

    @if (loading) {
      <div class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading asset details...</p>
      </div>
    } @else if (!asset) {
      <mat-card class="error-card">
        <mat-card-content>
          <mat-icon>error</mat-icon>
          <p>Asset not found</p>
          <button mat-raised-button routerLink="/assets">Go to Asset List</button>
        </mat-card-content>
      </mat-card>
    } @else {
      <div class="details-grid">
        <!-- Asset Information Card -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>devices</mat-icon>
              Asset Details
            </mat-card-title>
            <span style="flex: 1;"></span>
            <button mat-icon-button (click)="loadData()" matTooltip="Refresh">
              <mat-icon>refresh</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content>
            <div class="detail-row">
              <span class="label">ID:</span>
              <span class="value">{{ asset.id }}</span>
            </div>
            <mat-divider></mat-divider>
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">{{ asset.name }}</span>
            </div>
            <mat-divider></mat-divider>
            <div class="detail-row">
              <span class="label">Type:</span>
              <span class="value">{{ asset.type }}</span>
            </div>
            <mat-divider></mat-divider>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="status-badge" [ngClass]="getStatusClass(asset.status)">
                {{ asset.status }}
              </span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Sensor Reading Card -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>sensors</mat-icon>
              Latest Sensor Reading
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (!sensorReading) {
              <div class="no-data">
                <mat-icon>info</mat-icon>
                <p>No sensor readings available</p>
              </div>
            } @else {
              <div class="sensor-grid">
                <div class="sensor-item temperature">
                  <mat-icon>thermostat</mat-icon>
                  <span class="sensor-label">Temperature</span>
                  <span class="sensor-value">{{ sensorReading.temperature | number:'1.2-2' }} °C</span>
                </div>
                <div class="sensor-item pressure">
                  <mat-icon>speed</mat-icon>
                  <span class="sensor-label">Pressure</span>
                  <span class="sensor-value">{{ sensorReading.pressure | number:'1.2-2' }} kPa</span>
                </div>
                <div class="sensor-item timestamp">
                  <mat-icon>schedule</mat-icon>
                  <span class="sensor-label">Timestamp</span>
                  <span class="sensor-value">{{ formatTimestamp(sensorReading.timestamp) }}</span>
                </div>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>

      <div class="auto-refresh-info">
        <mat-icon>autorenew</mat-icon>
        <span>Auto-refreshing every 5 seconds</span>
      </div>
    }
  `,
  styles: [`
    .back-button {
      margin-bottom: 16px;
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #666;
    }
    .error-card mat-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px;
      color: #666;
    }
    .error-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #f44336;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 768px) {
      .details-grid {
        grid-template-columns: 1fr;
      }
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
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }
    .label {
      font-weight: 500;
      color: #666;
    }
    .value {
      font-size: 16px;
    }
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px;
      color: #666;
    }
    .sensor-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .sensor-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      background-color: #f5f5f5;
    }
    .sensor-item.temperature {
      background-color: #fff3e0;
    }
    .sensor-item.temperature mat-icon {
      color: #ff9800;
    }
    .sensor-item.pressure {
      background-color: #e3f2fd;
    }
    .sensor-item.pressure mat-icon {
      color: #2196f3;
    }
    .sensor-item.timestamp {
      background-color: #f3e5f5;
    }
    .sensor-item.timestamp mat-icon {
      color: #9c27b0;
    }
    .sensor-label {
      flex: 1;
      font-weight: 500;
      color: #666;
    }
    .sensor-value {
      font-size: 18px;
      font-weight: 500;
    }
    .auto-refresh-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
      margin-top: 24px;
    }
  `]
})
export class AssetDetailsComponent implements OnInit, OnDestroy {
  asset: Asset | null = null;
  sensorReading: SensorReading | null = null;
  loading = true;
  private assetId!: number;
  private refreshSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetService,
    private sensorReadingService: SensorReadingService
  ) {}

  ngOnInit(): void {
    this.assetId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
    // Auto-refresh every 5 seconds
    this.refreshSubscription = interval(5000).subscribe(() => {
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadData(): void {
    this.assetService.getAssetById(this.assetId).subscribe({
      next: (asset) => {
        this.asset = asset;
        this.loading = false;
        this.loadLatestSensorReading();
      },
      error: (error) => {
        console.error('Error loading asset:', error);
        this.loading = false;
      }
    });
  }

  loadLatestSensorReading(): void {
    this.sensorReadingService.getLatestSensorReading(this.assetId).subscribe({
      next: (reading) => {
        this.sensorReading = reading;
      },
      error: (error) => {
        console.error('Error loading sensor reading:', error);
        this.sensorReading = null;
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }
}

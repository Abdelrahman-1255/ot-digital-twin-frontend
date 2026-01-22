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
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss'
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

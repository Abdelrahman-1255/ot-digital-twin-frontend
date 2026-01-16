import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SensorReading } from '../models/sensor-reading.model';

@Injectable({
  providedIn: 'root'
})
export class SensorReadingService {
  private apiUrl = 'http://localhost:8080/api/sensor-readings';

  constructor(private http: HttpClient) {}

  getAllSensorReadings(): Observable<SensorReading[]> {
    return this.http.get<SensorReading[]>(this.apiUrl);
  }

  getSensorReadingById(id: number): Observable<SensorReading> {
    return this.http.get<SensorReading>(`${this.apiUrl}/${id}`);
  }

  getSensorReadingsByAssetId(assetId: number): Observable<SensorReading[]> {
    return this.http.get<SensorReading[]>(`${this.apiUrl}/asset/${assetId}`);
  }

  getLatestSensorReading(assetId: number): Observable<SensorReading> {
    return this.http.get<SensorReading>(`${this.apiUrl}/asset/${assetId}/latest`);
  }
}

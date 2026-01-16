# ControlPoint - Asset Monitoring Frontend

A real-time asset monitoring dashboard built with Angular 19 and Angular Material. This application provides a user-friendly interface to monitor industrial assets and their sensor readings.

## Features

- 📊 **Asset List View** - Display all assets with their current status
- 🔍 **Asset Details** - View detailed information for each asset
- 📡 **Real-time Sensor Readings** - Monitor temperature and pressure data
- 🔄 **Auto-refresh** - Data updates automatically every 5 seconds
- 🎨 **Modern UI** - Built with Angular Material components

## Screenshots

### Asset List
<img width="1918" height="964" alt="Screenshot 2026-01-16 140108" src="https://github.com/user-attachments/assets/f9860872-9b53-4b27-98bd-427f99283ceb" />

*View all assets with status indicators (Running, Stopped, Alarm)*

### Asset Details
<img width="1919" height="867" alt="Screenshot 2026-01-16 135952" src="https://github.com/user-attachments/assets/af519347-0a69-4b7c-919f-efa8fad9385d" />

*Detailed view with latest sensor readings (temperature, pressure, timestamp)*

## Tech Stack

- **Framework**: Angular 19
- **UI Library**: Angular Material 19
- **HTTP Client**: Angular HttpClient
- **Styling**: SCSS
- **State Management**: RxJS

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Backend API

The application expects a backend API running at `http://localhost:8080` with the following endpoints:

- `GET /api/assets` - Get all assets
- `GET /api/assets/:id` - Get asset by ID
- `GET /api/sensor-readings/asset/:assetId/latest` - Get latest sensor reading for an asset

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── asset-list/          # Asset list component
│   │   └── asset-details/       # Asset details component
│   ├── models/
│   │   ├── asset.model.ts       # Asset interface
│   │   └── sensor-reading.model.ts  # Sensor reading interface
│   ├── services/
│   │   ├── asset.service.ts     # Asset API service
│   │   └── sensor-reading.service.ts  # Sensor reading API service
│   ├── app.component.ts         # Root component
│   ├── app.config.ts            # Application configuration
│   └── app.routes.ts            # Route definitions
├── styles.scss                  # Global styles
└── index.html                   # HTML entry point
```

## Available Scripts

- `npm start` - Start development server
## Features in Detail

### Asset Status
- **RUNNING** - Asset is operating normally (green)
- **STOPPED** - Asset is currently stopped (orange)
- **ALARM** - Asset requires attention (red)

### Auto-refresh
Both the asset list and asset details pages automatically refresh every 5 seconds to display the latest data.

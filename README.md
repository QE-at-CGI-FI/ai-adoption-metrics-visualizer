# AI Adoption Metrics Visualizer

A comprehensive vanilla JavaScript application for visualizing AI adoption metrics through dual pipeline views. Track and analyze monthly data for both talent and client metrics with separate dedicated dashboards.

## Features

### 📊 Dual Visual Pipeline Dashboards

#### Talent View Pipeline

- **Step 1**: Total People Count
- **Step 2**: License Users (with adoption percentage)
- **Step 3**: Premium Requests Usage
- **Step 4**: AI Coverage Percentage

#### Client View Pipeline

- **Step 1**: Total Clients
- **Step 2**: Clients with AI Permission (with adoption percentage)
- **Step 3**: Fixed Price Projects ≤50% complete (with percentage of AI-enabled clients)

### 📈 Interactive Charts for Both Views

- **Monthly Trends**: Line charts showing all metrics over time for each view
- **Conversion Rates**: Bar charts displaying adoption and usage percentages
- **View Switching**: Seamless toggling between Talent and Client analytics

### 💾 Advanced Data Management

- **Local Storage**: All data persists automatically in browser storage (separate for each view)
- **Unified Import/Export**: Single JSON file handling both talent and client data
- **Legacy Support**: Backwards compatibility with single-view data files
- **Monthly Tracking**: Add, edit, and delete monthly data entries for both views

### 🎨 Professional Design

- **Tabbed Interface**: Clean view switching with active state indicators
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional Color Scheme**: Consistent purple/gray palette across all components
- **Intuitive User Interface**: Context-aware forms and data displays

## Quick Start

1. **Open the Application**

   ```bash
   # Simply open index.html in your web browser
   open index.html
   ```

2. **Choose Your View**
   - Click "Talent View" tab for people-focused metrics
   - Click "Client View" tab for client-focused metrics

3. **Add Your First Data**
   - Click "Add Monthly Data"
   - Fill in the metrics for your chosen month and active view
   - Save to see the pipeline update

4. **View Analytics**
   - Dashboard shows your current metrics for the selected view
   - Charts update automatically with trends
   - Tables display historical data for each view

## Data Structure

### Talent View Data

Each monthly talent entry contains:

```json
{
  "month": "2026-02",
  "peopleCount": 1000,
  "licenseUsers": 750,
  "premiumRequests": 12500,
  "aiCoverage": 85.5
}
```

### Client View Data

Each monthly client entry contains:

```json
{
  "month": "2026-02",
  "totalClients": 150,
  "aiPermissionClients": 120,
  "fixedPriceProjects": 45
}
```

### Export Format

The application exports both data types in a unified structure:

```json
{
  "talent": [
    /* talent data array */
  ],
  "client": [
    /* client data array */
  ],
  "exportDate": "2026-02-25T10:30:00.000Z",
  "version": "2.0"
}
```

## Import/Export

### Exporting Data

1. Click "Export Data" button
2. Downloads unified JSON file containing both talent and client data
3. Filename includes current date for easy identification
4. File format supports version tracking and metadata

### Importing Data

1. Click "Import Data" button
2. Select a valid JSON file (supports both new and legacy formats)
3. **New Format**: Automatically imports both talent and client data
4. **Legacy Format**: Imports single-view data as talent metrics
5. Data merges intelligently (overwrites duplicates by month)

### Data Migration

- **Legacy Support**: Files from the original single-view version import seamlessly
- **Forward Compatibility**: New format designed for future feature additions
- **Backup Strategy**: Regular exports recommended for data safety

## File Structure

```
ai-adoption-metrics-visualizer/
├── index.html          # Main application HTML
├── styles.css          # Complete styling with color scheme
├── app.js             # Main application logic
├── chart.js           # Custom charting library
└── README.md          # This documentation
```

## Technical Details

- **Pure Vanilla JavaScript** - No frameworks or dependencies
- **Dual-View Architecture** - Separate data management for talent and client metrics
- **HTML5 Canvas** - Custom charting library with high DPI support
- **Local Storage API** - Automatic data persistence with separate storage keys
- **File API** - Unified import/export with legacy format support
- **Responsive CSS Grid/Flexbox** - Mobile-friendly tabbed interface
- **State Management** - View switching with context-aware UI updates

## Color Guidelines

### Primary Colors

- `dark_purple` #200A58
- `cgi_purple` #5236AB
- `purple_vivid` #9E83F5
- `purple_medium` #CBC3E6
- `purple_lighter_light` #E6E3F3
- `purple_lightest_light` #F2F1F9

### Neutrals

- `action_link_text_color` #151515
- `default_link_text_color` #333333
- `dark_gray` #A8A8A8
- `action_link_bg` #E8E8E8
- `gray_hero` #EFEFEF
- `gray_bg` #F8F8F8

### Status Colors

- `success` #1AB977
- `warning` #FFAC25
- `error` #B00020

## Browser Compatibility

- Modern browsers with ES6+ support
- HTML5 Canvas support required
- Local Storage API support required

## Data Privacy

- All data stored locally in browser
- No external services or analytics
- Export functionality for data portability

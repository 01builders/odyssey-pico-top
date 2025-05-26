# Bitcoin Cycle Dashboard - Development Plan

## Project Overview
Build a modern, responsive dashboard to track Bitcoin cycle metrics and predict market tops using on-chain indicators.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts (responsive, customizable)
- **Data**: CoinGecko API, Glassnode API alternatives
- **State Management**: React hooks
- **Deployment**: Vercel

## Component Structure

### 1. Layout Components
- **Header**: Navigation, current BTC price, cycle progress
- **Dashboard Layout**: Responsive grid for charts and metrics
- **Footer**: Disclaimers, data sources

### 2. Chart Components
- **MainChart**: Combined view of BTC price with overlays
- **NUPLChart**: Net Unrealized Profit/Loss with zones
- **MVRVChart**: Market Value to Realized Value ratio
- **SOPRChart**: Spent Output Profit Ratio
- **RainbowChart**: Logarithmic regression bands
- **CycleProgressChart**: 48-bar cycle visualization

### 3. Metric Components
- **MetricCard**: Individual metric display with status
- **ActionBox**: Color-coded recommendations
- **PeakPrediction**: Timeline and probability display
- **RiskIndicator**: Overall market risk gauge

### 4. Data Components
- **DataFetcher**: API integration layer
- **MockDataProvider**: Development data
- **ChartDataTransformer**: Format data for charts

## Features

### Phase 1: Core Dashboard
- [ ] Basic layout and navigation
- [ ] Mock data implementation
- [ ] NUPL chart with zones
- [ ] MVRV chart with historical peaks
- [ ] Action boxes for each metric
- [ ] Responsive design

### Phase 2: Advanced Features
- [ ] Real-time data integration
- [ ] SOPR chart implementation
- [ ] Rainbow chart overlay
- [ ] 48-bar cycle progress
- [ ] Peak prediction algorithm
- [ ] Historical comparison tool

### Phase 3: Polish & Enhancement
- [ ] Dark/light mode toggle
- [ ] Export chart functionality
- [ ] Alert system for metric thresholds
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] Educational tooltips

## Data Sources
- **Price Data**: CoinGecko API (free tier)
- **On-chain Metrics**: 
  - Primary: Glassnode alternatives
  - Fallback: Pre-calculated mock data
  - Future: Direct blockchain analysis

## Color Scheme
- **Danger/Sell**: Red (#EF4444)
- **Warning/Caution**: Orange (#F59E0B)
- **Neutral**: Yellow (#EAB308)
- **Opportunity**: Green (#10B981)
- **Buy Zone**: Blue (#3B82F6)

## API Endpoints Needed
1. Current BTC price
2. Historical price data (2+ years)
3. NUPL values
4. MVRV ratio
5. SOPR data
6. Realized price

## Development Timeline
- Week 1: Layout, mock data, first two charts
- Week 2: Remaining charts, action boxes
- Week 3: API integration, real data
- Week 4: Polish, testing, deployment

## Key Considerations
- Mobile-first responsive design
- Fast loading with skeleton states
- Clear visual hierarchy
- Accessibility (ARIA labels, keyboard nav)
- Performance (lazy loading, memoization)
- Error handling for API failures

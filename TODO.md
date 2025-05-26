# Bitcoin Cycle Analysis Dashboard

## Project Overview
A modern, static dashboard for analyzing Bitcoin market cycles using key on-chain metrics and technical indicators. Deployable on GitHub Pages with client-side data fetching.

## Tech Stack
- Next.js 14 (Static Export)
- Tailwind CSS for styling
- TradingView Lightweight Charts for charting
- Public APIs:
  - Glassnode API (on-chain metrics)
  - CoinGecko API (price data)
  - Alternative APIs if rate limits are an issue:
    - CryptoCompare
    - Blockchain.info
    - Messari
- Framer Motion for animations
- Local Storage for caching API responses

## Architecture
- Static site generation with Next.js
- Client-side data fetching with SWR/React Query
- Local storage for API response caching
- No backend required
- GitHub Pages deployment

## Core Components

### 1. Main Dashboard Layout
- [ ] Responsive header with current BTC price and 24h change
- [ ] Navigation sidebar for different metric views
- [ ] Main content area with dynamic charts
- [ ] Mobile-optimized design

### 2. Key Metrics Charts
- [ ] NUPL (Net Unrealized Profit/Loss) Chart
  - Color-coded zones (Belief/Disbelief, Optimism/Anxiety, Euphoria)
  - Historical cycle peaks marked
  - Current cycle prediction overlay

- [ ] MVRV (Market Value to Realized Value) Chart
  - Multiple timeframe views
  - Historical cycle peaks
  - Current cycle prediction

- [ ] SOPR (Spent Output Profit Ratio) Chart
  - Distribution phase indicators
  - Euphoria zone markers
  - Divergence warnings

- [ ] Bitcoin Rainbow Chart
  - Logarithmic regression bands
  - Historical cycle peaks
  - Current price position

### 3. Cycle Analysis Components
- [ ] 48-Bar Cycle Timeline
  - Current position in cycle
  - Historical cycle comparisons
  - Peak prediction window

- [ ] Risk Management Dashboard
  - Multi-metric confirmation status
  - Exit strategy recommendations
  - Re-entry signals

### 4. Data Integration
- [ ] API Integration Layer
  - Rate limiting handling
  - Error handling
  - Fallback APIs
  - Data caching strategy
- [ ] Local Storage Management
  - Cache invalidation
  - Data persistence
  - Offline support

### 5. UI/UX Features
- [ ] Dark/Light mode toggle
- [ ] Interactive tooltips
- [ ] Metric explanations
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Offline indicator

## Implementation Phases

### Phase 1: Project Setup
- [ ] Initialize Next.js project with static export
- [ ] Set up Tailwind CSS
- [ ] Configure API clients
- [ ] Create basic layout
- [ ] Set up GitHub Pages deployment

### Phase 2: Core Charts
- [ ] Implement main metrics charts
- [ ] Add historical data
- [ ] Create prediction overlays
- [ ] Add interactive features

### Phase 3: Analysis Features
- [ ] Add cycle timeline
- [ ] Implement risk management dashboard
- [ ] Create metric explanations
- [ ] Add historical comparisons

### Phase 4: Polish & Optimization
- [ ] Add animations
- [ ] Optimize performance
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Mobile optimization
- [ ] Offline support

## Current Focus
1. Set up project structure with static export
2. Implement basic chart components
3. Integrate core metrics with client-side fetching
4. Add prediction overlays

## Notes
- All predictions are for educational purposes only
- Not financial advice
- Data accuracy depends on API reliability
- Regular updates needed for real-time analysis
- Consider API rate limits and implement appropriate caching
- Use environment variables for API keys
- Implement fallback data sources 
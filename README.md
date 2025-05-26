# Bitcoin Cycle Analysis Dashboard

A modern, static dashboard for analyzing Bitcoin market cycles using key on-chain metrics and technical indicators. Built with Next.js and deployable on GitHub Pages.

## Features

- Real-time Bitcoin cycle analysis
- Key metrics visualization (NUPL, MVRV, SOPR, Rainbow Chart)
- 48-bar cycle timeline
- Risk management dashboard
- Mobile-responsive design
- Offline support with data caching

## Tech Stack

- **Frontend**: Next.js 14 (Static Export)
- **Styling**: Tailwind CSS
- **Charts**: TradingView Lightweight Charts
- **Data**: Client-side API fetching with SWR
- **Deployment**: GitHub Pages / Vercel / Netlify
- **Database**: Supabase (if needed for caching)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bitcoin-cycle-dashboard.git
cd bitcoin-cycle-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your API keys in `.env.local`

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Deployment

### GitHub Pages
1. Update `next.config.js` with your GitHub Pages base path
2. Push to GitHub
3. Enable GitHub Pages in repository settings

### Vercel
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy

### Netlify
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
3. Configure environment variables
4. Deploy

## API Keys Required

- Glassnode API (for on-chain metrics)
- CoinGecko API (for price data)
- Optional: CryptoCompare, Blockchain.info, Messari

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Disclaimer

This project is for educational purposes only. Not financial advice. Use at your own risk. 
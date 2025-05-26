import { Suspense } from "react"
import Header from "@/components/layout/header"
import Dashboard from "@/components/dashboard/dashboard"
import LoadingState from "@/components/ui/loading-state"
import OCPIChart from "@/components/charts/ocpi-chart"
import NUPLChart from "@/components/charts/nupl-chart"
import MVRVChart from "@/components/charts/mvrv-chart"
import SOPRChart from "@/components/charts/sopr-chart"
import RainbowChart from "@/components/charts/rainbow-chart"
import CompositeMetricChart from "@/components/charts/composite-metric-chart"
import CycleProjectionChart from "@/components/charts/cycle-projection-chart"
import HistoricalCycleComparison from "@/components/charts/historical-cycle-comparison"
import ScenarioAnalysis from "@/components/charts/scenario-analysis"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black">
      <Header />
      <main className="container mx-auto p-4 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Bitcoin Cycle Analysis Dashboard</h1>
        
        {/* OCPI Chart - Full width */}
        <OCPIChart detailed={true} />
        
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NUPLChart />
          <MVRVChart />
          <SOPRChart />
          <RainbowChart />
        </div>
        
        {/* Additional Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompositeMetricChart />
          <CycleProjectionChart />
        </div>
        
        {/* Historical Analysis */}
        <div className="grid grid-cols-1 gap-4">
          <HistoricalCycleComparison />
          <ScenarioAnalysis />
        </div>
      </main>

      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">⚠️ This dashboard is for educational purposes only. Not financial advice.</p>
          <p>Data sources: CoinGecko, on-chain analysis • Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-4">© 2025 Odyssey Cycle Predictor</p>
        </div>
      </footer>
    </div>
  )
}

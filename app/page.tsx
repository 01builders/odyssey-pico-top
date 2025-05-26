import { Suspense } from "react"
import Header from "@/components/layout/header"
import Dashboard from "@/components/dashboard/dashboard"
import LoadingState from "@/components/ui/loading-state"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Odyssey Cycle Predictor</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Track key on-chain metrics to identify market cycles and potential peaks. Current prediction: July-September
            2025 cycle top.
          </p>
        </div>

        <Suspense fallback={<LoadingState />}>
          <Dashboard />
        </Suspense>
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

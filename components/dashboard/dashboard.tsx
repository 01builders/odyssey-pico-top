"use client"

import { useState, useEffect, Suspense, lazy } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Card, CardContent } from "@/components/ui/card"

// Import critical components directly
import CyclePrediction from "@/components/metrics/cycle-prediction"
import RiskGauge from "@/components/metrics/risk-gauge"

// Lazy load chart components
const NUPLChart = lazy(() => import("@/components/charts/nupl-chart"))
const MVRVChart = lazy(() => import("@/components/charts/mvrv-chart"))
const SOPRChart = lazy(() => import("@/components/charts/sopr-chart"))
const RainbowChart = lazy(() => import("@/components/charts/rainbow-chart"))
const CompositeMetricChart = lazy(() => import("@/components/charts/composite-metric-chart"))
const CycleProjectionChart = lazy(() => import("@/components/charts/cycle-projection-chart"))
const HistoricalCycleComparison = lazy(() => import("@/components/charts/historical-cycle-comparison"))
const ScenarioAnalysis = lazy(() => import("@/components/charts/scenario-analysis"))

// Loading fallback component
const ChartLoading = ({ title }: { title: string }) => (
  <Card>
    <CardContent className="p-6">
      <div className="h-64 flex flex-col items-center justify-center gap-4">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{ width: "60%" }}></div>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Loading {title}...</p>
      </div>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [chartsVisible, setChartsVisible] = useState(false)
  const [advancedChartsVisible, setAdvancedChartsVisible] = useState(false)

  // Progressive loading of charts
  useEffect(() => {
    console.log("Starting chart loading sequence...")

    // First enable basic charts
    const basicTimer = setTimeout(() => {
      console.log("Enabling basic charts...")
      setChartsVisible(true)
    }, 1000)

    // Then enable more complex charts
    const advancedTimer = setTimeout(() => {
      console.log("Enabling advanced charts...")
      setAdvancedChartsVisible(true)
    }, 3000)

    return () => {
      clearTimeout(basicTimer)
      clearTimeout(advancedTimer)
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Top Section: Composite Metric Chart - Load this last */}
      <ErrorBoundary
        fallback={
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Odyssey Cycle Position Index (OCPI)</h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Unable to load composite metric chart</p>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Suspense fallback={<ChartLoading title="Composite Metric Chart" />}>
          {advancedChartsVisible ? <CompositeMetricChart /> : <ChartLoading title="Composite Metric Chart" />}
        </Suspense>
      </ErrorBoundary>

      {/* Projection Section */}
      <ErrorBoundary
        fallback={
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">2025 Cycle Projection</h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Unable to load cycle projection chart</p>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Suspense fallback={<ChartLoading title="Cycle Projection Chart" />}>
          {advancedChartsVisible ? <CycleProjectionChart /> : <ChartLoading title="Cycle Projection Chart" />}
        </Suspense>
      </ErrorBoundary>

      {/* Historical Comparison */}
      <ErrorBoundary
        fallback={
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Historical Cycle Comparison</h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Unable to load historical comparison chart</p>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Suspense fallback={<ChartLoading title="Historical Cycle Comparison" />}>
          {advancedChartsVisible ? <HistoricalCycleComparison /> : <ChartLoading title="Historical Cycle Comparison" />}
        </Suspense>
      </ErrorBoundary>

      {/* Scenario Analysis */}
      <ErrorBoundary
        fallback={
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Scenario Analysis</h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Unable to load scenario analysis chart</p>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Suspense fallback={<ChartLoading title="Scenario Analysis" />}>
          {advancedChartsVisible ? <ScenarioAnalysis /> : <ChartLoading title="Scenario Analysis" />}
        </Suspense>
      </ErrorBoundary>

      {/* Middle Section: Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ErrorBoundary
            fallback={
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Cycle Peak Prediction</h3>
                  <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Unable to load cycle prediction</p>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <CyclePrediction />
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary
            fallback={
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Overall Market Risk</h3>
                  <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Unable to load risk gauge</p>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <RiskGauge />
          </ErrorBoundary>
        </div>
      </div>

      {/* Charts Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nupl">NUPL</TabsTrigger>
          <TabsTrigger value="mvrv">MVRV</TabsTrigger>
          <TabsTrigger value="sopr">SOPR</TabsTrigger>
          <TabsTrigger value="rainbow">Rainbow</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorBoundary fallback={<ChartLoading title="NUPL Chart" />}>
              <Suspense fallback={<ChartLoading title="NUPL Chart" />}>
                {chartsVisible ? <NUPLChart /> : <ChartLoading title="NUPL Chart" />}
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<ChartLoading title="MVRV Chart" />}>
              <Suspense fallback={<ChartLoading title="MVRV Chart" />}>
                {chartsVisible ? <MVRVChart /> : <ChartLoading title="MVRV Chart" />}
              </Suspense>
            </ErrorBoundary>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorBoundary fallback={<ChartLoading title="SOPR Chart" />}>
              <Suspense fallback={<ChartLoading title="SOPR Chart" />}>
                {chartsVisible ? <SOPRChart /> : <ChartLoading title="SOPR Chart" />}
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<ChartLoading title="Rainbow Chart" />}>
              <Suspense fallback={<ChartLoading title="Rainbow Chart" />}>
                {chartsVisible ? <RainbowChart /> : <ChartLoading title="Rainbow Chart" />}
              </Suspense>
            </ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="nupl" className="mt-6">
          <ErrorBoundary fallback={<ChartLoading title="NUPL Chart" />}>
            <Suspense fallback={<ChartLoading title="NUPL Chart" />}>
              {chartsVisible ? <NUPLChart detailed /> : <ChartLoading title="NUPL Chart" />}
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="mvrv" className="mt-6">
          <ErrorBoundary fallback={<ChartLoading title="MVRV Chart" />}>
            <Suspense fallback={<ChartLoading title="MVRV Chart" />}>
              {chartsVisible ? <MVRVChart detailed /> : <ChartLoading title="MVRV Chart" />}
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="sopr" className="mt-6">
          <ErrorBoundary fallback={<ChartLoading title="SOPR Chart" />}>
            <Suspense fallback={<ChartLoading title="SOPR Chart" />}>
              {chartsVisible ? <SOPRChart detailed /> : <ChartLoading title="SOPR Chart" />}
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="rainbow" className="mt-6">
          <ErrorBoundary fallback={<ChartLoading title="Rainbow Chart" />}>
            <Suspense fallback={<ChartLoading title="Rainbow Chart" />}>
              {chartsVisible ? <RainbowChart detailed /> : <ChartLoading title="Rainbow Chart" />}
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  )
}

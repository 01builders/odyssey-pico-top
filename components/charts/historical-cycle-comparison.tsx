"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import { generateHistoricalComparisonData } from "@/lib/mock-data"
import { AlertCircle, TrendingUp, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HistoricalCycleComparison() {
  const [data, setData] = useState({ priceData: [], metricsData: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("price")

  useEffect(() => {
    console.log("HistoricalCycleComparison: Starting data fetch...")
    try {
      const fetchData = () => {
        const generatedData = generateHistoricalComparisonData()
        console.log("HistoricalCycleComparison: Data generated, filtering...")

        // Filter out any invalid data points
        const filteredPriceData = generatedData.priceData.filter(
          (item) =>
            (item.cycle2017 !== null && item.cycle2017 !== undefined) ||
            (item.cycle2021 !== null && item.cycle2021 !== undefined) ||
            (item.cycle2025 !== null && item.cycle2025 !== undefined),
        )

        const filteredMetricsData = generatedData.metricsData.filter(
          (item) =>
            (item.composite2017 !== null && item.composite2017 !== undefined) ||
            (item.composite2021 !== null && item.composite2021 !== undefined) ||
            (item.composite2025 !== null && item.composite2025 !== undefined),
        )

        console.log(
          `HistoricalCycleComparison: Filtered data - ${filteredPriceData.length} price points, ${filteredMetricsData.length} metric points`,
        )

        setData({
          priceData: filteredPriceData,
          metricsData: filteredMetricsData,
        })
        setIsLoading(false)
      }

      // Add a small timeout to ensure component is mounted
      const timer = setTimeout(fetchData, 300)
      return () => clearTimeout(timer)
    } catch (err) {
      console.error("HistoricalCycleComparison: Error generating data:", err)
      setError(err)
      setIsLoading(false)
    }
  }, [])

  const currentMonthsSinceHalving = 13 // May 2025 is 13 months after April 2024 halving

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <Card className="border border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Historical Cycle Comparison
          </CardTitle>
          <CardDescription>Comparing current cycle (2024-2028) with 2017 and 2021 bull markets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Loading historical comparison data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If there's an error or no data, show an error state
  if (error || (data.priceData.length === 0 && data.metricsData.length === 0)) {
    return (
      <Card className="border border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Historical Cycle Comparison
          </CardTitle>
          <CardDescription>Comparing current cycle (2024-2028) with 2017 and 2021 bull markets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {error ? "Error loading historical comparison data" : "No historical comparison data available"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Historical Cycle Comparison
        </CardTitle>
        <CardDescription>Comparing current cycle (2024-2028) with 2017 and 2021 bull markets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="price">Price Performance</TabsTrigger>
            <TabsTrigger value="metrics">On-Chain Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="space-y-4">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.priceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="monthsSinceHalving"
                    label={{ value: "Months Since Halving", position: "insideBottom", offset: -5 }}
                    domain={[0, 48]}
                    ticks={[0, 6, 12, 18, 24, 30, 36, 42, 48]}
                  />
                  <YAxis
                    label={{ value: "Price Multiple from Halving", angle: -90, position: "insideLeft" }}
                    domain={[0.5, 25]}
                    scale="log"
                    tickFormatter={(value) => `${value}x`}
                  />

                  {/* Current position marker */}
                  <ReferenceLine
                    x={currentMonthsSinceHalving}
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ value: "We are here", position: "top", fill: "#8b5cf6", fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value) => (value ? `${value.toFixed(2)}x` : "N/A")}
                    labelFormatter={(label) => `Month ${label}`}
                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none" }}
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="cycle2017"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    name="2017 Cycle"
                    connectNulls={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="cycle2021"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="2021 Cycle"
                    connectNulls={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="cycle2025"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                    name="2025 Cycle (Current)"
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">2017 Cycle</h4>
                <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                  <li>• Peak: Month 42 (20x from halving)</li>
                  <li>• Duration: 42 months to top</li>
                  <li>• Correction: -84% from peak</li>
                  <li>• At month 13: 2.8x multiple</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">2021 Cycle</h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• Peak: Month 41 (16x from halving)</li>
                  <li>• Duration: 41 months to top</li>
                  <li>• Correction: -77% from peak</li>
                  <li>• At month 13: 3.1x multiple</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">2025 Cycle (Current)</h4>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                  <li>• Projected Peak: Month 39-42</li>
                  <li>• Current: Month 13 (3.4x)</li>
                  <li>• Tracking above 2017/2021</li>
                  <li>• Est. peak: 12-15x from halving</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.metricsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="monthsSinceHalving"
                    label={{ value: "Months Since Halving", position: "insideBottom", offset: -5 }}
                    domain={[0, 48]}
                    ticks={[0, 6, 12, 18, 24, 30, 36, 42, 48]}
                  />
                  <YAxis
                    label={{ value: "Composite Metric Score", angle: -90, position: "insideLeft" }}
                    domain={[0, 100]}
                  />

                  {/* Current position marker */}
                  <ReferenceLine
                    x={currentMonthsSinceHalving}
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ value: "We are here", position: "top", fill: "#8b5cf6", fontSize: 12 }}
                  />

                  {/* Danger zones */}
                  <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" />
                  <ReferenceLine y={65} stroke="#f59e0b" strokeDasharray="3 3" />

                  <Tooltip
                    formatter={(value) => (value ? value.toFixed(1) : "N/A")}
                    labelFormatter={(label) => `Month ${label}`}
                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none" }}
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="composite2017"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    name="2017 Metrics"
                    connectNulls={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="composite2021"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="2021 Metrics"
                    connectNulls={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="composite2025"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                    name="2025 Metrics (Current)"
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Pattern Analysis</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    The current cycle is showing similar on-chain patterns to previous cycles but with stronger momentum
                    at this stage. Both 2017 and 2021 cycles peaked when composite metrics exceeded 85. Current
                    trajectory suggests peak timing between months 39-42, consistent with historical patterns.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Key Cycle Comparisons at Month 13
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Metric</p>
              <p className="font-medium">Price Multiple</p>
              <p className="font-medium">NUPL</p>
              <p className="font-medium">MVRV</p>
              <p className="font-medium">Days to Peak</p>
            </div>
            <div>
              <p className="text-red-600 dark:text-red-400 font-medium">2017</p>
              <p>2.8x</p>
              <p>45%</p>
              <p>2.1</p>
              <p>~840 days</p>
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-medium">2021</p>
              <p>3.1x</p>
              <p>48%</p>
              <p>2.3</p>
              <p>~810 days</p>
            </div>
            <div>
              <p className="text-green-600 dark:text-green-400 font-medium">2025 (Current)</p>
              <p className="font-bold">3.4x</p>
              <p className="font-bold">52%</p>
              <p className="font-bold">2.5</p>
              <p className="font-bold">~780 days (est)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

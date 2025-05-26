"use client"

import { useState, useEffect } from "react"
import { BarChart, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { generateScenarioData } from "@/lib/mock-data"

export default function ScenarioAnalysis() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("ScenarioAnalysis: Starting data fetch...")
    try {
      const fetchData = () => {
        const generatedData = generateScenarioData()
        console.log("ScenarioAnalysis: Data generated, filtering...")

        // Filter out any invalid data points
        const validData = generatedData.filter(
          (item) =>
            item &&
            typeof item.date === "string" &&
            (typeof item.price === "number" ||
              typeof item.bullish === "number" ||
              typeof item.base === "number" ||
              typeof item.bearish === "number"),
        )

        console.log(`ScenarioAnalysis: Filtered data - ${validData.length} valid points out of ${generatedData.length}`)
        setData(validData)
        setIsLoading(false)
      }

      // Add a small timeout to ensure component is mounted
      const timer = setTimeout(fetchData, 400)
      return () => clearTimeout(timer)
    } catch (err) {
      console.error("ScenarioAnalysis: Error generating data:", err)
      setError(err)
      setIsLoading(false)
    }
  }, [])

  // Calculate days until scenarios
  const currentDate = new Date("2025-05-26")
  const bullishPeakDate = new Date("2025-07-15")
  const basePeakDate = new Date("2025-08-15")
  const bearishPeakDate = new Date("2025-09-15")

  const daysToBullish = Math.floor((bullishPeakDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysToBase = Math.floor((basePeakDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysToBearish = Math.floor((bearishPeakDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <Card className="border border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Scenario Analysis
          </CardTitle>
          <CardDescription>
            Multiple projection scenarios based on historical patterns and current momentum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Loading scenario data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If there's an error or no data, show an error state
  if (error || data.length === 0) {
    return (
      <Card className="border border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Scenario Analysis
          </CardTitle>
          <CardDescription>
            Multiple projection scenarios based on historical patterns and current momentum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {error ? "Error loading scenario data" : "No scenario data available"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Safe date formatter function
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en", { month: "short", day: "numeric" })
    } catch (e) {
      return ""
    }
  }

  return (
    <Card className="border border-indigo-200 dark:border-indigo-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Scenario Analysis
        </CardTitle>
        <CardDescription>
          Multiple projection scenarios based on historical patterns and current momentum
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatDate} />
              <YAxis domain={[0, 250000]} tickFormatter={(value) => `$${value / 1000}k`} tick={{ fontSize: 12 }} />

              {/* Current position */}
              <ReferenceLine
                x={currentDate.toISOString()}
                stroke="#6b7280"
                strokeDasharray="3 3"
                label={{ value: "Today", position: "insideTopLeft", fill: "#6b7280", fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) => (value ? `$${value.toLocaleString()}` : "N/A")}
                labelFormatter={(label) => {
                  try {
                    return new Date(label).toLocaleDateString()
                  } catch (e) {
                    return label
                  }
                }}
              />

              <Legend />

              {/* Historical price */}
              <Line
                type="monotone"
                dataKey="price"
                stroke="#1f2937"
                strokeWidth={2}
                dot={false}
                name="Historical"
                connectNulls={true}
              />

              {/* Scenario projections */}
              <Line
                type="monotone"
                dataKey="bullish"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Bullish"
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="base"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Base Case"
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="bearish"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Bearish"
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="font-semibold text-green-800 dark:text-green-200">Bullish Scenario</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Peak Price:</span>
                <span className="font-bold text-green-800 dark:text-green-200">$200,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Peak Date:</span>
                <span className="font-medium text-green-800 dark:text-green-200">July 15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Days to Peak:</span>
                <span className="font-medium text-green-800 dark:text-green-200">{daysToBullish} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Year-End:</span>
                <span className="font-medium text-green-800 dark:text-green-200">$100,000</span>
              </div>
              <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                Similar to 2017 parabolic move. Requires continued institutional adoption and no major regulatory
                setbacks.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Base Scenario</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Peak Price:</span>
                <span className="font-bold text-blue-800 dark:text-blue-200">$155,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Peak Date:</span>
                <span className="font-medium text-blue-800 dark:text-blue-200">August 15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Days to Peak:</span>
                <span className="font-medium text-blue-800 dark:text-blue-200">{daysToBase} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Year-End:</span>
                <span className="font-medium text-blue-800 dark:text-blue-200">$75,000</span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 text-xs mt-2">
                Most likely scenario based on current metrics and historical patterns. Aligns with 4-year cycle theory.
              </p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 className="font-semibold text-red-800 dark:text-red-200">Bearish Scenario</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-700 dark:text-red-300">Peak Price:</span>
                <span className="font-bold text-red-800 dark:text-red-200">$120,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700 dark:text-red-300">Peak Date:</span>
                <span className="font-medium text-red-800 dark:text-red-200">September 15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700 dark:text-red-300">Days to Peak:</span>
                <span className="font-medium text-red-800 dark:text-red-200">{daysToBearish} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700 dark:text-red-300">Year-End:</span>
                <span className="font-medium text-red-800 dark:text-red-200">$55,000</span>
              </div>
              <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                Assumes macro headwinds, regulatory challenges, or early profit-taking. Similar to 2021's double-top
                pattern.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-purple-50 dark:bg-purple-950 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">Scenario Drivers</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Key factors that will determine which scenario plays out include: ETF inflows, regulatory clarity,
                macroeconomic conditions, on-chain metric extremes, and overall market sentiment. Current momentum
                suggests the base case is most probable with 60% likelihood, bullish 25%, and bearish 15%.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

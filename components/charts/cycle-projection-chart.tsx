"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { generateProjectionData } from "@/lib/mock-data"

export default function CycleProjectionChart() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("CycleProjectionChart: Starting data fetch...")
    try {
      const fetchData = () => {
        const generatedData = generateProjectionData()
        console.log("CycleProjectionChart: Data generated, filtering...")

        // Filter out any invalid data points
        const validData = generatedData.filter(
          (item) =>
            item &&
            typeof item.date === "string" &&
            (typeof item.price === "number" || typeof item.projectedPrice === "number"),
        )

        console.log(
          `CycleProjectionChart: Filtered data - ${validData.length} valid points out of ${generatedData.length}`,
        )
        setData(validData)
        setIsLoading(false)
      }

      // Add a small timeout to ensure component is mounted
      const timer = setTimeout(fetchData, 600)
      return () => clearTimeout(timer)
    } catch (err) {
      console.error("CycleProjectionChart: Error generating data:", err)
      setError(err)
      setIsLoading(false)
    }
  }, [])

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <Card className="border border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            2025 Cycle Projection
          </CardTitle>
          <CardDescription>Projected price movement through December 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Loading projection data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If there's an error or no data, show an error state
  if (error || data.length === 0) {
    return (
      <Card className="border border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            2025 Cycle Projection
          </CardTitle>
          <CardDescription>Projected price movement through December 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {error ? "Error loading projection data" : "No projection data available"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate days until scenarios
  const currentDate = new Date("2025-05-26")
  const peakDate = new Date("2025-08-15")
  const daysToProjectedPeak = Math.floor((peakDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

  // Get current and projected peak prices
  const currentPrice = data.find((item) => item.price !== null)?.price || 98000
  const projectedPeakPrice = 155000

  return (
    <Card className="border border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              2025 Cycle Projection
            </CardTitle>
            <CardDescription>Projected price movement through December 2025</CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Projected Peak:</span>
            <span className="text-sm font-bold text-purple-900 dark:text-purple-100">August 15, 2025</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Simplified chart display */}
        <div className="h-80 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-4">
          <div className="flex flex-col h-full justify-between">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium mb-2">Price Projection Summary</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current price: <span className="font-bold">${currentPrice.toLocaleString()}</span> • Projected peak:{" "}
                <span className="font-bold">${projectedPeakPrice.toLocaleString()}</span>
              </p>
            </div>

            <div className="relative flex-1 my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700"></div>
              </div>

              {/* Current position */}
              <div className="absolute left-0 -top-6 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gray-600 dark:bg-gray-400 z-10"></div>
                <span className="text-xs mt-1">Today</span>
                <span className="text-xs font-bold">${currentPrice.toLocaleString()}</span>
              </div>

              {/* Peak position */}
              <div className="absolute left-1/2 -top-6 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-purple-600 dark:bg-purple-400 z-10"></div>
                <span className="text-xs mt-1">Peak</span>
                <span className="text-xs font-bold">${projectedPeakPrice.toLocaleString()}</span>
              </div>

              {/* End of year */}
              <div className="absolute right-0 -top-6 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-red-600 dark:bg-red-400 z-10"></div>
                <span className="text-xs mt-1">Year End</span>
                <span className="text-xs font-bold">$75,000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">Acceleration Phase</h4>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  May-August: Final parabolic move with increasing volatility.
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-200 text-sm">Decline Phase</h4>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  August-December: Initial sharp correction followed by relief rallies.
                </p>
              </div>
            </div>
          </div>
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
                <span className="font-medium text-green-800 dark:text-green-200">50 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Year-End:</span>
                <span className="font-medium text-green-800 dark:text-green-200">$100,000</span>
              </div>
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
                <span className="font-medium text-blue-800 dark:text-blue-200">{daysToProjectedPeak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Year-End:</span>
                <span className="font-medium text-blue-800 dark:text-blue-200">$75,000</span>
              </div>
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
                <span className="font-medium text-red-800 dark:text-red-200">112 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700 dark:text-red-300">Year-End:</span>
                <span className="font-medium text-red-800 dark:text-red-200">$55,000</span>
              </div>
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

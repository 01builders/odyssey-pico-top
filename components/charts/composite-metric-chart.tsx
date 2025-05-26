"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, TrendingUp, TrendingDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { generateCompositeData } from "@/lib/mock-data"

export default function CompositeMetricChart() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    console.log("CompositeMetricChart: Starting data fetch...")
    try {
      const fetchData = () => {
        const generatedData = generateCompositeData()
        console.log("CompositeMetricChart: Data generated, filtering...")

        // Filter out any invalid data points
        const validData = generatedData.filter(
          (item) =>
            item &&
            typeof item.date === "string" &&
            typeof item.value === "number" &&
            !isNaN(item.value) &&
            typeof item.price === "number" &&
            !isNaN(item.price),
        )

        console.log(
          `CompositeMetricChart: Filtered data - ${validData.length} valid points out of ${generatedData.length}`,
        )
        setData(validData)
        setIsLoading(false)
      }

      // Add a small timeout to ensure component is mounted
      const timer = setTimeout(fetchData, 500)
      return () => clearTimeout(timer)
    } catch (err) {
      console.error("CompositeMetricChart: Error generating data:", err)
      setError(err)
      setIsLoading(false)
    }
  }, [])

  // Delayed chart rendering to prevent SVG issues
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      const timer = setTimeout(() => {
        setShowChart(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isLoading, data])

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <Card className="border border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="text-xl">Odyssey Cycle Position Index (OCPI)</CardTitle>
          <CardDescription>Composite metric combining all on-chain indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Loading composite metric data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If there's an error or no data, show an error state
  if (error || data.length === 0) {
    return (
      <Card className="border border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="text-xl">Odyssey Cycle Position Index (OCPI)</CardTitle>
          <CardDescription>Composite metric combining all on-chain indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {error ? "Error loading chart data" : "No data available for this chart"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Safely get the current value
  const currentValue = data[data.length - 1].value
  const btcPrice = data[data.length - 1].price

  // Adjust the zone info to only recommend selling when closer to the red area
  const getZoneInfo = (value) => {
    if (value >= 80) return { zone: "Extreme Sell Zone", color: "red", action: "SELL", icon: <TrendingDown /> }
    if (value >= 65) return { zone: "Caution Zone", color: "orange", action: "MONITOR", icon: <AlertTriangle /> }
    if (value >= 45) return { zone: "Neutral Zone", color: "yellow", action: "HOLD", icon: <Info /> }
    if (value >= 30) return { zone: "Buy Zone", color: "green", action: "ACCUMULATE", icon: <TrendingUp /> }
    return { zone: "Extreme Buy Zone", color: "blue", action: "BUY", icon: <TrendingUp /> }
  }

  const zoneInfo = getZoneInfo(currentValue)

  const getColorClass = (color) => {
    switch (color) {
      case "red":
        return "text-red-600 dark:text-red-400"
      case "orange":
        return "text-orange-600 dark:text-orange-400"
      case "yellow":
        return "text-yellow-600 dark:text-yellow-400"
      case "green":
        return "text-green-600 dark:text-green-400"
      case "blue":
        return "text-blue-600 dark:text-blue-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Calculate the projected peak date and value
  const currentDate = new Date("2025-05-26")
  const peakDate = new Date("2025-08-15")
  const daysToProjectedPeak = Math.floor((peakDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
  const projectedPeakValue = 85 // OCPI value at projected peak

  return (
    <Card className="border border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              Odyssey Cycle Position Index (OCPI)
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Info</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">About the OCPI</h4>
                    <p className="text-sm text-muted-foreground">
                      The Odyssey Cycle Position Index is a proprietary metric that combines NUPL, MVRV, SOPR, and
                      Rainbow Chart data into a single value (0-100) to indicate the current market cycle position.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Formula:</strong> Weighted average of normalized metrics with historical correlation
                      adjustments.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </CardTitle>
            <CardDescription>Composite metric combining all on-chain indicators</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <div className={`${getColorClass(zoneInfo.color)}`}>{zoneInfo.icon}</div>
              <span className={`text-lg font-bold ${getColorClass(zoneInfo.color)}`}>{currentValue.toFixed(1)}</span>
            </div>
            <p className={`text-sm font-medium ${getColorClass(zoneInfo.color)}`}>
              {zoneInfo.zone} • {zoneInfo.action}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Restored peak prediction visualization */}
        <div className="h-80 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-4 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col h-full">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium mb-2">Cycle Position & Peak Projection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current OCPI: <span className="font-bold">{currentValue.toFixed(1)}</span> • Projected peak:{" "}
                <span className="font-bold">{projectedPeakValue}</span> in {daysToProjectedPeak} days
              </p>
            </div>

            {/* Chart visualization */}
            <div className="flex-1 relative">
              {/* Time axis with months */}
              <div className="absolute bottom-0 left-0 right-0 h-8">
                <div className="flex h-full">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                    (month, index) => (
                      <div
                        key={month}
                        className={`flex-1 border-r border-gray-300 dark:border-gray-700 text-center ${
                          month === "May" ? "bg-purple-100 dark:bg-purple-900/30" : ""
                        } ${month === "Aug" ? "bg-red-100 dark:bg-red-900/30" : ""}`}
                      >
                        <span className="text-xs text-gray-500 dark:text-gray-400">{month}</span>
                        {month === "May" && (
                          <div className="text-[10px] text-purple-600 dark:text-purple-400">Current</div>
                        )}
                        {month === "Aug" && <div className="text-[10px] text-red-600 dark:text-red-400">Peak</div>}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Value zones */}
              <div className="absolute top-0 left-0 right-0 bottom-8 flex flex-col">
                <div className="h-1/5 bg-red-100 dark:bg-red-950/30 border-b border-red-200 dark:border-red-800 flex items-center pl-2">
                  <span className="text-xs text-red-600 dark:text-red-400">Extreme Sell (80-100)</span>
                </div>
                <div className="h-1/5 bg-orange-100 dark:bg-orange-950/30 border-b border-orange-200 dark:border-orange-800 flex items-center pl-2">
                  <span className="text-xs text-orange-600 dark:text-orange-400">Caution (65-80)</span>
                </div>
                <div className="h-1/5 bg-yellow-100 dark:bg-yellow-950/30 border-b border-yellow-200 dark:border-yellow-800 flex items-center pl-2">
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">Neutral (45-65)</span>
                </div>
                <div className="h-1/5 bg-green-100 dark:bg-green-950/30 border-b border-green-200 dark:border-green-800 flex items-center pl-2">
                  <span className="text-xs text-green-600 dark:text-green-400">Buy (30-45)</span>
                </div>
                <div className="h-1/5 bg-blue-100 dark:bg-blue-950/30 flex items-center pl-2">
                  <span className="text-xs text-blue-600 dark:text-blue-400">Extreme Buy (0-30)</span>
                </div>
              </div>

              {/* Current position marker */}
              <div
                className="absolute w-4 h-4 rounded-full bg-purple-600 border-2 border-white dark:border-gray-800 z-10"
                style={{
                  left: `${(4.5 / 12) * 100}%`, // May is 5th month (index 4), centered
                  bottom: `${currentValue}%`, // Position based on OCPI value
                  transform: "translate(-50%, 50%)", // Center the marker
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded text-xs text-purple-800 dark:text-purple-200 whitespace-nowrap">
                  Today: {currentValue.toFixed(1)}
                </div>
              </div>

              {/* Projected peak marker */}
              <div
                className="absolute w-4 h-4 rounded-full bg-red-600 border-2 border-white dark:border-gray-800 z-10"
                style={{
                  left: `${(7.5 / 12) * 100}%`, // August is 8th month (index 7), centered
                  bottom: `${projectedPeakValue}%`, // Position based on projected peak OCPI value
                  transform: "translate(-50%, 50%)", // Center the marker
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded text-xs text-red-800 dark:text-red-200 whitespace-nowrap">
                  Peak: {projectedPeakValue}
                </div>
              </div>

              {/* Trend line connecting current to peak */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
                <line
                  x1={`${(4.5 / 12) * 100}%`}
                  y1={`${100 - currentValue}%`}
                  x2={`${(7.5 / 12) * 100}%`}
                  y2={`${100 - projectedPeakValue}%`}
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Keep the progress bar as a secondary visualization */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Current OCPI Position</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{currentValue.toFixed(1)}/100</span>
          </div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                zoneInfo.color === "red"
                  ? "bg-red-500"
                  : zoneInfo.color === "orange"
                    ? "bg-orange-500"
                    : zoneInfo.color === "yellow"
                      ? "bg-yellow-500"
                      : zoneInfo.color === "green"
                        ? "bg-green-500"
                        : "bg-blue-500"
              }`}
              style={{ width: `${currentValue}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2">
          <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
            <p className="text-xs font-medium text-red-700 dark:text-red-300">Extreme Sell</p>
            <p className="text-xs text-red-600 dark:text-red-400">80-100</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
            <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Caution</p>
            <p className="text-xs text-orange-600 dark:text-orange-400">65-80</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Neutral</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">45-65</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <p className="text-xs font-medium text-green-700 dark:text-green-300">Buy</p>
            <p className="text-xs text-green-600 dark:text-green-400">30-45</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Extreme Buy</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">0-30</p>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
          <h4 className="font-medium mb-2">How OCPI Works</h4>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              The Odyssey Cycle Position Index (OCPI) is a proprietary metric designed to identify Bitcoin market cycle
              positions with high accuracy. It combines multiple on-chain metrics with historical price data to create a
              single, easy-to-interpret value between 0-100.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Components:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>NUPL (Net Unrealized Profit/Loss)</li>
                  <li>MVRV (Market Value to Realized Value)</li>
                  <li>SOPR (Spent Output Profit Ratio)</li>
                  <li>Rainbow Chart Position</li>
                  <li>Historical Cycle Timing</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Weighting Methodology:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dynamic weights based on historical accuracy</li>
                  <li>Correlation adjustments between metrics</li>
                  <li>Time-based cycle progression factors</li>
                  <li>Volatility normalization</li>
                </ul>
              </div>
            </div>
            <p>
              <span className="font-medium text-gray-800 dark:text-gray-200">Interpretation:</span> Values above 80
              indicate selling opportunities, while values below 30 represent buying opportunities. The current OCPI of{" "}
              <span className={getColorClass(zoneInfo.color)}>{currentValue.toFixed(1)}</span> suggests we are in a{" "}
              <span className={getColorClass(zoneInfo.color)}>{zoneInfo.zone.toLowerCase()}</span>, with a projected
              peak of {projectedPeakValue} in {daysToProjectedPeak} days.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

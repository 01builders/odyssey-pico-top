"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import ActionBox from "@/components/metrics/action-box"
import { useMetrics } from "@/hooks/use-metrics"
import { useMemo } from "react"

interface NUPLChartProps {
  detailed?: boolean
}

export default function NUPLChart({ detailed = false }: NUPLChartProps) {
  const { data, isLoading, error } = useMetrics()

  // Use useMemo to ensure data is only processed once
  const chartData = useMemo(() => {
    try {
      // Filter out any invalid data points
      return data.nupl.filter(
        (item) => item && typeof item.date === "string" && typeof item.value === "number" && !isNaN(item.value),
      )
    } catch (error) {
      console.error("Error processing NUPL data:", error)
      return []
    }
  }, [data.nupl])

  // If loading, show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Net Unrealized Profit/Loss (NUPL)</CardTitle>
          <CardDescription>Measures the overall profit/loss of all Bitcoin holders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Loading NUPL data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If error, show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Net Unrealized Profit/Loss (NUPL)</CardTitle>
          <CardDescription>Measures the overall profit/loss of all Bitcoin holders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-500 dark:text-red-400">Error loading NUPL data: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If we have no data, show a fallback UI
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Net Unrealized Profit/Loss (NUPL)</CardTitle>
          <CardDescription>Measures the overall profit/loss of all Bitcoin holders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No NUPL data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Safely get the current value
  const currentValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0.5

  const getZone = (value: number) => {
    if (value >= 0.75) return { zone: "Euphoria", color: "red", action: "SELL - Market extremely overheated" }
    if (value >= 0.5) return { zone: "Belief", color: "orange", action: "CAUTION - Consider taking profits" }
    if (value >= 0.25) return { zone: "Optimism", color: "yellow", action: "HOLD - Market trending up" }
    if (value >= 0) return { zone: "Hope", color: "green", action: "ACCUMULATE - Good entry zone" }
    return { zone: "Capitulation", color: "blue", action: "BUY - Maximum opportunity" }
  }

  const zoneInfo = getZone(currentValue)

  // Safe date formatter function
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en", { month: "short", year: "2-digit" })
    } catch (e) {
      return ""
    }
  }

  return (
    <Card className={detailed ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle>Net Unrealized Profit/Loss (NUPL)</CardTitle>
        <CardDescription>Measures the overall profit/loss of all Bitcoin holders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`${detailed ? "h-96" : "h-64"} mb-4`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatDate} />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[-0.25, 1]}
                ticks={[-0.25, 0, 0.25, 0.5, 0.75, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />

              {/* Zone backgrounds */}
              <ReferenceArea y1={0.75} y2={1} fill="#ef4444" fillOpacity={0.1} />
              <ReferenceArea y1={0.5} y2={0.75} fill="#f59e0b" fillOpacity={0.1} />
              <ReferenceArea y1={0.25} y2={0.5} fill="#eab308" fillOpacity={0.1} />
              <ReferenceArea y1={0} y2={0.25} fill="#10b981" fillOpacity={0.1} />
              <ReferenceArea y1={-0.25} y2={0} fill="#3b82f6" fillOpacity={0.1} />

              {/* Reference lines */}
              <ReferenceLine y={0.75} stroke="#ef4444" strokeDasharray="5 5" />
              <ReferenceLine y={0.5} stroke="#f59e0b" strokeDasharray="5 5" />
              <ReferenceLine y={0.25} stroke="#eab308" strokeDasharray="5 5" />
              <ReferenceLine y={0} stroke="#10b981" strokeDasharray="5 5" />

              <Tooltip
                formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
                labelFormatter={(label) => {
                  try {
                    return new Date(label).toLocaleDateString()
                  } catch (e) {
                    return label
                  }
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <ActionBox
          metric="NUPL"
          value={`${(currentValue * 100).toFixed(2)}%`}
          zone={zoneInfo.zone}
          color={zoneInfo.color}
          action={zoneInfo.action}
        />

        {detailed && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Euphoria</p>
                <p className="text-xs text-red-600 dark:text-red-400">75% - 100%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Belief</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">50% - 75%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Optimism</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">25% - 50%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Hope</p>
                <p className="text-xs text-green-600 dark:text-green-400">0% - 25%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Capitulation</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Below 0%</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Historical Context</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• 2017 Peak: NUPL reached 77% before 84% crash</li>
                <li>• 2021 Peak: NUPL reached 73% before 77% crash</li>
                <li>• Target Exit Zone: Above 75% indicates extreme overvaluation</li>
                <li>• Current Status: Market in {zoneInfo.zone} phase</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

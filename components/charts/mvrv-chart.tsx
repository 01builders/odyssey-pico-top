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
import { generateMVRVData } from "@/lib/mock-data"
import { useMemo } from "react"

interface MVRVChartProps {
  detailed?: boolean
}

export default function MVRVChart({ detailed = false }: MVRVChartProps) {
  // Use useMemo to ensure data is only generated once and properly validated
  const data = useMemo(() => {
    try {
      const generatedData = generateMVRVData()
      // Filter out any invalid data points
      return generatedData.filter(
        (item) => item && typeof item.date === "string" && typeof item.value === "number" && !isNaN(item.value),
      )
    } catch (error) {
      console.error("Error generating MVRV data:", error)
      return []
    }
  }, [])

  // If we have no data, show a fallback UI
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Value to Realized Value (MVRV)</CardTitle>
          <CardDescription>Ratio of market cap to realized cap - indicates over/undervaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Unable to load MVRV data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Safely get the current value
  const currentValue = data.length > 0 ? data[data.length - 1].value : 2.5

  const getZone = (value: number) => {
    if (value >= 3.7) return { zone: "Extreme Overvaluation", color: "red", action: "SELL - Historical top zone" }
    if (value >= 3.0) return { zone: "Overvaluation", color: "orange", action: "CAUTION - Begin profit taking" }
    if (value >= 2.0) return { zone: "Fair Value", color: "yellow", action: "HOLD - Market fairly valued" }
    if (value >= 1.0) return { zone: "Undervaluation", color: "green", action: "ACCUMULATE - Good value" }
    return { zone: "Extreme Undervaluation", color: "blue", action: "BUY - Generational opportunity" }
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
        <CardTitle>Market Value to Realized Value (MVRV)</CardTitle>
        <CardDescription>Ratio of market cap to realized cap - indicates over/undervaluation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`${detailed ? "h-96" : "h-64"} mb-4`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatDate} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />

              {/* Zone backgrounds */}
              <ReferenceArea y1={3.7} y2={5} fill="#ef4444" fillOpacity={0.1} />
              <ReferenceArea y1={3.0} y2={3.7} fill="#f59e0b" fillOpacity={0.1} />
              <ReferenceArea y1={2.0} y2={3.0} fill="#eab308" fillOpacity={0.1} />
              <ReferenceArea y1={1.0} y2={2.0} fill="#10b981" fillOpacity={0.1} />
              <ReferenceArea y1={0} y2={1.0} fill="#3b82f6" fillOpacity={0.1} />

              {/* Reference lines */}
              <ReferenceLine y={3.7} stroke="#ef4444" strokeDasharray="5 5" />
              <ReferenceLine y={3.0} stroke="#f59e0b" strokeDasharray="5 5" />
              <ReferenceLine y={2.0} stroke="#eab308" strokeDasharray="5 5" />
              <ReferenceLine y={1.0} stroke="#10b981" strokeDasharray="5 5" />

              <Tooltip
                formatter={(value: number) => value.toFixed(2)}
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
                stroke="#7c3aed"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <ActionBox
          metric="MVRV"
          value={currentValue.toFixed(2)}
          zone={zoneInfo.zone}
          color={zoneInfo.color}
          action={zoneInfo.action}
        />

        {detailed && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Extreme Top</p>
                <p className="text-xs text-red-600 dark:text-red-400">Above 3.7</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Overvalued</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">3.0 - 3.7</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Fair Value</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">2.0 - 3.0</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Undervalued</p>
                <p className="text-xs text-green-600 dark:text-green-400">1.0 - 2.0</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Extreme Bottom</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Below 1.0</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Exit Strategy by MVRV</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• 25% exit at MVRV 3.0-3.5</li>
                <li>• 50% exit at MVRV 3.5-4.0</li>
                <li>• 75% exit at MVRV 4.0-4.5</li>
                <li>• Final 25% at extreme readings (4.5+)</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

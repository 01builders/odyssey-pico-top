"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import ActionBox from "@/components/metrics/action-box"
import { generateSOPRData } from "@/lib/mock-data"
import { useMemo } from "react"

interface SOPRChartProps {
  detailed?: boolean
}

export default function SOPRChart({ detailed = false }: SOPRChartProps) {
  // Use useMemo to ensure data is only generated once and properly validated
  const data = useMemo(() => {
    try {
      const generatedData = generateSOPRData()
      // Filter out any invalid data points
      return generatedData.filter(
        (item) => item && typeof item.date === "string" && typeof item.value === "number" && !isNaN(item.value),
      )
    } catch (error) {
      console.error("Error generating SOPR data:", error)
      return []
    }
  }, [])

  // If we have no data, show a fallback UI
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spent Output Profit Ratio (SOPR)</CardTitle>
          <CardDescription>Profit/loss ratio of coins being moved on-chain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Unable to load SOPR data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Safely get the current value
  const currentValue = data.length > 0 ? data[data.length - 1].value : 1.1

  const getZone = (value: number) => {
    if (value >= 1.3) return { zone: "Extreme Profit Taking", color: "red", action: "SELL - Distribution phase active" }
    if (value >= 1.2) return { zone: "High Profit Taking", color: "orange", action: "CAUTION - Monitor for weakness" }
    if (value >= 1.1) return { zone: "Moderate Profit", color: "yellow", action: "HOLD - Healthy profit taking" }
    if (value >= 1.0) return { zone: "Break Even", color: "gray", action: "NEUTRAL - Market equilibrium" }
    return { zone: "Losses Realized", color: "green", action: "BUY - Capitulation opportunity" }
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
        <CardTitle>Spent Output Profit Ratio (SOPR)</CardTitle>
        <CardDescription>Profit/loss ratio of coins being moved on-chain</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`${detailed ? "h-96" : "h-64"} mb-4`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatDate} />
              <YAxis tick={{ fontSize: 12 }} domain={[0.8, 1.4]} ticks={[0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4]} />

              {/* Reference lines */}
              <ReferenceLine y={1.3} stroke="#ef4444" strokeDasharray="5 5" />
              <ReferenceLine y={1.2} stroke="#f59e0b" strokeDasharray="5 5" />
              <ReferenceLine y={1.1} stroke="#eab308" strokeDasharray="5 5" />
              <ReferenceLine y={1.0} stroke="#6b7280" strokeDasharray="5 5" strokeWidth={2} />

              <Tooltip
                formatter={(value: number) => value.toFixed(3)}
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
          metric="SOPR"
          value={currentValue.toFixed(3)}
          zone={zoneInfo.zone}
          color={zoneInfo.color}
          action={zoneInfo.action}
        />

        {detailed && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold mb-2">SOPR Interpretation</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Above 1.0: Coins moving at profit</li>
                <li>• Below 1.0: Coins moving at loss</li>
                <li>• Sustained 1.2+: Distribution phase</li>
                <li>• Spikes above 1.3: Local tops</li>
                <li>• Below 0.95: Capitulation events</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Key Signal</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Watch for SOPR declining while price rises - indicates weak hands exhausted and potential top forming.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

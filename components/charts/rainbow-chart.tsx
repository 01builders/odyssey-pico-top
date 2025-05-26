"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from "recharts"
import ActionBox from "@/components/metrics/action-box"
import { generateRainbowData } from "@/lib/mock-data"
import { useMemo } from "react"

interface RainbowChartProps {
  detailed?: boolean
}

export default function RainbowChart({ detailed = false }: RainbowChartProps) {
  // Use useMemo to ensure data is only generated once and properly validated
  const data = useMemo(() => {
    try {
      const generatedData = generateRainbowData()
      // Filter out any invalid data points
      return generatedData.filter(
        (item) =>
          item &&
          typeof item.date === "string" &&
          typeof item.price === "number" &&
          !isNaN(item.price) &&
          typeof item.currentBand === "string",
      )
    } catch (error) {
      console.error("Error generating Rainbow data:", error)
      return []
    }
  }, [])

  // If we have no data, show a fallback UI
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bitcoin Rainbow Chart</CardTitle>
          <CardDescription>Logarithmic regression bands showing long-term valuation zones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Unable to load Rainbow chart data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Safely get the current values
  const currentPrice = data.length > 0 ? data[data.length - 1].price : 80000
  const currentBand = data.length > 0 ? data[data.length - 1].currentBand : "green"

  const getBandInfo = (band: string) => {
    switch (band) {
      case "red":
        return { zone: "Maximum Bubble", color: "red", action: "SELL - Extreme overvaluation" }
      case "orange":
        return { zone: "FOMO Zone", color: "orange", action: "CAUTION - Take profits" }
      case "yellow":
        return { zone: "Is this a bubble?", color: "yellow", action: "HOLD - Monitor closely" }
      case "green":
        return { zone: "Still Cheap", color: "green", action: "ACCUMULATE - Good value" }
      case "blue":
        return { zone: "Fire Sale", color: "blue", action: "BUY - Maximum opportunity" }
      default:
        return { zone: "Unknown", color: "gray", action: "WAIT" }
    }
  }

  const bandInfo = getBandInfo(currentBand)

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
        <CardTitle>Bitcoin Rainbow Chart</CardTitle>
        <CardDescription>Logarithmic regression bands showing long-term valuation zones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`${detailed ? "h-96" : "h-64"} mb-4`}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatDate} />
              <YAxis
                scale="log"
                domain={[10000, "auto"]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />

              {/* Rainbow bands - simplified to reduce potential SVG issues */}
              <Area type="monotone" dataKey="band9" fill="#ef4444" fillOpacity={0.3} stroke="none" />
              <Area type="monotone" dataKey="band5" fill="#84cc16" fillOpacity={0.3} stroke="none" />
              <Area type="monotone" dataKey="band1" fill="#3b82f6" fillOpacity={0.3} stroke="none" />

              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
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
                dataKey="price"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <ActionBox
          metric="Rainbow Band"
          value={`$${currentPrice.toLocaleString()}`}
          zone={bandInfo.zone}
          color={bandInfo.color}
          action={bandInfo.action}
        />

        {detailed && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Bubble</p>
                <p className="text-xs text-red-600 dark:text-red-400">$150k+</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">FOMO</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">$120k-150k</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Is this a bubble?</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">$80k-120k</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Still Cheap</p>
                <p className="text-xs text-green-600 dark:text-green-400">$40k-80k</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Fire Sale</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Below $40k</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold mb-2">2025 Projection</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on logarithmic regression, the red "bubble" zone for July-September 2025 is projected to be in the
                $120k-200k range. Historical peaks have consistently reached the upper red bands before major
                corrections.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

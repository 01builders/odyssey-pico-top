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
import { calculateOCPI, predictOCPI, getHistoricalContext } from "@/lib/services/metrics-service"

interface OCPIChartProps {
  detailed?: boolean
}

export default function OCPIChart({ detailed = false }: OCPIChartProps) {
  const { data, isLoading, error } = useMetrics()

  // Calculate OCPI and predictions
  const { historicalData, predictions } = useMemo(() => {
    if (!data.nupl.length || !data.mvrv.length || !data.sopr.length) {
      return { historicalData: [], predictions: [] }
    }

    const historicalOCPI = calculateOCPI(data.nupl, data.mvrv, data.sopr)
    const futureOCPI = predictOCPI(historicalOCPI)

    return {
      historicalData: historicalOCPI,
      predictions: futureOCPI
    }
  }, [data.nupl, data.mvrv, data.sopr])

  // If loading, show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Odyssey Cycle Prediction Index (OCPI)</CardTitle>
          <CardDescription>Combined metric for cycle analysis and prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Loading OCPI data...</p>
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
          <CardTitle>Odyssey Cycle Prediction Index (OCPI)</CardTitle>
          <CardDescription>Combined metric for cycle analysis and prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-500 dark:text-red-400">Error loading OCPI data: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If we have no data, show a fallback UI
  if (historicalData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Odyssey Cycle Prediction Index (OCPI)</CardTitle>
          <CardDescription>Combined metric for cycle analysis and prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No OCPI data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get current value and context
  const currentValue = historicalData[historicalData.length - 1].value
  const context = getHistoricalContext('OCPI', currentValue)

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
        <CardTitle>Odyssey Cycle Prediction Index (OCPI)</CardTitle>
        <CardDescription>Combined metric for cycle analysis and prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`${detailed ? "h-96" : "h-64"} mb-4`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={formatDate}
                domain={['2017-01-01', '2026-12-31']}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(value) => `${value}%`}
              />

              {/* Zone backgrounds */}
              <ReferenceArea y1={75} y2={100} fill="#ef4444" fillOpacity={0.1} />
              <ReferenceArea y1={50} y2={75} fill="#f59e0b" fillOpacity={0.1} />
              <ReferenceArea y1={25} y2={50} fill="#eab308" fillOpacity={0.1} />
              <ReferenceArea y1={0} y2={25} fill="#10b981" fillOpacity={0.1} />

              {/* Reference lines */}
              <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="5 5" />
              <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="5 5" />
              <ReferenceLine y={25} stroke="#eab308" strokeDasharray="5 5" />

              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}%`}
                labelFormatter={(label) => {
                  try {
                    return new Date(label).toLocaleDateString()
                  } catch (e) {
                    return label
                  }
                }}
              />

              {/* Historical OCPI */}
              <Line
                type="monotone"
                data={historicalData}
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />

              {/* Predicted OCPI */}
              <Line
                type="monotone"
                data={predictions}
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <ActionBox
          metric="OCPI"
          value={`${currentValue.toFixed(2)}%`}
          zone={context.phase}
          color={context.phase === 'Peak Zone' ? 'red' : context.phase === 'Bottom Zone' ? 'green' : 'yellow'}
          action={`${context.phase} - Confidence: ${(context.confidence * 100).toFixed(0)}%`}
        />

        {detailed && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Peak Zone</p>
                <p className="text-xs text-red-600 dark:text-red-400">75% - 100%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Accumulation</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">50% - 75%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Distribution</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">25% - 50%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Bottom Zone</p>
                <p className="text-xs text-green-600 dark:text-green-400">0% - 25%</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Historical Context</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {context.historicalPeaks.map((peak, index) => (
                  <li key={index}>• {peak.date}: Peak at ${peak.value.toLocaleString()}</li>
                ))}
                <li>• Current Status: Market in {context.phase}</li>
                <li>• Prediction Confidence: {(context.confidence * 100).toFixed(0)}%</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
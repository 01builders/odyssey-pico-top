"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function CyclePrediction() {
  const halvingDate = new Date("2024-04-01")
  const currentDate = new Date("2025-05-26") // May 26th, 2025
  const predictedPeakStart = new Date("2025-07-01")
  const predictedPeakEnd = new Date("2025-09-30")

  const monthsSinceHalving =
    (currentDate.getFullYear() - halvingDate.getFullYear()) * 12 + (currentDate.getMonth() - halvingDate.getMonth())
  const cycleProgress = (monthsSinceHalving / 48) * 100

  const monthsUntilPeak =
    (predictedPeakStart.getFullYear() - currentDate.getFullYear()) * 12 +
    (predictedPeakStart.getMonth() - currentDate.getMonth())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Cycle Peak Prediction
        </CardTitle>
        <CardDescription>Based on 48-bar cycle theory and historical patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Cycle Progress</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Month {monthsSinceHalving} of 48</span>
          </div>
          <Progress value={cycleProgress} className="h-3" />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Apr 2024 Halving</span>
            <span>Apr 2028 Next Halving</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Predicted Peak Window</h4>
            </div>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">July - September 2025</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">{monthsUntilPeak} months remaining</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Historical Context</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• 2017: Peak at month 42</li>
              <li>• 2021: Peak at month 41</li>
              <li>• 2025: Targeting months 39-42</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Post-Peak Projection</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Historical data suggests an 80-98% correction following the peak, with bottom formation expected in
                2026-2027. Prepare exit strategy now.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

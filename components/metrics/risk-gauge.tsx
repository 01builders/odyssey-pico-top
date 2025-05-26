"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function RiskGauge() {
  // May 26th, 2025 - approaching cycle top, so risk is elevated
  const riskScore = 68 // 0-100 scale

  // Individual metric scores
  const metricScores = {
    ocpi: 72,
    nupl: 65,
    mvrv: 70,
    sopr: 62,
    rainbow: 75,
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "EXTREME", color: "red" }
    if (score >= 60) return { level: "HIGH", color: "orange" }
    if (score >= 40) return { level: "MODERATE", color: "yellow" }
    if (score >= 20) return { level: "LOW", color: "green" }
    return { level: "MINIMAL", color: "blue" }
  }

  const getColorClass = (score: number) => {
    const risk = getRiskLevel(score)
    switch (risk.color) {
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

  const getBgColorClass = (score: number) => {
    const risk = getRiskLevel(score)
    switch (risk.color) {
      case "red":
        return "bg-red-100 dark:bg-red-950"
      case "orange":
        return "bg-orange-100 dark:bg-orange-950"
      case "yellow":
        return "bg-yellow-100 dark:bg-yellow-950"
      case "green":
        return "bg-green-100 dark:bg-green-950"
      case "blue":
        return "bg-blue-100 dark:bg-blue-950"
      default:
        return "bg-gray-100 dark:bg-gray-900"
    }
  }

  const risk = getRiskLevel(riskScore)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Overall Market Risk
        </CardTitle>
        <CardDescription>Composite score from all indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pt-8 pb-4">
          {/* Gauge visualization */}
          <div className="relative w-48 h-24 mx-auto">
            <div className="absolute inset-0 flex items-end justify-center">
              <div className="w-full h-full border-8 border-b-0 rounded-t-full border-gray-200 dark:border-gray-700"></div>
            </div>
            <div
              className="absolute inset-0 flex items-end justify-center"
              style={{ transform: `rotate(${(riskScore / 100) * 180 - 90}deg)` }}
            >
              <div className="w-1 h-24 bg-gray-900 dark:bg-white origin-bottom"></div>
            </div>
          </div>

          <div className="text-center mt-4">
            <div
              className={`text-3xl font-bold ${
                risk.color === "red"
                  ? "text-red-600"
                  : risk.color === "orange"
                    ? "text-orange-600"
                    : risk.color === "yellow"
                      ? "text-yellow-600"
                      : risk.color === "green"
                        ? "text-green-600"
                        : "text-blue-600"
              }`}
            >
              {riskScore}%
            </div>
            <div
              className={`text-lg font-semibold mt-1 ${
                risk.color === "red"
                  ? "text-red-700 dark:text-red-300"
                  : risk.color === "orange"
                    ? "text-orange-700 dark:text-orange-300"
                    : risk.color === "yellow"
                      ? "text-yellow-700 dark:text-yellow-300"
                      : risk.color === "green"
                        ? "text-green-700 dark:text-green-300"
                        : "text-blue-700 dark:text-blue-300"
              }`}
            >
              {risk.level} RISK
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <div className={`flex justify-between text-sm p-2 rounded-lg ${getBgColorClass(metricScores.ocpi)}`}>
            <span className="font-medium">OCPI</span>
            <span className={`font-bold ${getColorClass(metricScores.ocpi)}`}>{metricScores.ocpi}%</span>
          </div>
          <div className={`flex justify-between text-sm p-2 rounded-lg ${getBgColorClass(metricScores.nupl)}`}>
            <span className="font-medium">NUPL</span>
            <span className={`font-bold ${getColorClass(metricScores.nupl)}`}>{metricScores.nupl}%</span>
          </div>
          <div className={`flex justify-between text-sm p-2 rounded-lg ${getBgColorClass(metricScores.mvrv)}`}>
            <span className="font-medium">MVRV</span>
            <span className={`font-bold ${getColorClass(metricScores.mvrv)}`}>{metricScores.mvrv}%</span>
          </div>
          <div className={`flex justify-between text-sm p-2 rounded-lg ${getBgColorClass(metricScores.sopr)}`}>
            <span className="font-medium">SOPR</span>
            <span className={`font-bold ${getColorClass(metricScores.sopr)}`}>{metricScores.sopr}%</span>
          </div>
          <div className={`flex justify-between text-sm p-2 rounded-lg ${getBgColorClass(metricScores.rainbow)}`}>
            <span className="font-medium">Rainbow</span>
            <span className={`font-bold ${getColorClass(metricScores.rainbow)}`}>{metricScores.rainbow}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

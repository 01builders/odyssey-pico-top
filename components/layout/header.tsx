"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function Header() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [cycleProgress, setCycleProgress] = useState<number>(0)

  useEffect(() => {
    // Mock data - replace with real API
    setBtcPrice(98543)
    setPriceChange(2.4)

    // Calculate cycle progress (months since April 2024 halving)
    // Current date: May 26th, 2025
    const halvingDate = new Date("2024-04-01")
    const currentDate = new Date("2025-05-26")
    const monthsSinceHalving =
      (currentDate.getFullYear() - halvingDate.getFullYear()) * 12 + (currentDate.getMonth() - halvingDate.getMonth())
    setCycleProgress((monthsSinceHalving / 48) * 100)
  }, [])

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Image src="/images/odyssey-logo.png" alt="Odyssey Logo" width={56} height={56} className="rounded-md" />
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">BTC Price</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ${btcPrice?.toLocaleString() || "---"}
                </span>
                {priceChange > 0 ? (
                  <span className="flex items-center text-green-500 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    {priceChange}%
                  </span>
                ) : (
                  <span className="flex items-center text-red-500 text-sm">
                    <TrendingDown className="w-4 h-4" />
                    {Math.abs(priceChange)}%
                  </span>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Cycle Progress</p>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${cycleProgress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {cycleProgress.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">May 26, 2025</p>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

import { useEffect, useState } from 'react'
import type { MetricData, PriceData } from '@/lib/api'

export function useMetrics() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<{
    nupl: MetricData[]
    mvrv: MetricData[]
    sopr: MetricData[]
    price: PriceData[]
    composite: MetricData[]
  }>({
    nupl: [],
    mvrv: [],
    sopr: [],
    price: [],
    composite: []
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const metrics = ['nupl', 'mvrv', 'sopr', 'price', 'composite']
        const results = await Promise.all(
          metrics.map(metric =>
            fetch(`/api/metrics?metric=${metric}`)
              .then(res => res.json())
              .then(res => res.data)
          )
        )

        setData({
          nupl: results[0],
          mvrv: results[1],
          sopr: results[2],
          price: results[3],
          composite: results[4]
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch metrics'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Set up polling every hour
    const interval = setInterval(fetchData, 3600000)
    return () => clearInterval(interval)
  }, [])

  return {
    data,
    isLoading,
    error
  }
} 
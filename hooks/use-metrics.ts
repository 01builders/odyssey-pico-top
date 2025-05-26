import { useEffect, useState } from 'react'
import {
  fetchNUPLData,
  fetchMVRVData,
  fetchSOPRData,
  fetchPriceData,
  generateCompositeData,
  type MetricData,
  type PriceData
} from '@/lib/api'

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
        const [nupl, mvrv, sopr, price, composite] = await Promise.all([
          fetchNUPLData(),
          fetchMVRVData(),
          fetchSOPRData(),
          fetchPriceData(),
          generateCompositeData()
        ])

        setData({
          nupl,
          mvrv,
          sopr,
          price,
          composite
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch metrics'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    data,
    isLoading,
    error
  }
} 
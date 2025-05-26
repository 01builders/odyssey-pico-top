import { create, StateCreator } from 'zustand'

// Types
export interface MetricData {
  date: string
  value: number
}

export interface PriceData {
  date: string
  price: number
}

// API Configuration
const GLASSNODE_API_KEY = process.env.NEXT_PUBLIC_GLASSNODE_API_KEY
const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY

// API Endpoints
const GLASSNODE_BASE_URL = 'https://api.glassnode.com/v1'
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

// Cache Store Types
interface CacheState {
  nuplData: MetricData[]
  mvrvData: MetricData[]
  soprData: MetricData[]
  priceData: PriceData[]
  lastUpdated: Record<string, number>
}

interface CacheActions {
  setData: (key: keyof CacheState, data: any) => void
  getData: (key: keyof CacheState) => any
  isStale: (key: keyof CacheState, ttl: number) => boolean
}

type CacheStore = CacheState & CacheActions

// Cache Store
const useCacheStore = create<CacheStore>((set, get) => ({
  nuplData: [],
  mvrvData: [],
  soprData: [],
  priceData: [],
  lastUpdated: {},
  setData: (key, data) => set((state) => ({
    [key]: data,
    lastUpdated: { ...state.lastUpdated, [key]: Date.now() }
  })),
  getData: (key) => get()[key],
  isStale: (key, ttl) => {
    const lastUpdated = get().lastUpdated[key]
    return !lastUpdated || Date.now() - lastUpdated > ttl
  }
}))

// API Functions
export async function fetchNUPLData(): Promise<MetricData[]> {
  const cache = useCacheStore.getState()
  if (!cache.isStale('nuplData', 24 * 60 * 60 * 1000)) {
    return cache.nuplData
  }

  try {
    const response = await fetch(
      `${GLASSNODE_BASE_URL}/metrics/indicators/nupl?a=BTC&api_key=${GLASSNODE_API_KEY}`
    )
    const data = await response.json()
    const formattedData = data.map((item: any) => ({
      date: new Date(item.t * 1000).toISOString(),
      value: item.v
    }))
    cache.setData('nuplData', formattedData)
    return formattedData
  } catch (error) {
    console.error('Error fetching NUPL data:', error)
    return []
  }
}

export async function fetchMVRVData(): Promise<MetricData[]> {
  const cache = useCacheStore.getState()
  if (!cache.isStale('mvrvData', 24 * 60 * 60 * 1000)) {
    return cache.mvrvData
  }

  try {
    const response = await fetch(
      `${GLASSNODE_BASE_URL}/metrics/market/mvrv?a=BTC&api_key=${GLASSNODE_API_KEY}`
    )
    const data = await response.json()
    const formattedData = data.map((item: any) => ({
      date: new Date(item.t * 1000).toISOString(),
      value: item.v
    }))
    cache.setData('mvrvData', formattedData)
    return formattedData
  } catch (error) {
    console.error('Error fetching MVRV data:', error)
    return []
  }
}

export async function fetchSOPRData(): Promise<MetricData[]> {
  const cache = useCacheStore.getState()
  if (!cache.isStale('soprData', 24 * 60 * 60 * 1000)) {
    return cache.soprData
  }

  try {
    const response = await fetch(
      `${GLASSNODE_BASE_URL}/metrics/indicators/sopr?a=BTC&api_key=${GLASSNODE_API_KEY}`
    )
    const data = await response.json()
    const formattedData = data.map((item: any) => ({
      date: new Date(item.t * 1000).toISOString(),
      value: item.v
    }))
    cache.setData('soprData', formattedData)
    return formattedData
  } catch (error) {
    console.error('Error fetching SOPR data:', error)
    return []
  }
}

export async function fetchPriceData(): Promise<PriceData[]> {
  const cache = useCacheStore.getState()
  if (!cache.isStale('priceData', 60 * 60 * 1000)) { // 1 hour cache
    return cache.priceData
  }

  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=max&interval=daily&x_cg_api_key=${COINGECKO_API_KEY}`
    )
    const data = await response.json()
    const formattedData = data.prices.map((item: [number, number]) => ({
      date: new Date(item[0]).toISOString(),
      price: item[1]
    }))
    cache.setData('priceData', formattedData)
    return formattedData
  } catch (error) {
    console.error('Error fetching price data:', error)
    return []
  }
}

// Composite Data Generation
export async function generateCompositeData() {
  const [nuplData, mvrvData, soprData] = await Promise.all([
    fetchNUPLData(),
    fetchMVRVData(),
    fetchSOPRData()
  ])

  // Combine metrics into composite index
  return nuplData.map((item, index) => {
    const mvrv = mvrvData[index]?.value || 0
    const sopr = soprData[index]?.value || 0
    
    // Normalize and weight the metrics
    const nuplScore = item.value * 0.4
    const mvrvScore = (mvrv / 4) * 0.3 // Normalize to 0-1 range
    const soprScore = ((sopr - 1) / 0.3) * 0.3 // Normalize to 0-1 range
    
    const compositeScore = (nuplScore + mvrvScore + soprScore) * 100
    
    return {
      date: item.date,
      value: Math.min(100, Math.max(0, compositeScore))
    }
  })
} 
import { MetricData, PriceData } from '@/lib/api'

// Constants for OCPI calculation
const OCPI_WEIGHTS = {
  NUPL: 0.4,
  MVRV: 0.3,
  SOPR: 0.3
}

// Historical cycle data for reference
const HISTORICAL_CYCLES = {
  '2017': {
    peak: { date: '2017-12-17', price: 19666 },
    bottom: { date: '2018-12-15', price: 3128 },
    duration: 365 // days
  },
  '2021': {
    peak: { date: '2021-11-10', price: 69000 },
    bottom: { date: '2022-11-21', price: 15476 },
    duration: 376 // days
  }
}

// Helper function to aggregate data to monthly intervals
export function aggregateToMonthly<T extends MetricData | PriceData>(data: T[]): T[] {
  const monthlyData = new Map<string, any>()
  
  data.forEach(item => {
    const date = new Date(item.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, {
        date: `${monthKey}-01`,
        value: 'price' in item ? item.price : item.value,
        count: 1
      })
    } else {
      const current = monthlyData.get(monthKey)
      current.value += 'price' in item ? item.price : item.value
      current.count++
    }
  })
  
  return Array.from(monthlyData.values()).map(item => ({
    date: item.date,
    ...('price' in data[0] ? { price: item.value / item.count } : { value: item.value / item.count })
  })) as T[]
}

// Calculate OCPI (Odyssey Cycle Prediction Index)
export function calculateOCPI(nupl: MetricData[], mvrv: MetricData[], sopr: MetricData[]): MetricData[] {
  const monthlyNUPL = aggregateToMonthly(nupl)
  const monthlyMVRV = aggregateToMonthly(mvrv)
  const monthlySOPR = aggregateToMonthly(sopr)
  
  // Align all metrics to the same dates
  const dates = new Set([
    ...monthlyNUPL.map(d => d.date),
    ...monthlyMVRV.map(d => d.date),
    ...monthlySOPR.map(d => d.date)
  ])
  
  const ocpiData: MetricData[] = []
  
  dates.forEach(date => {
    const nuplValue = monthlyNUPL.find(d => d.date === date)?.value || 0
    const mvrvValue = monthlyMVRV.find(d => d.date === date)?.value || 0
    const soprValue = monthlySOPR.find(d => d.date === date)?.value || 0
    
    // Normalize values to 0-1 range
    const normalizedNUPL = Math.max(0, Math.min(1, nuplValue))
    const normalizedMVRV = Math.max(0, Math.min(1, mvrvValue / 4)) // Assuming MVRV typically ranges 0-4
    const normalizedSOPR = Math.max(0, Math.min(1, (soprValue - 1) / 0.3)) // Normalize SOPR around 1
    
    const ocpiValue = (
      normalizedNUPL * OCPI_WEIGHTS.NUPL +
      normalizedMVRV * OCPI_WEIGHTS.MVRV +
      normalizedSOPR * OCPI_WEIGHTS.SOPR
    ) * 100 // Convert to percentage
    
    ocpiData.push({
      date,
      value: Math.max(0, Math.min(100, ocpiValue))
    })
  })
  
  return ocpiData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Predict future OCPI values based on historical patterns
export function predictOCPI(historicalOCPI: MetricData[], monthsToPredict: number = 12): MetricData[] {
  const predictions: MetricData[] = []
  const lastDate = new Date(historicalOCPI[historicalOCPI.length - 1].date)
  
  // Calculate average cycle length and amplitude
  const cycles = Object.values(HISTORICAL_CYCLES)
  const avgCycleLength = cycles.reduce((sum, cycle) => sum + cycle.duration, 0) / cycles.length
  
  // Generate predictions
  for (let i = 1; i <= monthsToPredict; i++) {
    const predictionDate = new Date(lastDate)
    predictionDate.setMonth(predictionDate.getMonth() + i)
    
    // Simple sinusoidal prediction based on historical cycles
    const cycleProgress = (i * 30) / avgCycleLength // Convert months to days
    const predictedValue = 50 + 50 * Math.sin(cycleProgress * Math.PI)
    
    predictions.push({
      date: predictionDate.toISOString().split('T')[0],
      value: Math.max(0, Math.min(100, predictedValue))
    })
  }
  
  return predictions
}

// Get historical context for a metric
export function getHistoricalContext(metric: string, currentValue: number): {
  phase: string
  confidence: number
  historicalPeaks: { date: string; value: number }[]
} {
  const historicalPeaks = Object.entries(HISTORICAL_CYCLES).map(([year, cycle]) => ({
    date: cycle.peak.date,
    value: cycle.peak.price
  }))
  
  let phase = 'Unknown'
  let confidence = 0
  
  switch (metric) {
    case 'OCPI':
      if (currentValue >= 75) {
        phase = 'Peak Zone'
        confidence = 0.8
      } else if (currentValue >= 50) {
        phase = 'Accumulation'
        confidence = 0.6
      } else if (currentValue >= 25) {
        phase = 'Distribution'
        confidence = 0.7
      } else {
        phase = 'Bottom Zone'
        confidence = 0.8
      }
      break
    // Add cases for other metrics
  }
  
  return {
    phase,
    confidence,
    historicalPeaks
  }
} 
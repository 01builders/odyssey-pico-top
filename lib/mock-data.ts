// Enhanced mock data generators with better error handling and validation

export function generateNUPLData() {
  try {
    const data = []
    const startDate = new Date("2023-01-01")
    const endDate = new Date("2025-05-26") // Current date: May 26th, 2025

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
      const daysSinceStart = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      const trend = (daysSinceStart / 365) * 0.3 // Upward trend
      const noise = (Math.random() - 0.5) * 0.1
      let value = 0.25 + trend + noise + Math.sin(daysSinceStart / 30) * 0.1

      // Ensure value is within valid range
      value = Math.max(0, Math.min(1, value))

      // Ensure no NaN or invalid values
      if (isNaN(value)) value = 0.5

      data.push({
        date: d.toISOString(),
        value,
      })
    }

    // Adjust the last few months to show approaching cycle top
    const lastThreeMonths = data.slice(-12)
    lastThreeMonths.forEach((item, index) => {
      item.value = Math.min(0.72, item.value + index * 0.01) // Approaching the "Belief" zone (0.5-0.75)

      // Double-check for NaN
      if (isNaN(item.value)) item.value = 0.5
    })

    return data
  } catch (error) {
    console.error("Error in generateNUPLData:", error)
    return []
  }
}

export function generateMVRVData() {
  try {
    const data = []
    const startDate = new Date("2023-01-01")
    const endDate = new Date("2025-05-26") // Current date: May 26th, 2025

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
      const daysSinceStart = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      const trend = (daysSinceStart / 365) * 0.8 // Upward trend
      const noise = (Math.random() - 0.5) * 0.3
      let value = 1.5 + trend + noise + Math.sin(daysSinceStart / 45) * 0.4

      // Ensure value is within valid range
      value = Math.max(0.5, Math.min(5, value))

      // Ensure no NaN or invalid values
      if (isNaN(value)) value = 2.5

      data.push({
        date: d.toISOString(),
        value,
      })
    }

    // Adjust the last few months to show approaching cycle top
    const lastThreeMonths = data.slice(-12)
    lastThreeMonths.forEach((item, index) => {
      item.value = Math.min(3.2, item.value + index * 0.05) // Approaching the "Overvaluation" zone (3.0-3.7)

      // Double-check for NaN
      if (isNaN(item.value)) item.value = 2.5
    })

    return data
  } catch (error) {
    console.error("Error in generateMVRVData:", error)
    return []
  }
}

export function generateSOPRData() {
  try {
    const data = []
    const startDate = new Date("2023-01-01")
    const endDate = new Date("2025-05-26") // Current date: May 26th, 2025

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const daysSinceStart = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      const trend = (daysSinceStart / 365) * 0.1
      const noise = (Math.random() - 0.5) * 0.05
      let value = 1.05 + trend + noise + Math.sin(daysSinceStart / 7) * 0.02

      // Ensure value is within valid range
      value = Math.max(0.9, Math.min(1.4, value))

      // Ensure no NaN or invalid values
      if (isNaN(value)) value = 1.1

      data.push({
        date: d.toISOString(),
        value,
      })
    }

    // Adjust the last few months to show approaching cycle top
    const lastThreeMonths = data.slice(-90)
    lastThreeMonths.forEach((item, index) => {
      if (index % 7 === 0) {
        item.value = Math.min(1.25, item.value + (index / 90) * 0.15) // Approaching the "High Profit Taking" zone (1.2-1.3)

        // Double-check for NaN
        if (isNaN(item.value)) item.value = 1.1
      }
    })

    return data
  } catch (error) {
    console.error("Error in generateSOPRData:", error)
    return []
  }
}

export function generateRainbowData() {
  try {
    const data = []
    const startDate = new Date("2023-01-01")
    const endDate = new Date("2025-05-26") // Current date: May 26th, 2025

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
      const daysSinceStart = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)

      // Ensure basePrice is a valid number
      let basePrice = 30000 + daysSinceStart * 100 + (Math.random() - 0.5) * 5000
      if (isNaN(basePrice) || basePrice <= 0) basePrice = 30000

      // Calculate rainbow bands
      const bands = {
        band1: basePrice * 0.3,
        band2: basePrice * 0.4,
        band3: basePrice * 0.5,
        band4: basePrice * 0.65,
        band5: basePrice * 0.8,
        band6: basePrice * 1.0,
        band7: basePrice * 1.3,
        band8: basePrice * 1.6,
        band9: basePrice * 2.0,
      }

      // Determine current band
      let currentBand = "green"
      if (basePrice > bands.band8) currentBand = "red"
      else if (basePrice > bands.band7) currentBand = "orange"
      else if (basePrice > bands.band6) currentBand = "yellow"
      else if (basePrice > bands.band4) currentBand = "green"
      else currentBand = "blue"

      // Ensure all values are valid numbers
      Object.keys(bands).forEach((key) => {
        if (isNaN(bands[key]) || bands[key] <= 0) bands[key] = basePrice
      })

      data.push({
        date: d.toISOString(),
        price: basePrice,
        currentBand,
        ...bands,
      })
    }

    // Adjust the last few months to show approaching cycle top
    const lastThreeMonths = data.slice(-12)
    lastThreeMonths.forEach((item, index) => {
      const multiplier = 1 + (index / 12) * 0.5
      item.price = item.price * multiplier
      item.currentBand = index > 8 ? "orange" : index > 4 ? "yellow" : "green"

      // Recalculate bands
      const basePrice = item.price
      item.band1 = basePrice * 0.3
      item.band2 = basePrice * 0.4
      item.band3 = basePrice * 0.5
      item.band4 = basePrice * 0.65
      item.band5 = basePrice * 0.8
      item.band6 = basePrice * 1.0
      item.band7 = basePrice * 1.3
      item.band8 = basePrice * 1.6
      item.band9 = basePrice * 2.0

      // Double-check for NaN
      if (isNaN(item.price) || item.price <= 0) item.price = 80000
      Object.keys(item).forEach((key) => {
        if (key.startsWith("band") && (isNaN(item[key]) || item[key] <= 0)) {
          item[key] = basePrice
        }
      })
    })

    return data
  } catch (error) {
    console.error("Error in generateRainbowData:", error)
    return []
  }
}

export function generateCompositeData() {
  try {
    const data = []
    const startDate = new Date("2023-01-01")
    const endDate = new Date("2025-05-26") // Current date: May 26th, 2025

    // Generate base data
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
      const daysSinceStart = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)

      // Base CPI value (0-100)
      const trend = (daysSinceStart / 900) * 60 // Gradual uptrend
      const seasonality = Math.sin(daysSinceStart / 60) * 10 // Cyclical component
      const noise = (Math.random() - 0.5) * 5 // Random noise

      // Base price
      const priceBase = 30000 + daysSinceStart * 150
      const priceNoise = (Math.random() - 0.5) * 5000
      const priceSeason = Math.sin(daysSinceStart / 60) * 10000

      let value = 20 + trend + seasonality + noise
      value = Math.max(0, Math.min(100, value))

      // Ensure value is a valid number
      if (isNaN(value)) {
        value = 50 // Default to middle value
      }

      let price = priceBase + priceNoise + priceSeason
      price = Math.max(20000, price)

      // Ensure price is a valid number
      if (isNaN(price)) {
        price = 80000 // Default to reasonable price
      }

      data.push({
        date: d.toISOString(),
        value,
        price,
      })
    }

    // Adjust the last few months to show approaching cycle top
    const lastThreeMonths = data.slice(-12)
    lastThreeMonths.forEach((item, index) => {
      // CPI accelerates toward the "Sell Zone" (65-80)
      item.value = Math.min(72, item.value + index * 0.5)

      // Price accelerates upward
      item.price = item.price * (1 + index / 24)

      // Double-check for NaN
      if (isNaN(item.value)) item.value = 50
      if (isNaN(item.price)) item.price = 80000
    })

    return data
  } catch (error) {
    console.error("Error in generateCompositeData:", error)
    return []
  }
}

export function generateProjectionData() {
  try {
    const data = []

    // Historical data (past 3 months)
    const startDate = new Date("2025-02-26")
    const currentDate = new Date("2025-05-26")
    const endDate = new Date("2025-12-31")

    // Generate historical data
    for (let d = new Date(startDate); d <= currentDate; d.setDate(d.getDate() + 1)) {
      const daysSinceStart = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      const basePrice = 75000 + daysSinceStart * 200
      const noise = (Math.random() - 0.5) * 3000

      let price = basePrice + noise
      if (isNaN(price) || price <= 0) price = 75000

      data.push({
        date: d.toISOString(),
        price,
        projectedPrice: null,
      })
    }

    // Last historical point is also the first projection point
    if (data.length > 0) {
      const lastHistoricalPrice = data[data.length - 1].price
      data[data.length - 1].projectedPrice = lastHistoricalPrice

      // Generate future projection data
      const peakDate = new Date("2025-08-15")
      const peakPrice = 155000

      // Current date to peak (acceleration phase)
      for (let d = new Date(currentDate); d <= peakDate; d.setDate(d.getDate() + 1)) {
        if (d.getTime() === currentDate.getTime()) continue // Skip current date as it's already added

        const totalDaysToAcceleration = (peakDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        const daysIntoAcceleration = (d.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        const progressRatio = daysIntoAcceleration / totalDaysToAcceleration

        // Accelerating parabolic growth
        const priceGain = (peakPrice - lastHistoricalPrice) * Math.pow(progressRatio, 1.5)
        let projectedPrice = lastHistoricalPrice + priceGain

        // Add some noise for realism
        const noise = (Math.random() - 0.5) * 5000 * progressRatio
        projectedPrice += noise

        // Ensure projectedPrice is a valid number
        if (isNaN(projectedPrice) || projectedPrice <= 0) projectedPrice = lastHistoricalPrice

        data.push({
          date: d.toISOString(),
          price: null,
          projectedPrice,
        })
      }

      // Peak to end of year (decline phase)
      const endYearPrice = 75000

      for (let d = new Date(peakDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (d.getTime() === peakDate.getTime()) continue // Skip peak date as it's already added

        const totalDaysToDecline = (endDate.getTime() - peakDate.getTime()) / (1000 * 60 * 60 * 24)
        const daysIntoDecline = (d.getTime() - peakDate.getTime()) / (1000 * 60 * 60 * 24)
        const progressRatio = daysIntoDecline / totalDaysToDecline

        // Faster initial drop, then slower decline
        const declineFunction = 1 - Math.pow(progressRatio, 0.7)
        let projectedPrice = endYearPrice + (peakPrice - endYearPrice) * declineFunction

        // Add some noise and occasional relief rallies
        let noise = (Math.random() - 0.5) * 7000
        // Add occasional relief rallies
        if (Math.random() > 0.97) {
          noise = Math.random() * 15000
        }
        projectedPrice += noise

        // Ensure projectedPrice is a valid number
        if (isNaN(projectedPrice) || projectedPrice <= 0) projectedPrice = endYearPrice

        data.push({
          date: d.toISOString(),
          price: null,
          projectedPrice,
        })
      }
    }

    return data
  } catch (error) {
    console.error("Error in generateProjectionData:", error)
    return []
  }
}

// Add the missing generateHistoricalComparisonData function
export function generateHistoricalComparisonData() {
  try {
    const priceData = []
    const metricsData = []

    // Generate data for 48 months (full cycle)
    for (let month = 0; month <= 48; month++) {
      // 2017 Cycle data (July 2016 halving)
      let cycle2017 = null
      if (month <= 42) {
        // Exponential growth with some noise
        cycle2017 = 1 * Math.pow(1.08, month) * (1 + (Math.random() - 0.5) * 0.1)
        if (month > 36) {
          // Accelerated growth near peak
          cycle2017 *= Math.pow(1.15, month - 36)
        }
        if (month === 42) cycle2017 = 20 // Peak at 20x
      }

      // 2021 Cycle data (May 2020 halving)
      let cycle2021 = null
      if (month <= 41) {
        // Slightly different growth pattern
        cycle2021 = 1 * Math.pow(1.075, month) * (1 + (Math.random() - 0.5) * 0.1)
        if (month > 35) {
          // Accelerated growth near peak
          cycle2021 *= Math.pow(1.12, month - 35)
        }
        if (month === 41) cycle2021 = 16 // Peak at 16x
      }

      // 2025 Cycle data (April 2024 halving) - current cycle
      let cycle2025 = null
      if (month <= 13) {
        // We're at month 13 now
        // Stronger early growth
        cycle2025 = 1 * Math.pow(1.085, month) * (1 + (Math.random() - 0.5) * 0.05)
        if (month === 13) cycle2025 = 3.4 // Current position
      } else if (month <= 42) {
        // Projected future growth
        const baseGrowth = 3.4 * Math.pow(1.06, month - 13)
        if (month > 36) {
          // Projected acceleration
          cycle2025 = baseGrowth * Math.pow(1.1, month - 36)
        } else {
          cycle2025 = baseGrowth
        }
        if (month >= 39 && month <= 42) {
          // Projected peak range
          cycle2025 = Math.min(cycle2025, 13 + (month - 39) * 0.5)
        }
      }

      // Ensure all cycle values are valid numbers
      if (isNaN(cycle2017)) cycle2017 = null
      if (isNaN(cycle2021)) cycle2021 = null
      if (isNaN(cycle2025)) cycle2025 = null

      priceData.push({
        monthsSinceHalving: month,
        cycle2017,
        cycle2021,
        cycle2025,
      })

      // Composite metrics data
      let composite2017 = null
      if (month <= 42) {
        composite2017 = Math.min(95, 20 + (month / 42) * 70 + (Math.random() - 0.5) * 5)
        if (month > 38) composite2017 = Math.min(95, composite2017 + (month - 38) * 5)
      }

      let composite2021 = null
      if (month <= 41) {
        composite2021 = Math.min(92, 22 + (month / 41) * 68 + (Math.random() - 0.5) * 5)
        if (month > 37) composite2021 = Math.min(92, composite2021 + (month - 37) * 4)
      }

      let composite2025 = null
      if (month <= 13) {
        composite2025 = 25 + (month / 13) * 47 + (Math.random() - 0.5) * 3
        if (month === 13) composite2025 = 72 // Current OCPI
      } else if (month <= 42) {
        // Projected metrics
        composite2025 = 72 + ((month - 13) / 29) * 18 + (Math.random() - 0.5) * 3
        if (month >= 39) composite2025 = Math.min(90, 85 + (month - 39) * 2)
      }

      // Ensure all composite values are valid numbers
      if (isNaN(composite2017)) composite2017 = null
      if (isNaN(composite2021)) composite2021 = null
      if (isNaN(composite2025)) composite2025 = null

      metricsData.push({
        monthsSinceHalving: month,
        composite2017,
        composite2021,
        composite2025,
      })
    }

    return { priceData, metricsData }
  } catch (error) {
    console.error("Error in generateHistoricalComparisonData:", error)
    return { priceData: [], metricsData: [] }
  }
}

export function generateScenarioData() {
  try {
    const data = []

    // Historical data (past 3 months)
    const startDate = new Date("2025-02-26")
    const currentDate = new Date("2025-05-26")
    const endDate = new Date("2025-12-31")

    // Generate historical data
    for (let d = new Date(startDate); d <= currentDate; d.setDate(d.getDate() + 1)) {
      const daysSinceStart = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      const basePrice = 75000 + daysSinceStart * 200
      const noise = (Math.random() - 0.5) * 3000

      let price = basePrice + noise
      if (isNaN(price) || price <= 0) price = 75000

      data.push({
        date: d.toISOString(),
        price,
        bullish: null,
        base: null,
        bearish: null,
      })
    }

    // Last historical point is also the first projection point
    if (data.length > 0) {
      const lastHistoricalPrice = data[data.length - 1].price
      data[data.length - 1].bullish = lastHistoricalPrice
      data[data.length - 1].base = lastHistoricalPrice
      data[data.length - 1].bearish = lastHistoricalPrice

      // Generate future projection data
      const bullishPeakDate = new Date("2025-07-15")
      const basePeakDate = new Date("2025-08-15")
      const bearishPeakDate = new Date("2025-09-15")

      const bullishPeakPrice = 200000
      const basePeakPrice = 155000
      const bearishPeakPrice = 120000

      // Current date to end of year
      for (let d = new Date(currentDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (d.getTime() === currentDate.getTime()) continue // Skip current date as it's already added

        // Bullish scenario
        let bullishPrice = null
        if (d <= bullishPeakDate) {
          const totalDaysToAcceleration = (bullishPeakDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          const daysIntoAcceleration = (d.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          const progressRatio = daysIntoAcceleration / totalDaysToAcceleration

          // Accelerating parabolic growth
          const priceGain = (bullishPeakPrice - lastHistoricalPrice) * Math.pow(progressRatio, 1.3)
          bullishPrice = lastHistoricalPrice + priceGain
        } else {
          // Decline phase
          const totalDaysToDecline = (endDate.getTime() - bullishPeakDate.getTime()) / (1000 * 60 * 60 * 24)
          const daysIntoDecline = (d.getTime() - bullishPeakDate.getTime()) / (1000 * 60 * 60 * 24)
          const progressRatio = daysIntoDecline / totalDaysToDecline

          // Faster initial drop, then slower decline
          const declineFunction = 1 - Math.pow(progressRatio, 0.6)
          bullishPrice = 100000 + (bullishPeakPrice - 100000) * declineFunction
        }

        // Base scenario
        let basePrice = null
        if (d <= basePeakDate) {
          const totalDaysToAcceleration = (basePeakDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          const daysIntoAcceleration = (d.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          const progressRatio = daysIntoAcceleration / totalDaysToAcceleration

          // Accelerating growth
          const priceGain = (basePeakPrice - lastHistoricalPrice) * Math.pow(progressRatio, 1.5)
          basePrice = lastHistoricalPrice + priceGain
        } else {
          // Decline phase
          const totalDaysToDecline = (endDate.getTime() - basePeakDate.getTime()) / (1000 * 60 * 60 * 24)
          const daysIntoDecline = (d.getTime() - basePeakDate.getTime()) / (1000 * 60 * 60 * 24)
          const progressRatio = daysIntoDecline / totalDaysToDecline

          // Decline function
          const declineFunction = 1 - Math.pow(progressRatio, 0.7)
          basePrice = 75000 + (basePeakPrice - 75000) * declineFunction
        }

        // Bearish scenario
        let bearishPrice = null
        if (d <= bearishPeakDate) {
          const totalDaysToAcceleration = (bearishPeakDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          const daysIntoAcceleration = (d.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          const progressRatio = daysIntoAcceleration / totalDaysToAcceleration

          // Slower growth
          const priceGain = (bearishPeakPrice - lastHistoricalPrice) * Math.pow(progressRatio, 1.7)
          bearishPrice = lastHistoricalPrice + priceGain
        } else {
          // Steeper decline phase
          const totalDaysToDecline = (endDate.getTime() - bearishPeakDate.getTime()) / (1000 * 60 * 60 * 24)
          const daysIntoDecline = (d.getTime() - bearishPeakDate.getTime()) / (1000 * 60 * 60 * 24)
          const progressRatio = daysIntoDecline / totalDaysToDecline

          // Steeper decline function
          const declineFunction = 1 - Math.pow(progressRatio, 0.5)
          bearishPrice = 55000 + (bearishPeakPrice - 55000) * declineFunction
        }

        // Ensure all scenario prices are valid numbers
        if (isNaN(bullishPrice)) bullishPrice = null
        if (isNaN(basePrice)) basePrice = null
        if (isNaN(bearishPrice)) bearishPrice = null

        // Add some noise for realism
        const bullishNoise = (Math.random() - 0.5) * 5000
        const baseNoise = (Math.random() - 0.5) * 4000
        const bearishNoise = (Math.random() - 0.5) * 3000

        data.push({
          date: d.toISOString(),
          price: null,
          bullish: bullishPrice + bullishNoise,
          base: basePrice + baseNoise,
          bearish: bearishPrice + bearishNoise,
        })
      }
    }

    return data
  } catch (error) {
    console.error("Error in generateScenarioData:", error)
    return []
  }
}

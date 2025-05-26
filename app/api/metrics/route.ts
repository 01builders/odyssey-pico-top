import { NextResponse } from 'next/server'
import { fetchNUPLData, fetchMVRVData, fetchSOPRData, fetchPriceData, generateCompositeData } from '@/lib/api'

export const runtime = 'edge'
export const revalidate = 3600 // Revalidate every hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')
    const forceRefresh = searchParams.get('refresh') === 'true'

    if (!metric) {
      return NextResponse.json({ error: 'Metric parameter is required' }, { status: 400 })
    }

    let data

    // Fetch data from external APIs
    switch (metric) {
      case 'nupl':
        data = await fetchNUPLData()
        break
      case 'mvrv':
        data = await fetchMVRVData()
        break
      case 'sopr':
        data = await fetchSOPRData()
        break
      case 'price':
        data = await fetchPriceData()
        break
      case 'composite':
        data = await generateCompositeData()
        break
      default:
        return NextResponse.json({ error: 'Invalid metric' }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching metric data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metric data' },
      { status: 500 }
    )
  }
} 
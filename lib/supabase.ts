import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type MetricData = {
  id: string
  date: string
  value: number
  metric_type: 'nupl' | 'mvrv' | 'sopr' | 'price'
  created_at: string
}

export type CompositeData = {
  id: string
  date: string
  value: number
  created_at: string
}

// Helper functions for data operations
export async function getMetricData(metricType: MetricData['metric_type'], limit = 365) {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('metric_type', metricType)
    .order('date', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getCompositeData(limit = 365) {
  const { data, error } = await supabase
    .from('composite_metrics')
    .select('*')
    .order('date', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data
}

export async function insertMetricData(data: Omit<MetricData, 'id' | 'created_at'>[]) {
  const { error } = await supabase
    .from('metrics')
    .insert(data)

  if (error) throw error
}

export async function insertCompositeData(data: Omit<CompositeData, 'id' | 'created_at'>[]) {
  const { error } = await supabase
    .from('composite_metrics')
    .insert(data)

  if (error) throw error
} 
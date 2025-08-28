
'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface RevenueData {
  period: string
  current: number
  previous: number
  growth: number
}

interface RevenueComparisonProps {
  data: RevenueData[]
  height?: number
}

export function RevenueComparison({ data, height = 300 }: RevenueComparisonProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const current = payload.find((p: any) => p.dataKey === 'current')?.value || 0
      const previous = payload.find((p: any) => p.dataKey === 'previous')?.value || 0
      const growth = ((current - previous) / previous * 100).toFixed(1)
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              Actual: {formatCurrency(current)}
            </p>
            <p className="text-sm text-gray-500">
              Anterior: {formatCurrency(previous)}
            </p>
            <p className={`text-sm font-medium ${Number(growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Crecimiento: {growth}%
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="period"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="previous" 
          fill="#E5E7EB" 
          radius={[2, 2, 0, 0]}
          name="Período Anterior"
        />
        <Bar 
          dataKey="current" 
          fill="#3B82F6" 
          radius={[2, 2, 0, 0]}
          name="Período Actual"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

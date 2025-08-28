
'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface SalesData {
  month: string
  sales: number
  invoices: number
  previousYear?: number
}

interface SalesChartProps {
  data: SalesData[]
  type?: 'line' | 'area'
  height?: number
  showComparison?: boolean
}

export function SalesChart({ data, type = 'area', height = 300, showComparison = false }: SalesChartProps) {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      salesFormatted: formatCurrency(item.sales),
      previousYearFormatted: item.previousYear ? formatCurrency(item.previousYear) : null
    }))
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Ventas') ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
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
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            name="Ventas"
          />
          {showComparison && (
            <Line
              type="monotone"
              dataKey="previousYear"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#94A3B8', strokeWidth: 2, r: 3 }}
              name="Año Anterior"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
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
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
          {showComparison && (
            <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.1}/>
            </linearGradient>
          )}
        </defs>
        <Area
          type="monotone"
          dataKey="sales"
          stroke="#3B82F6"
          fillOpacity={1}
          fill="url(#colorSales)"
          strokeWidth={2}
          name="Ventas"
        />
        {showComparison && (
          <Area
            type="monotone"
            dataKey="previousYear"
            stroke="#94A3B8"
            fillOpacity={1}
            fill="url(#colorPrevious)"
            strokeWidth={2}
            name="Año Anterior"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}

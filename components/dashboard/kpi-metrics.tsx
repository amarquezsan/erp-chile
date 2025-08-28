
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatNumber } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Package,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'

interface KPIData {
  title: string
  value: string
  previousValue?: string
  change?: number
  trend?: 'up' | 'down' | 'stable'
  icon: any
  color: string
  bgColor: string
  description?: string
}

interface KPIMetricsProps {
  metrics: KPIData[]
  loading?: boolean
}

export function KPIMetrics({ metrics, loading }: KPIMetricsProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                
                {metric.change !== undefined && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend || 'stable')}
                      <span className={`text-sm font-medium ${getTrendColor(metric.trend || 'stable')}`}>
                        {Math.abs(metric.change).toFixed(1)}%
                      </span>
                    </div>
                    {metric.previousValue && (
                      <span className="text-xs text-gray-500">
                        vs {metric.previousValue}
                      </span>
                    )}
                  </div>
                )}

                {metric.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {metric.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Hook para generar métricas de ejemplo
export function useKPIMetrics(data: any) {
  if (!data) return []

  return [
    {
      title: 'Ventas del Mes',
      value: formatCurrency(data.monthSales),
      previousValue: formatCurrency(data.previousMonthSales || 0),
      change: data.previousMonthSales ? ((data.monthSales - data.previousMonthSales) / data.previousMonthSales) * 100 : 0,
      trend: data.monthSales > (data.previousMonthSales || 0) ? 'up' as const : 'down' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Comparado con mes anterior'
    },
    {
      title: 'Facturas Emitidas',
      value: formatNumber(data.totalInvoices),
      previousValue: formatNumber(data.previousMonthInvoices || 0),
      change: data.previousMonthInvoices ? ((data.totalInvoices - data.previousMonthInvoices) / data.previousMonthInvoices) * 100 : 0,
      trend: data.totalInvoices > (data.previousMonthInvoices || 0) ? 'up' as const : 'down' as const,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Este mes'
    },
    {
      title: 'Nuevos Clientes',
      value: formatNumber(data.newClientsThisMonth || 0),
      previousValue: formatNumber(data.newClientsPreviousMonth || 0),
      change: data.newClientsPreviousMonth ? ((data.newClientsThisMonth - data.newClientsPreviousMonth) / data.newClientsPreviousMonth) * 100 : 0,
      trend: data.newClientsThisMonth > (data.newClientsPreviousMonth || 0) ? 'up' as const : 'down' as const,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Últimos 30 días'
    },
    {
      title: 'Productos Activos',
      value: formatNumber(data.activeProducts || 0),
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'En inventario'
    },
    {
      title: 'Facturación Promedio',
      value: formatCurrency(data.averageInvoiceValue || 0),
      previousValue: formatCurrency(data.previousAverageInvoiceValue || 0),
      change: data.previousAverageInvoiceValue ? ((data.averageInvoiceValue - data.previousAverageInvoiceValue) / data.previousAverageInvoiceValue) * 100 : 0,
      trend: data.averageInvoiceValue > (data.previousAverageInvoiceValue || 0) ? 'up' as const : 'down' as const,
      icon: TrendingUp,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Por factura'
    },
    {
      title: 'Tiempo Pago Promedio',
      value: `${data.averagePaymentTime || 0} días`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Tiempo de cobro'
    },
    {
      title: 'Tasa de Aceptación',
      value: `${(data.acceptanceRate || 0).toFixed(1)}%`,
      previousValue: `${(data.previousAcceptanceRate || 0).toFixed(1)}%`,
      change: data.previousAcceptanceRate ? data.acceptanceRate - data.previousAcceptanceRate : 0,
      trend: data.acceptanceRate > (data.previousAcceptanceRate || 0) ? 'up' as const : 'down' as const,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Facturas aceptadas por SII'
    },
    {
      title: 'Cuentas por Cobrar',
      value: formatCurrency(data.pendingPayments || 0),
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Facturas pendientes de pago'
    }
  ]
}


'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatNumber } from '@/lib/utils'
import {
  TrendingUp,
  FileText,
  Users,
  Package,
  AlertTriangle,
  DollarSign,
  Calendar,
  CheckCircle2,
  BarChart3,
  PieChart,
  TrendingDown,
  Activity
} from 'lucide-react'
import { KPIMetrics, useKPIMetrics } from './kpi-metrics'
import { SalesChart } from '../charts/sales-chart'
import { InvoiceStatusChart } from '../charts/invoice-status-chart'
import { RevenueComparison } from '../charts/revenue-comparison'

interface DashboardData {
  totalSales: number
  todaySales: number
  monthSales: number
  previousMonthSales: number
  yearSales: number
  totalInvoices: number
  pendingInvoices: number
  totalClients: number
  activeClients: number
  totalProducts: number
  lowStockProducts: number
  newClientsThisMonth: number
  newClientsPreviousMonth: number
  previousMonthInvoices: number
  averageInvoiceValue: number
  previousAverageInvoiceValue: number
  acceptanceRate: number
  previousAcceptanceRate: number
  pendingPayments: number
  activeProducts: number
  averagePaymentTime: number
  invoicesByStatus: { name: string; value: number }[]
  salesByMonth: { month: string; sales: number; invoices: number; previousYear: number }[]
  revenueComparison: { period: string; current: number; previous: number; growth: number }[]
  recentInvoices: any[]
  lowStockItems: any[]
}

export function DashboardOverview() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (response.ok) {
          const dashboardData = await response.json()
          setData(dashboardData)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'loading') {
      return
    }
    
    if (session?.user?.companyId) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [session, status])

  const kpiMetrics = useKPIMetrics(data)

  if (loading) {
    return <KPIMetrics metrics={[]} loading={true} />
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error cargando dashboard
        </h3>
        <p className="text-gray-500">No se pudieron cargar los datos del dashboard</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header con métricas principales */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">
              Resumen ejecutivo de {session?.user?.companyName || 'tu empresa'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Datos actualizados en tiempo real</span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid - Inspirado en Defontana */}
      <KPIMetrics metrics={kpiMetrics} />

      {/* Tabs para diferentes vistas como Defontana */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Facturación
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Actividad
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Resumen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de ventas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Evolución de Ventas
                </CardTitle>
                <CardDescription>
                  Últimos 6 meses con comparación año anterior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart 
                  data={data.salesByMonth} 
                  type="area" 
                  height={350}
                  showComparison={true}
                />
              </CardContent>
            </Card>

            {/* Comparación de ingresos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Comparación Trimestral
                </CardTitle>
                <CardDescription>
                  Ingresos por trimestre vs período anterior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueComparison 
                  data={data.revenueComparison} 
                  height={350}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estado de facturas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-600" />
                  Estado de Facturas
                </CardTitle>
                <CardDescription>
                  Distribución por estado actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InvoiceStatusChart 
                  data={data.invoicesByStatus} 
                  height={350}
                />
              </CardContent>
            </Card>

            {/* Facturas recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Facturas Recientes
                </CardTitle>
                <CardDescription>
                  Últimas facturas emitidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.recentInvoices?.length > 0 ? (
                  <div className="space-y-4">
                    {data.recentInvoices.map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              Factura N° {invoice.number}
                            </p>
                            <p className="text-xs text-gray-500">
                              {invoice.client?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            {formatCurrency(invoice.total)}
                          </p>
                          <Badge 
                            variant={
                              invoice.status === 'PAID' ? 'default' :
                              invoice.status === 'ACCEPTED' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {invoice.status === 'PAID' ? 'Pagada' :
                             invoice.status === 'ACCEPTED' ? 'Aceptada' :
                             invoice.status === 'SENT' ? 'Enviada' : 'Borrador'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No hay facturas recientes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alertas de stock */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Alertas de Stock
                </CardTitle>
                <CardDescription>
                  Productos que requieren reposición
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.lowStockItems?.length > 0 ? (
                  <div className="space-y-4">
                    {data.lowStockItems.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              Código: {product.code}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-red-600">
                            {product.stock} {product.unit}
                          </p>
                          <p className="text-xs text-gray-500">
                            Min: {product.minStock}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No hay alertas de stock</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estado del sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Estado del Sistema
                </CardTitle>
                <CardDescription>
                  Información de la empresa y usuario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 font-medium text-sm">Sistema Operativo</span>
                    </div>
                    <p className="text-xs text-green-600">Todos los servicios funcionando correctamente</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-1">Usuario Actual</p>
                      <p className="text-gray-600">
                        {session?.user?.firstName} {session?.user?.lastName}
                      </p>
                      <p className="text-gray-500 text-xs">{session?.user?.email}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-1">Empresa</p>
                      <p className="text-gray-600">{session?.user?.companyName}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* Resumen ejecutivo estilo Defontana */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Facturación Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-900">
                    {formatCurrency(data.monthSales)}
                  </div>
                  <div className="flex items-center gap-2">
                    {data.monthSales > data.previousMonthSales ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${data.monthSales > data.previousMonthSales ? 'text-green-600' : 'text-red-600'}`}>
                      {data.previousMonthSales > 0 
                        ? `${(((data.monthSales - data.previousMonthSales) / data.previousMonthSales) * 100).toFixed(1)}%`
                        : '0%'
                      } vs mes anterior
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Facturas Emitidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-900">
                    {formatNumber(data.totalInvoices)}
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">
                      {formatNumber(data.pendingInvoices)} pendientes
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">Clientes Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-900">
                    {formatNumber(data.activeClients)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-600">
                      de {formatNumber(data.totalClients)} total
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

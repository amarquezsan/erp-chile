
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users, 
  Package,
  Download,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react'

interface ReportData {
  name: string
  value: number
  change?: number
  period?: string
}

interface ChartData {
  name: string
  ventas: number
  compras: number
  ganancia: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function ReportsOverview() {
  const { data: session } = useSession() || {}
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedReport, setSelectedReport] = useState('sales')

  // Datos de ejemplo para reportes
  const kpiData = {
    sales: { value: 4520000, change: 12.5, period: 'vs mes anterior' },
    purchases: { value: 2100000, change: -8.2, period: 'vs mes anterior' },
    profit: { value: 2420000, change: 15.8, period: 'vs mes anterior' },
    customers: { value: 142, change: 5.3, period: 'vs mes anterior' }
  }

  const salesByMonth: ChartData[] = [
    { name: 'Ene', ventas: 2400000, compras: 1200000, ganancia: 1200000 },
    { name: 'Feb', ventas: 2800000, compras: 1400000, ganancia: 1400000 },
    { name: 'Mar', ventas: 3200000, compras: 1500000, ganancia: 1700000 },
    { name: 'Abr', ventas: 3800000, compras: 1800000, ganancia: 2000000 },
    { name: 'May', ventas: 4200000, compras: 2000000, ganancia: 2200000 },
    { name: 'Jun', ventas: 4520000, compras: 2100000, ganancia: 2420000 }
  ]

  const productSales = [
    { name: 'Producto A', value: 35, color: COLORS[0] },
    { name: 'Producto B', value: 25, color: COLORS[1] },
    { name: 'Producto C', value: 20, color: COLORS[2] },
    { name: 'Producto D', value: 12, color: COLORS[3] },
    { name: 'Otros', value: 8, color: COLORS[4] }
  ]

  const clientsByRegion = [
    { name: 'Metropolitana', clientes: 85 },
    { name: 'Valparaíso', clientes: 23 },
    { name: 'Biobío', clientes: 19 },
    { name: 'Antofagasta', clientes: 15 }
  ]

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('es-CL')}`
  }

  const getChangeIcon = (change: number) => {
    return change > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const generateReport = async (reportType: string) => {
    // En una implementación real, generarías y descargarías el reporte
    console.log(`Generating ${reportType} report...`)
    // toast.success(`Reporte ${reportType} generado exitosamente`)
  }

  return (
    <div className="space-y-6">
      {/* Controles de periodo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diario</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => generateReport('sales')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={() => generateReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(kpiData.sales.value)}
                </p>
                <div className="flex items-center mt-1">
                  {getChangeIcon(kpiData.sales.change)}
                  <span className={`text-sm ml-1 ${kpiData.sales.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(kpiData.sales.change)}% {kpiData.sales.period}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compras Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(kpiData.purchases.value)}
                </p>
                <div className="flex items-center mt-1">
                  {getChangeIcon(kpiData.purchases.change)}
                  <span className={`text-sm ml-1 ${kpiData.purchases.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(kpiData.purchases.change)}% {kpiData.purchases.period}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Package className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ganancia</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(kpiData.profit.value)}
                </p>
                <div className="flex items-center mt-1">
                  {getChangeIcon(kpiData.profit.change)}
                  <span className={`text-sm ml-1 ${kpiData.profit.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(kpiData.profit.change)}% {kpiData.profit.period}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{kpiData.customers.value}</p>
                <div className="flex items-center mt-1">
                  {getChangeIcon(kpiData.customers.change)}
                  <span className={`text-sm ml-1 ${kpiData.customers.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(kpiData.customers.change)}% {kpiData.customers.period}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y análisis */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ventas
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center">
            <LineChartIcon className="h-4 w-4 mr-2" />
            Financiero
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Ventas y Compras</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Bar dataKey="ventas" fill="#3b82f6" name="Ventas" />
                  <Bar dataKey="compras" fill="#ef4444" name="Compras" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Ventas por Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productSales}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productSales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productSales.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded mr-3" 
                          style={{ backgroundColor: product.color }}
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <Badge variant="secondary">{product.value}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clientes por Región</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientsByRegion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clientes" fill="#10b981" name="Clientes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Ganancias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Ganancia']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ganancia" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reportes rápidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Reportes Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col justify-center"
              onClick={() => generateReport('sales-detailed')}
            >
              <FileText className="h-6 w-6 mb-2" />
              Reporte de Ventas Detallado
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col justify-center"
              onClick={() => generateReport('inventory')}
            >
              <Package className="h-6 w-6 mb-2" />
              Reporte de Inventario
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col justify-center"
              onClick={() => generateReport('clients')}
            >
              <Users className="h-6 w-6 mb-2" />
              Reporte de Clientes
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col justify-center"
              onClick={() => generateReport('financial')}
            >
              <DollarSign className="h-6 w-6 mb-2" />
              Reporte Financiero
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col justify-center"
              onClick={() => generateReport('tax')}
            >
              <Calendar className="h-6 w-6 mb-2" />
              Reporte Tributario
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col justify-center"
              onClick={() => generateReport('purchases')}
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              Reporte de Compras
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

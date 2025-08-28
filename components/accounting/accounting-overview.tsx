
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calculator, 
  Plus, 
  Search, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Eye,
  Edit,
  BookOpen
} from 'lucide-react'

interface Account {
  id: string
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  parentId?: string
  balance: number
  children?: Account[]
}

interface Transaction {
  id: string
  date: string
  reference: string
  description: string
  entries: TransactionEntry[]
  total: number
}

interface TransactionEntry {
  accountId: string
  accountName: string
  debit: number
  credit: number
}

export function AccountingOverview() {
  const { data: session } = useSession() || {}
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [searchTerm, setSearchTerm] = useState('')

  // Plan de cuentas de ejemplo (basado en estándares chilenos)
  const chartOfAccounts: Account[] = [
    // Activos
    {
      id: '1',
      code: '1',
      name: 'ACTIVOS',
      type: 'asset',
      balance: 15500000,
      children: [
        {
          id: '11',
          code: '11',
          name: 'Activos Corrientes',
          type: 'asset',
          balance: 8500000,
          children: [
            { id: '111', code: '1101', name: 'Caja', type: 'asset', balance: 500000 },
            { id: '112', code: '1102', name: 'Banco Corriente', type: 'asset', balance: 2500000 },
            { id: '113', code: '1103', name: 'Cuentas por Cobrar', type: 'asset', balance: 3200000 },
            { id: '114', code: '1104', name: 'Inventario', type: 'asset', balance: 2300000 }
          ]
        },
        {
          id: '12',
          code: '12',
          name: 'Activos No Corrientes',
          type: 'asset',
          balance: 7000000,
          children: [
            { id: '121', code: '1201', name: 'Maquinaria y Equipos', type: 'asset', balance: 5000000 },
            { id: '122', code: '1202', name: 'Vehículos', type: 'asset', balance: 2000000 }
          ]
        }
      ]
    },
    // Pasivos
    {
      id: '2',
      code: '2',
      name: 'PASIVOS',
      type: 'liability',
      balance: 6800000,
      children: [
        {
          id: '21',
          code: '21',
          name: 'Pasivos Corrientes',
          type: 'liability',
          balance: 4300000,
          children: [
            { id: '211', code: '2101', name: 'Cuentas por Pagar', type: 'liability', balance: 2100000 },
            { id: '212', code: '2102', name: 'IVA por Pagar', type: 'liability', balance: 800000 },
            { id: '213', code: '2103', name: 'Sueldos por Pagar', type: 'liability', balance: 1400000 }
          ]
        },
        {
          id: '22',
          code: '22',
          name: 'Pasivos No Corrientes',
          type: 'liability',
          balance: 2500000,
          children: [
            { id: '221', code: '2201', name: 'Préstamos Bancarios', type: 'liability', balance: 2500000 }
          ]
        }
      ]
    },
    // Patrimonio
    {
      id: '3',
      code: '3',
      name: 'PATRIMONIO',
      type: 'equity',
      balance: 8700000,
      children: [
        { id: '301', code: '3001', name: 'Capital', type: 'equity', balance: 5000000 },
        { id: '302', code: '3002', name: 'Utilidades Retenidas', type: 'equity', balance: 3700000 }
      ]
    },
    // Ingresos
    {
      id: '4',
      code: '4',
      name: 'INGRESOS',
      type: 'revenue',
      balance: 12500000,
      children: [
        { id: '401', code: '4001', name: 'Ventas', type: 'revenue', balance: 12500000 }
      ]
    },
    // Gastos
    {
      id: '5',
      code: '5',
      name: 'GASTOS',
      type: 'expense',
      balance: 8200000,
      children: [
        { id: '501', code: '5001', name: 'Costo de Ventas', type: 'expense', balance: 6000000 },
        { id: '502', code: '5002', name: 'Gastos de Administración', type: 'expense', balance: 1500000 },
        { id: '503', code: '5003', name: 'Gastos de Ventas', type: 'expense', balance: 700000 }
      ]
    }
  ]

  // Transacciones recientes
  const recentTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-08-20',
      reference: 'FAC-001',
      description: 'Venta de productos a cliente A',
      total: 119000,
      entries: [
        { accountId: '113', accountName: 'Cuentas por Cobrar', debit: 119000, credit: 0 },
        { accountId: '401', accountName: 'Ventas', debit: 0, credit: 100000 },
        { accountId: '212', accountName: 'IVA por Pagar', debit: 0, credit: 19000 }
      ]
    },
    {
      id: '2',
      date: '2024-08-19',
      reference: 'PAG-001',
      description: 'Pago a proveedor XYZ',
      total: 238000,
      entries: [
        { accountId: '211', accountName: 'Cuentas por Pagar', debit: 238000, credit: 0 },
        { accountId: '112', accountName: 'Banco Corriente', debit: 0, credit: 238000 }
      ]
    },
    {
      id: '3',
      date: '2024-08-18',
      reference: 'NOM-001',
      description: 'Pago de nómina agosto',
      total: 1400000,
      entries: [
        { accountId: '213', accountName: 'Sueldos por Pagar', debit: 1400000, credit: 0 },
        { accountId: '112', accountName: 'Banco Corriente', debit: 0, credit: 1400000 }
      ]
    }
  ]

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('es-CL')}`
  }

  const getAccountTypeLabel = (type: Account['type']) => {
    const types = {
      asset: 'Activo',
      liability: 'Pasivo',
      equity: 'Patrimonio',
      revenue: 'Ingreso',
      expense: 'Gasto'
    }
    return types[type]
  }

  const getAccountTypeColor = (type: Account['type']) => {
    const colors = {
      asset: 'bg-green-100 text-green-800',
      liability: 'bg-red-100 text-red-800',
      equity: 'bg-blue-100 text-blue-800',
      revenue: 'bg-purple-100 text-purple-800',
      expense: 'bg-orange-100 text-orange-800'
    }
    return colors[type]
  }

  const renderAccountTree = (accounts: Account[], level = 0) => {
    return accounts.map(account => (
      <div key={account.id}>
        <div className={`flex items-center justify-between p-2 hover:bg-gray-50 ${level > 0 ? `ml-${level * 4}` : ''}`}>
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm text-gray-500 w-16">{account.code}</span>
            <span className={`font-medium ${level === 0 ? 'text-lg' : ''}`}>
              {account.name}
            </span>
            <Badge className={getAccountTypeColor(account.type)} variant="secondary">
              {getAccountTypeLabel(account.type)}
            </Badge>
          </div>
          <span className="font-medium">{formatCurrency(account.balance)}</span>
        </div>
        {account.children && renderAccountTree(account.children, level + 1)}
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activos</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(15500000)}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Total Pasivos</p>
                <p className="text-2xl font-bold text-red-700">
                  {formatCurrency(6800000)}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patrimonio</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(8700000)}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Resultado</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(4300000)}
                </p>
                <p className="text-xs text-gray-500">Utilidad del período</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas principales */}
      <Tabs defaultValue="chart" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Plan de Cuentas
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Movimientos
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            Estados Financieros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Plan de Cuentas
                </span>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Cuenta
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {renderAccountTree(chartOfAccounts)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar transacciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Mes Actual</SelectItem>
                  <SelectItem value="previous">Mes Anterior</SelectItem>
                  <SelectItem value="quarter">Trimestre</SelectItem>
                  <SelectItem value="year">Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Asiento
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Movimientos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Referencia</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString('es-CL')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.reference}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{formatCurrency(transaction.total)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Balance General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center font-semibold text-lg border-b pb-2">
                    <span>ACTIVOS</span>
                    <span>{formatCurrency(15500000)}</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <div className="flex justify-between">
                      <span>Activos Corrientes</span>
                      <span>{formatCurrency(8500000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Activos No Corrientes</span>
                      <span>{formatCurrency(7000000)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center font-semibold text-lg border-b pb-2">
                    <span>PASIVOS</span>
                    <span>{formatCurrency(6800000)}</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <div className="flex justify-between">
                      <span>Pasivos Corrientes</span>
                      <span>{formatCurrency(4300000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pasivos No Corrientes</span>
                      <span>{formatCurrency(2500000)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center font-semibold text-lg border-b pb-2">
                    <span>PATRIMONIO</span>
                    <span>{formatCurrency(8700000)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center font-bold text-xl border-t-2 pt-2">
                  <span>TOTAL PASIVOS + PATRIMONIO</span>
                  <span>{formatCurrency(15500000)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Resultados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>INGRESOS</span>
                    <span className="text-green-600">{formatCurrency(12500000)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>GASTOS</span>
                    <span className="text-red-600">{formatCurrency(8200000)}</span>
                  </div>
                  <div className="ml-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Costo de Ventas</span>
                      <span>{formatCurrency(6000000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gastos de Administración</span>
                      <span>{formatCurrency(1500000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gastos de Ventas</span>
                      <span>{formatCurrency(700000)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center font-bold text-xl border-t-2 pt-2">
                  <span>UTILIDAD NETA</span>
                  <span className="text-green-600">{formatCurrency(4300000)}</span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Margen Bruto:</span>
                    <span>52%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margen Neto:</span>
                    <span>34.4%</span>
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

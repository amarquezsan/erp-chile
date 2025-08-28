
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Invoice } from '@/lib/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Plus, Search, FileText, Calendar, Clock, CheckCircle, AlertCircle, Ban } from 'lucide-react'

export function InvoicesList() {
  const { data: session, status } = useSession()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/invoices')
        if (response.ok) {
          const data = await response.json()
          setInvoices(data)
          setFilteredInvoices(data)
        }
      } catch (error) {
        console.error('Error fetching invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'loading') {
      return
    }
    
    if (session?.user?.companyId) {
      fetchInvoices()
    } else {
      setLoading(false)
    }
  }, [session, status])

  useEffect(() => {
    const filtered = invoices.filter(invoice =>
      invoice.number.toString().includes(searchTerm) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredInvoices(filtered)
  }, [searchTerm, invoices])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Borrador' },
      SENT: { color: 'bg-blue-100 text-blue-800', icon: Calendar, label: 'Enviada' },
      ACCEPTED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Aceptada' },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Rechazada' },
      CANCELED: { color: 'bg-gray-100 text-gray-800', icon: Ban, label: 'Cancelada' },
      PAID: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Pagada' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </div>
    )
  }

  const getTypeLabel = (type: string) => {
    const types = {
      FACTURA: 'Factura',
      BOLETA: 'Boleta',
      NOTA_CREDITO: 'Nota Crédito',
      NOTA_DEBITO: 'Nota Débito',
      FACTURA_EXENTA: 'Factura Exenta'
    }
    return types[type as keyof typeof types] || type
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const pendingCount = invoices.filter(inv => inv.status === 'SENT' || inv.status === 'DRAFT').length
  const acceptedCount = invoices.filter(inv => inv.status === 'ACCEPTED' || inv.status === 'PAID').length

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar facturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Facturas</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div className="text-green-600">$</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aceptadas</p>
                <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron facturas' : 'No hay facturas registradas'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? `No hay facturas que coincidan con "${searchTerm}"`
                : 'Comienza creando tu primera factura electrónica'
              }
            </p>
            {!searchTerm && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Crear Factura
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {getTypeLabel(invoice.type)} N° {invoice.number}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {invoice.client.name}
                    </p>
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Fecha Emisión</p>
                    <p className="font-medium">
                      {new Date(invoice.issueDate).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  {invoice.dueDate && (
                    <div>
                      <p className="text-gray-500">Fecha Vencimiento</p>
                      <p className="font-medium">
                        {new Date(invoice.dueDate).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Subtotal</p>
                      <p className="font-medium">{formatCurrency(invoice.subtotal)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">IVA</p>
                      <p className="font-medium">{formatCurrency(invoice.taxAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-bold text-green-600">{formatCurrency(invoice.total)}</p>
                    </div>
                  </div>
                </div>

                {invoice.siiStatus && (
                  <div className="pt-2 border-t">
                    <div className="text-sm">
                      <p className="text-gray-500">Estado SII</p>
                      <p className="font-medium">{invoice.siiStatus}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

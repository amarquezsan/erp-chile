
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Eye, Edit, FileText, Send, Check, X, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface Quote {
  id: string
  number: string
  clientId: string
  clientName: string
  date: string
  validUntil: string
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'
  totalAmount: number
  items: QuoteItem[]
  notes?: string
  terms?: string
}

interface QuoteItem {
  productId: string
  productName: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Client {
  id: string
  name: string
  email: string
}

interface Product {
  id: string
  name: string
  price: number
}

export function QuotesList() {
  const { data: session } = useSession() || {}
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  const [formData, setFormData] = useState({
    clientId: '',
    validUntil: '',
    notes: '',
    terms: 'Cotización válida por 30 días. Precios incluyen IVA. Condiciones de pago: 30 días.',
    items: [{ productId: '', description: '', quantity: 1, unitPrice: 0 }]
  })

  useEffect(() => {
    if (session?.user?.email) {
      fetchQuotes()
      fetchClients()
      fetchProducts()
    }
  }, [session])

  useEffect(() => {
    filterQuotes()
  }, [quotes, searchTerm, statusFilter])

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quotes')
      if (response.ok) {
        const data = await response.json()
        setQuotes(data)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast.error('Error al cargar las cotizaciones')
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const filterQuotes = () => {
    let filtered = quotes

    if (searchTerm) {
      filtered = filtered.filter(quote =>
        quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter)
    }

    setFilteredQuotes(filtered)
  }

  const handleCreateQuote = async () => {
    try {
      const selectedClient = clients.find(c => c.id === formData.clientId)
      if (!selectedClient) {
        toast.error('Selecciona un cliente')
        return
      }

      const quoteItems = formData.items.map(item => {
        const product = products.find(p => p.id === item.productId)
        return {
          ...item,
          productName: product?.name || '',
          total: item.quantity * item.unitPrice
        }
      })

      const totalAmount = quoteItems.reduce((sum, item) => sum + item.total, 0)

      const newQuote = {
        clientId: formData.clientId,
        clientName: selectedClient.name,
        validUntil: formData.validUntil,
        notes: formData.notes,
        terms: formData.terms,
        items: quoteItems,
        totalAmount
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
      })

      if (response.ok) {
        toast.success('Cotización creada exitosamente')
        setIsCreateDialogOpen(false)
        resetForm()
        fetchQuotes()
      } else {
        toast.error('Error al crear la cotización')
      }
    } catch (error) {
      console.error('Error creating quote:', error)
      toast.error('Error al crear la cotización')
    }
  }

  const resetForm = () => {
    setFormData({
      clientId: '',
      validUntil: '',
      notes: '',
      terms: 'Cotización válida por 30 días. Precios incluyen IVA. Condiciones de pago: 30 días.',
      items: [{ productId: '', description: '', quantity: 1, unitPrice: 0 }]
    })
  }

  const getStatusBadge = (status: Quote['status']) => {
    const statusConfig = {
      draft: { label: 'Borrador', variant: 'secondary' as const, icon: Edit },
      sent: { label: 'Enviada', variant: 'default' as const, icon: Send },
      approved: { label: 'Aprobada', variant: 'default' as const, icon: Check },
      rejected: { label: 'Rechazada', variant: 'destructive' as const, icon: X },
      expired: { label: 'Vencida', variant: 'secondary' as const, icon: Clock }
    }
    return statusConfig[status] || { label: status, variant: 'secondary' as const, icon: Edit }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', description: '', quantity: 1, unitPrice: 0 }]
    })
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index)
      })
    }
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === 'productId') {
      const product = products.find(p => p.id === value)
      if (product) {
        updatedItems[index].unitPrice = product.price
        updatedItems[index].description = `${product.name}`
      }
    }

    setFormData({ ...formData, items: updatedItems })
  }

  const sendQuote = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/send`, {
        method: 'POST'
      })
      
      if (response.ok) {
        toast.success('Cotización enviada exitosamente')
        fetchQuotes()
      } else {
        toast.error('Error al enviar la cotización')
      }
    } catch (error) {
      console.error('Error sending quote:', error)
      toast.error('Error al enviar la cotización')
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por número o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="draft">Borrador</SelectItem>
            <SelectItem value="sent">Enviada</SelectItem>
            <SelectItem value="approved">Aprobada</SelectItem>
            <SelectItem value="rejected">Rechazada</SelectItem>
            <SelectItem value="expired">Vencida</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cotización
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Cotización</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Válida Hasta</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Productos y Servicios</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Ítem
                  </Button>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="space-y-2">
                        <Label>Producto</Label>
                        <Select 
                          value={item.productId} 
                          onValueChange={(value) => updateItem(index, 'productId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Precio Unit.</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="text-sm font-medium mr-4">
                          Total: ${(item.quantity * item.unitPrice).toLocaleString('es-CL')}
                        </div>
                        {formData.items.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Descripción detallada del producto o servicio..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Términos y Condiciones</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas adicionales..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateQuote}>
                  Crear Cotización
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de cotizaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Cotizaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Válida Hasta</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.length > 0 ? (
                  filteredQuotes.map((quote) => {
                    const status = getStatusBadge(quote.status)
                    const StatusIcon = status.icon
                    return (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.number}</TableCell>
                        <TableCell>{quote.clientName}</TableCell>
                        <TableCell>{new Date(quote.date).toLocaleDateString('es-CL')}</TableCell>
                        <TableCell>
                          {new Date(quote.validUntil).toLocaleDateString('es-CL')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="flex items-center w-fit">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>${quote.totalAmount.toLocaleString('es-CL')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedQuote(quote)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {quote.status === 'draft' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => sendQuote(quote.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No se encontraron cotizaciones que coincidan con los filtros.'
                        : 'No hay cotizaciones registradas.'
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

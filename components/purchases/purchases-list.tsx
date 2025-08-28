
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
import { Plus, Search, Eye, Edit, ShoppingCart, Package } from 'lucide-react'
import { toast } from 'sonner'

interface Purchase {
  id: string
  number: string
  supplierId: string
  supplierName: string
  date: string
  deliveryDate: string | null
  status: 'draft' | 'sent' | 'received' | 'cancelled'
  totalAmount: number
  items: PurchaseItem[]
  notes?: string
}

interface PurchaseItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

interface Supplier {
  id: string
  name: string
  rut: string
  email: string
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

export function PurchasesList() {
  const { data: session } = useSession() || {}
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)

  const [formData, setFormData] = useState({
    supplierId: '',
    deliveryDate: '',
    notes: '',
    items: [{ productId: '', quantity: 1, unitPrice: 0 }]
  })

  useEffect(() => {
    if (session?.user?.email) {
      fetchPurchases()
      fetchSuppliers()
      fetchProducts()
    }
  }, [session])

  useEffect(() => {
    filterPurchases()
  }, [purchases, searchTerm, statusFilter])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases')
      if (response.ok) {
        const data = await response.json()
        setPurchases(data)
      }
    } catch (error) {
      console.error('Error fetching purchases:', error)
      toast.error('Error al cargar las compras')
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers')
      if (response.ok) {
        const data = await response.json()
        setSuppliers(data)
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error)
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

  const filterPurchases = () => {
    let filtered = purchases

    if (searchTerm) {
      filtered = filtered.filter(purchase =>
        purchase.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(purchase => purchase.status === statusFilter)
    }

    setFilteredPurchases(filtered)
  }

  const handleCreatePurchase = async () => {
    try {
      const selectedSupplier = suppliers.find(s => s.id === formData.supplierId)
      if (!selectedSupplier) {
        toast.error('Selecciona un proveedor')
        return
      }

      const purchaseItems = formData.items.map(item => {
        const product = products.find(p => p.id === item.productId)
        return {
          ...item,
          productName: product?.name || '',
          total: item.quantity * item.unitPrice
        }
      })

      const totalAmount = purchaseItems.reduce((sum, item) => sum + item.total, 0)

      const newPurchase = {
        supplierId: formData.supplierId,
        supplierName: selectedSupplier.name,
        deliveryDate: formData.deliveryDate || null,
        notes: formData.notes,
        items: purchaseItems,
        totalAmount
      }

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPurchase)
      })

      if (response.ok) {
        toast.success('Orden de compra creada exitosamente')
        setIsCreateDialogOpen(false)
        setFormData({
          supplierId: '',
          deliveryDate: '',
          notes: '',
          items: [{ productId: '', quantity: 1, unitPrice: 0 }]
        })
        fetchPurchases()
      } else {
        toast.error('Error al crear la orden de compra')
      }
    } catch (error) {
      console.error('Error creating purchase:', error)
      toast.error('Error al crear la orden de compra')
    }
  }

  const getStatusBadge = (status: Purchase['status']) => {
    const statusConfig = {
      draft: { label: 'Borrador', variant: 'secondary' as const },
      sent: { label: 'Enviada', variant: 'default' as const },
      received: { label: 'Recibida', variant: 'default' as const },
      cancelled: { label: 'Cancelada', variant: 'destructive' as const }
    }
    return statusConfig[status] || { label: status, variant: 'secondary' as const }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, unitPrice: 0 }]
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
      }
    }

    setFormData({ ...formData, items: updatedItems })
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por número o proveedor..."
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
            <SelectItem value="received">Recibida</SelectItem>
            <SelectItem value="cancelled">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Compra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Orden de Compra</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Select value={formData.supplierId} onValueChange={(value) => setFormData({ ...formData, supplierId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name} - {supplier.rut}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Fecha de Entrega</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Productos</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Producto</Label>
                      <Select 
                        value={item.productId} 
                        onValueChange={(value) => updateItem(index, 'productId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.price.toLocaleString('es-CL')}
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        ${(item.quantity * item.unitPrice).toLocaleString('es-CL')}
                      </span>
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
                ))}
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
                <Button onClick={handleCreatePurchase}>
                  Crear Orden de Compra
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de compras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Órdenes de Compra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>F. Entrega</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map((purchase) => {
                    const status = getStatusBadge(purchase.status)
                    return (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.number}</TableCell>
                        <TableCell>{purchase.supplierName}</TableCell>
                        <TableCell>{new Date(purchase.date).toLocaleDateString('es-CL')}</TableCell>
                        <TableCell>
                          {purchase.deliveryDate 
                            ? new Date(purchase.deliveryDate).toLocaleDateString('es-CL') 
                            : 'No definida'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>${purchase.totalAmount.toLocaleString('es-CL')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPurchase(purchase)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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
                        ? 'No se encontraron órdenes de compra que coincidan con los filtros.'
                        : 'No hay órdenes de compra registradas.'
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

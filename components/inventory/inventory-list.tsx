
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Plus, Search, Package, AlertTriangle, TrendingUp, Edit, BarChart3 } from 'lucide-react'
import { CreateProductDialog } from './create-product-dialog'

export function InventoryList() {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
          setFilteredProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'loading') {
      return
    }
    
    if (session?.user?.companyId) {
      fetchProducts()
    } else {
      setLoading(false)
    }
  }, [session, status])

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const handleProductCreated = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev])
    setShowCreateDialog(false)
  }

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.minStock) return 'critical'
    if (product.stock <= product.minStock * 1.5) return 'low'
    return 'normal'
  }

  const getStockBadge = (product: Product) => {
    const status = getStockStatus(product)
    if (status === 'critical') {
      return <Badge variant="destructive">Stock Crítico</Badge>
    }
    if (status === 'low') {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Stock Bajo</Badge>
    }
    return <Badge variant="secondary">Stock Normal</Badge>
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

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  const lowStockCount = products.filter(p => getStockStatus(p) === 'critical' || getStockStatus(p) === 'low').length

  return (
    <>
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Productos</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Productos Activos</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {products.filter(p => p.isActive).length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alertas Stock</p>
                  <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? `No hay productos que coincidan con "${searchTerm}"`
                  : 'Comienza agregando tu primer producto para gestionar el inventario'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 font-mono">
                        {product.code}
                      </p>
                    </div>
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Precio</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Costo</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(product.cost)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-500">Stock Actual</p>
                      {getStockBadge(product)}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Actual</p>
                        <p className="font-bold text-lg">{product.stock}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Mínimo</p>
                        <p className="font-medium">{product.minStock}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Unidad</p>
                        <p className="font-medium">{product.unit}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="text-sm">
                      <p className="text-gray-500">Valor Total Stock</p>
                      <p className="font-bold text-blue-600">
                        {formatCurrency(product.price * product.stock)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Movs
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateProductDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onProductCreated={handleProductCreated}
      />
    </>
  )
}


import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    // Obtener compras de ejemplo
    const mockPurchases = [
      {
        id: '1',
        number: 'OC-001',
        supplierId: '1',
        supplierName: 'Proveedor ABC',
        date: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'sent',
        totalAmount: 150000,
        items: [
          {
            productId: '1',
            productName: 'Producto A',
            quantity: 10,
            unitPrice: 15000,
            total: 150000
          }
        ],
        notes: 'Orden de compra de ejemplo'
      },
      {
        id: '2',
        number: 'OC-002',
        supplierId: '2',
        supplierName: 'Proveedor XYZ',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'received',
        totalAmount: 320000,
        items: [
          {
            productId: '2',
            productName: 'Producto B',
            quantity: 5,
            unitPrice: 64000,
            total: 320000
          }
        ]
      }
    ]

    return NextResponse.json(mockPurchases)
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    
    // Generar número de orden de compra (simulado)
    const purchaseNumber = `OC-${String(Date.now()).slice(-3).padStart(3, '0')}`

    // En una implementación real, guardarías en la base de datos
    const newPurchase = {
      id: String(Date.now()),
      number: purchaseNumber,
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      date: new Date().toISOString(),
      deliveryDate: data.deliveryDate,
      status: 'draft',
      totalAmount: data.totalAmount,
      items: data.items,
      notes: data.notes
    }

    return NextResponse.json(newPurchase, { status: 201 })
  } catch (error) {
    console.error('Error creating purchase:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

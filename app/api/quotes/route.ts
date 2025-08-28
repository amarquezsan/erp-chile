
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    // Obtener cotizaciones de ejemplo
    const mockQuotes = [
      {
        id: '1',
        number: 'COT-001',
        clientId: '1',
        clientName: 'Cliente ABC S.A.',
        date: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'sent',
        totalAmount: 238000,
        items: [
          {
            productId: '1',
            productName: 'Producto A',
            description: 'Descripción detallada del producto A',
            quantity: 2,
            unitPrice: 100000,
            total: 200000
          },
          {
            productId: '2',
            productName: 'Servicio B',
            description: 'Servicio de consultoría especializada',
            quantity: 1,
            unitPrice: 38000,
            total: 38000
          }
        ],
        notes: 'Cotización solicitada vía email',
        terms: 'Cotización válida por 30 días. Precios incluyen IVA. Condiciones de pago: 30 días.'
      },
      {
        id: '2',
        number: 'COT-002',
        clientId: '2',
        clientName: 'Empresa XYZ Ltda.',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        validUntil: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        totalAmount: 475000,
        items: [
          {
            productId: '3',
            productName: 'Producto Premium',
            description: 'Producto de alta calidad con garantía extendida',
            quantity: 5,
            unitPrice: 95000,
            total: 475000
          }
        ],
        notes: 'Cliente interesado en volúmenes mayores',
        terms: 'Cotización válida por 30 días. Precios incluyen IVA. Descuento por volumen aplicado.'
      },
      {
        id: '3',
        number: 'COT-003',
        clientId: '3',
        clientName: 'Distribuidora del Sur',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        validUntil: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'expired',
        totalAmount: 150000,
        items: [
          {
            productId: '1',
            productName: 'Producto A',
            description: 'Versión básica del producto',
            quantity: 3,
            unitPrice: 50000,
            total: 150000
          }
        ],
        notes: 'No hubo respuesta del cliente',
        terms: 'Cotización válida por 30 días. Precios incluyen IVA.'
      }
    ]

    return NextResponse.json(mockQuotes)
  } catch (error) {
    console.error('Error fetching quotes:', error)
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
    
    // Generar número de cotización (simulado)
    const quoteNumber = `COT-${String(Date.now()).slice(-3).padStart(3, '0')}`

    // En una implementación real, guardarías en la base de datos
    const newQuote = {
      id: String(Date.now()),
      number: quoteNumber,
      clientId: data.clientId,
      clientName: data.clientName,
      date: new Date().toISOString(),
      validUntil: data.validUntil,
      status: 'draft',
      totalAmount: data.totalAmount,
      items: data.items,
      notes: data.notes,
      terms: data.terms
    }

    return NextResponse.json(newQuote, { status: 201 })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

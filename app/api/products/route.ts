
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: 'desc' }
    })

    // Convertir Decimal a number para evitar errores de serialización
    const formattedProducts = products.map((product: any) => ({
      ...product,
      price: Number(product.price),
      cost: Number(product.cost),
      taxRate: Number(product.taxRate)
    }))

    return NextResponse.json(formattedProducts)

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()

    // Verificar si el código ya existe
    const existingProduct = await prisma.product.findFirst({
      where: {
        companyId: session.user.companyId,
        code: data.code
      }
    })

    if (existingProduct) {
      return NextResponse.json(
        { message: 'Ya existe un producto con este código' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        companyId: session.user.companyId,
        code: data.code,
        name: data.name,
        description: data.description || null,
        price: data.price,
        cost: data.cost || 0,
        stock: data.stock || 0,
        minStock: data.minStock || 0,
        maxStock: data.maxStock || null,
        unit: data.unit || 'UND',
        taxRate: data.taxRate || 19,
        isActive: true
      }
    })

    // También crear el movimiento inicial de stock si hay stock
    if (data.stock > 0) {
      await prisma.movement.create({
        data: {
          productId: product.id,
          type: 'IN',
          quantity: data.stock,
          reason: 'Stock inicial',
          stockAfter: data.stock
        }
      })
    }

    // Convertir Decimal a number
    const formattedProduct = {
      ...product,
      price: Number(product.price),
      cost: Number(product.cost),
      taxRate: Number(product.taxRate)
    }

    return NextResponse.json(formattedProduct)

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

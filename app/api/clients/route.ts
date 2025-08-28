
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const clients = await prisma.client.findMany({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: 'desc' }
    })

    // Convertir Decimal a number para evitar errores de serialización
    const formattedClients = clients.map((client: {
  id: string;
  name: string;
  email: string;
  creditLimit: any;
  [key: string]: any;
}) =>  ({
      ...client,
      creditLimit: Number(client.creditLimit)
    }))

    return NextResponse.json(formattedClients)

  } catch (error) {
    console.error('Error fetching clients:', error)
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

    // Verificar si el RUT ya existe
    const existingClient = await prisma.client.findFirst({
      where: {
        companyId: session.user.companyId,
        rut: data.rut
      }
    })

    if (existingClient) {
      return NextResponse.json(
        { message: 'Ya existe un cliente con este RUT' },
        { status: 400 }
      )
    }

    const client = await prisma.client.create({
      data: {
        companyId: session.user.companyId,
        name: data.name,
        rut: data.rut,
        giro: data.giro || null,
        address: data.address,
        city: data.city,
        region: data.region,
        phone: data.phone || null,
        email: data.email || null,
        contactName: data.contactName || null,
        contactPhone: data.contactPhone || null,
        contactEmail: data.contactEmail || null,
        paymentTerms: data.paymentTerms || 30,
        creditLimit: data.creditLimit || 0,
        isActive: true
      }
    })

    // Convertir Decimal a number
    const formattedClient = {
      ...client,
      creditLimit: Number(client.creditLimit)
    }

    return NextResponse.json(formattedClient)

  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

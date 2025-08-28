
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const { id } = params
    
    // Validaciones básicas
    if (!data.name || !data.rut || !data.email) {
      return NextResponse.json(
        { message: 'Nombre, RUT y email son obligatorios' },
        { status: 400 }
      )
    }

    // En una implementación real, actualizarías en la base de datos
    const updatedSupplier = {
      id,
      name: data.name,
      rut: data.rut,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      contactPerson: data.contactPerson || '',
      status: 'active',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(updatedSupplier)
  } catch (error) {
    console.error('Error updating supplier:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

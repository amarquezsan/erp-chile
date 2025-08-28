
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    // Obtener proveedores de ejemplo
    const mockSuppliers = [
      {
        id: '1',
        name: 'Proveedor ABC S.A.',
        rut: '12.345.678-9',
        email: 'contacto@proveedorabc.cl',
        phone: '+56 9 1234 5678',
        address: 'Av. Providencia 1234',
        city: 'Santiago',
        contactPerson: 'Juan Pérez',
        status: 'active',
        notes: 'Proveedor de confianza con excelentes precios',
        createdAt: new Date('2024-01-15').toISOString()
      },
      {
        id: '2',
        name: 'Distribuidora XYZ Ltda.',
        rut: '98.765.432-1',
        email: 'ventas@distxyz.cl',
        phone: '+56 2 2987 6543',
        address: 'Los Leones 456',
        city: 'Las Condes',
        contactPerson: 'María González',
        status: 'active',
        notes: 'Especialistas en productos tecnológicos',
        createdAt: new Date('2024-02-10').toISOString()
      },
      {
        id: '3',
        name: 'Suministros del Sur S.A.',
        rut: '11.222.333-4',
        email: 'info@suministrosdelsur.cl',
        phone: '+56 41 234 5678',
        address: 'O\'Higgins 789',
        city: 'Concepción',
        contactPerson: 'Carlos Rodríguez',
        status: 'active',
        notes: 'Proveedor regional con buena cobertura',
        createdAt: new Date('2024-03-05').toISOString()
      }
    ]

    return NextResponse.json(mockSuppliers)
  } catch (error) {
    console.error('Error fetching suppliers:', error)
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
    
    // Validaciones básicas
    if (!data.name || !data.rut || !data.email) {
      return NextResponse.json(
        { message: 'Nombre, RUT y email son obligatorios' },
        { status: 400 }
      )
    }

    // En una implementación real, guardarías en la base de datos
    const newSupplier = {
      id: String(Date.now()),
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

    return NextResponse.json(newSupplier, { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

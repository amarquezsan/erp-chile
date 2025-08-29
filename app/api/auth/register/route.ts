import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUser } from '@/lib/mock-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()
    
    // Verificar si el usuario ya existe
    const existingUser = findUser(email)
    
    if (existingUser) {
      return NextResponse.json({ error: 'Usuario ya existe' }, { status: 400 })
    }
    
    // Crear usuario
    const user = createUser({ email, password, firstName, lastName })
    
    return NextResponse.json({ 
      message: 'Usuario creado exitosamente',
      user: { id: user.id, email: user.email, name: user.name }
    })
    
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

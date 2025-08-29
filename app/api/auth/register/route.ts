import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'Usuario ya existe' }, { status: 400 })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
      }
    })
    
    return NextResponse.json({ 
      message: 'Usuario creado exitosamente',
      user: { id: user.id, email: user.email, name: user.name }
    })
    
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

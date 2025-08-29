import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test simple de conexión
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Test de queries básicas
    const userCount = await prisma.user.count()
    console.log('✅ User table accessible, count:', userCount)
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database connected',
      userCount: userCount 
    })
    
  } catch (error) {
    console.error('❌ Database error:', error)
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const { id } = params
    
    // En una implementación real, actualizarías el estado en la base de datos
    // y enviarías el email al cliente
    
    // Simular envío de cotización
    console.log(`Sending quote ${id} to client...`)
    
    // Aquí podrías integrar con un servicio de email como SendGrid, Mailgun, etc.
    // También podrías generar un PDF de la cotización
    
    const updatedQuote = {
      id,
      status: 'sent',
      sentAt: new Date().toISOString()
    }

    return NextResponse.json(updatedQuote)
  } catch (error) {
    console.error('Error sending quote:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

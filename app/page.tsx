'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirigir automáticamente al login
    router.push('/auth/signin')
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">ERP Chile</h1>
        <p>Redirigiendo...</p>
      </div>
    </div>
  )
}

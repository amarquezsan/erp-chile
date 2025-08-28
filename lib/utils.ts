
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Validación de RUT chileno
export function validateRut(rut: string): boolean {
  if (!rut || rut.length < 8) return false
  
  const rutClean = rut.replace(/\./g, '').replace(/-/g, '')
  const rutRegex = /^(\d{7,8})([0-9kK])$/
  const match = rutClean.match(rutRegex)
  
  if (!match) return false
  
  const numbers = match[1]
  const checkDigit = match[2].toUpperCase()
  
  let sum = 0
  let multiplier = 2
  
  for (let i = numbers.length - 1; i >= 0; i--) {
    sum += parseInt(numbers[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  
  const remainder = sum % 11
  const calculatedDigit = 11 - remainder
  
  let expectedDigit: string
  if (calculatedDigit === 11) {
    expectedDigit = '0'
  } else if (calculatedDigit === 10) {
    expectedDigit = 'K'
  } else {
    expectedDigit = calculatedDigit.toString()
  }
  
  return checkDigit === expectedDigit
}

// Formatear RUT chileno
export function formatRut(rut: string): string {
  if (!rut) return ''
  
  const rutClean = rut.replace(/\./g, '').replace(/-/g, '')
  const rutRegex = /^(\d{7,8})([0-9kK])$/
  const match = rutClean.match(rutRegex)
  
  if (!match) return rut
  
  const numbers = match[1]
  const checkDigit = match[2]
  
  // Formatear con puntos y guión
  const formattedNumbers = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formattedNumbers}-${checkDigit}`
}

// Formatear moneda chilena
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Formatear números para display
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-CL').format(num)
}

// Calcular dígito verificador de RUT
export function calculateRutDv(rut: string): string {
  let sum = 0
  let multiplier = 2
  
  for (let i = rut.length - 1; i >= 0; i--) {
    sum += parseInt(rut[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  
  const remainder = sum % 11
  const dv = 11 - remainder
  
  if (dv === 11) return '0'
  if (dv === 10) return 'K'
  return dv.toString()
}

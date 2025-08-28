
export interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  companyId: string
  companyName: string
}

export interface Company {
  id: string
  name: string
  rut: string
  giro: string
  address: string
  city: string
  region: string
  phone?: string
  email?: string
}

export interface Client {
  id: string
  name: string
  rut: string
  giro?: string
  address: string
  city: string
  region: string
  phone?: string
  email?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  paymentTerms: number
  creditLimit: number
  isActive: boolean
}

export interface Product {
  id: string
  code: string
  name: string
  description?: string
  price: number
  cost: number
  stock: number
  minStock: number
  maxStock?: number
  unit: string
  taxRate: number
  isActive: boolean
}

export interface Invoice {
  id: string
  number: number
  type: InvoiceType
  status: InvoiceStatus
  issueDate: Date
  dueDate?: Date
  subtotal: number
  taxAmount: number
  total: number
  client: Client
  items: InvoiceItem[]
  siiStatus?: string
  trackingId?: string
}

export interface InvoiceItem {
  id: string
  product: Product
  quantity: number
  unitPrice: number
  discount: number
  taxRate: number
  lineTotal: number
}

export type InvoiceType = 'FACTURA' | 'BOLETA' | 'NOTA_CREDITO' | 'NOTA_DEBITO' | 'FACTURA_EXENTA'
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'PAID'
export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER'

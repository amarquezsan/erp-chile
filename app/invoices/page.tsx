
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { InvoicesList } from '@/components/invoices/invoices-list'

export default function InvoicesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
            <p className="text-gray-600">Gestiona tus facturas electrónicas</p>
          </div>
        </div>
        <InvoicesList />
      </div>
    </DashboardLayout>
  )
}

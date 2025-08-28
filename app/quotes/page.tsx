
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { QuotesList } from '@/components/quotes/quotes-list'

export default function QuotesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cotizaciones</h1>
            <p className="text-gray-600">Genera y gestiona cotizaciones para clientes</p>
          </div>
        </div>
        <QuotesList />
      </div>
    </DashboardLayout>
  )
}

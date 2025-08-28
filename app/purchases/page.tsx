
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PurchasesList } from '@/components/purchases/purchases-list'

export default function PurchasesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compras</h1>
            <p className="text-gray-600">Gestiona tus órdenes de compra y recepciones</p>
          </div>
        </div>
        <PurchasesList />
      </div>
    </DashboardLayout>
  )
}

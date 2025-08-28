
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { InventoryList } from '@/components/inventory/inventory-list'

export default function InventoryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
            <p className="text-gray-600">Gestiona tus productos y stock</p>
          </div>
        </div>
        <InventoryList />
      </div>
    </DashboardLayout>
  )
}

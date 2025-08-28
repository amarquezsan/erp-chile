
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { SuppliersList } from '@/components/suppliers/suppliers-list'

export default function SuppliersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
            <p className="text-gray-600">Gestiona la información de tus proveedores</p>
          </div>
        </div>
        <SuppliersList />
      </div>
    </DashboardLayout>
  )
}

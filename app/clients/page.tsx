
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ClientsList } from '@/components/clients/clients-list'

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">Gestiona la información de tus clientes</p>
          </div>
        </div>
        <ClientsList />
      </div>
    </DashboardLayout>
  )
}

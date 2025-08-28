
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AccountingOverview } from '@/components/accounting/accounting-overview'

export default function AccountingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contabilidad</h1>
          <p className="text-gray-600">Plan de cuentas y movimientos contables</p>
        </div>
        <AccountingOverview />
      </div>
    </DashboardLayout>
  )
}

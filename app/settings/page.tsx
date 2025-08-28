
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { SettingsOverview } from '@/components/settings/settings-overview'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Configura tu empresa y certificados digitales</p>
        </div>
        <SettingsOverview />
      </div>
    </DashboardLayout>
  )
}

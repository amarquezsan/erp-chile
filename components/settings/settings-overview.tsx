
'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  FileKey, 
  Shield, 
  Settings, 
  Upload,
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react'

export function SettingsOverview() {
  const { data: session, status } = useSession() || {}

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Información de la Empresa
          </CardTitle>
          <CardDescription>
            Datos tributarios y de contacto registrados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Razón Social</p>
              <p className="text-sm text-gray-600">{session?.user?.companyName || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Usuario</p>
              <p className="text-sm text-gray-600">
                {session?.user?.firstName} {session?.user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Editar Información
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Digital Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileKey className="w-5 h-5 text-green-600" />
            Certificados Digitales
          </CardTitle>
          <CardDescription>
            Gestiona los certificados para facturación electrónica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SII Certificate */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Certificado SII</p>
                <p className="text-sm text-gray-500">Requerido para facturación electrónica</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">No configurado</Badge>
              <Button size="sm">
                <Upload className="w-4 h-4 mr-1" />
                Subir
              </Button>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Firma Digital</p>
                <p className="text-sm text-gray-500">Para firmar documentos electrónicos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">No configurado</Badge>
              <Button size="sm">
                <Upload className="w-4 h-4 mr-1" />
                Subir
              </Button>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Certificados Requeridos</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Para emitir facturas electrónicas válidas en Chile, necesitas configurar tanto el 
                  certificado del SII como tu firma digital. Estos certificados son proporcionados 
                  por el Servicio de Impuestos Internos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SII Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Estado de Integración SII
          </CardTitle>
          <CardDescription>
            Conexión con los servicios del Servicio de Impuestos Internos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <p className="font-medium">Ambiente de Certificación</p>
              </div>
              <p className="text-sm text-gray-600">
                Conectado al ambiente de pruebas del SII para validar facturas
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <p className="font-medium">Ambiente de Producción</p>
              </div>
              <p className="text-sm text-gray-600">
                No configurado - Requiere certificados válidos
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Modo Demostración Activo</p>
                <p className="text-sm text-blue-700 mt-1">
                  Actualmente el sistema opera en modo demostración. Las facturas generadas 
                  son simuladas y no tienen validez tributaria. Para operar en producción, 
                  configura los certificados SII correspondientes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Configuración del Sistema
          </CardTitle>
          <CardDescription>
            Parámetros generales del ERP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Numeración de Facturas</p>
              <p className="text-sm text-gray-600">Automática desde el N° 1</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Tipo de IVA</p>
              <p className="text-sm text-gray-600">19% (estándar Chile)</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Moneda</p>
              <p className="text-sm text-gray-600">Peso Chileno (CLP)</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Zona Horaria</p>
              <p className="text-sm text-gray-600">Chile Continental (CLT)</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configurar Parámetros
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

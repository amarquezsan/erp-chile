
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Edit, Users, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

interface Employee {
  id: string
  firstName: string
  lastName: string
  rut: string
  email: string
  phone: string
  address: string
  position: string
  department: string
  salary: number
  hireDate: string
  status: 'active' | 'inactive'
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

interface Payroll {
  id: string
  employeeId: string
  employeeName: string
  period: string
  baseSalary: number
  overtime: number
  bonuses: number
  deductions: number
  netSalary: number
  status: 'draft' | 'paid' | 'pending'
}

export function EmployeesList() {
  const { data: session } = useSession() || {}
  const [employees, setEmployees] = useState<Employee[]>([])
  const [payrolls, setPayrolls] = useState<Payroll[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rut: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: '',
    salary: 0,
    hireDate: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: ''
  })

  useEffect(() => {
    if (session?.user?.email) {
      fetchEmployees()
      fetchPayrolls()
    }
  }, [session])

  useEffect(() => {
    filterEmployees()
  }, [employees, searchTerm, departmentFilter])

  const fetchEmployees = async () => {
    try {
      // Datos de ejemplo
      const mockEmployees: Employee[] = [
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          rut: '12.345.678-9',
          email: 'juan.perez@empresa.cl',
          phone: '+56 9 1234 5678',
          address: 'Av. Providencia 1234, Santiago',
          position: 'Vendedor Senior',
          department: 'Ventas',
          salary: 800000,
          hireDate: '2023-01-15',
          status: 'active',
          emergencyContact: {
            name: 'María Pérez',
            phone: '+56 9 8765 4321',
            relationship: 'Esposa'
          }
        },
        {
          id: '2',
          firstName: 'Ana',
          lastName: 'González',
          rut: '98.765.432-1',
          email: 'ana.gonzalez@empresa.cl',
          phone: '+56 9 2345 6789',
          address: 'Los Leones 567, Las Condes',
          position: 'Contadora',
          department: 'Finanzas',
          salary: 1200000,
          hireDate: '2022-03-10',
          status: 'active',
          emergencyContact: {
            name: 'Carlos González',
            phone: '+56 9 7654 3210',
            relationship: 'Hermano'
          }
        },
        {
          id: '3',
          firstName: 'Pedro',
          lastName: 'Silva',
          rut: '11.222.333-4',
          email: 'pedro.silva@empresa.cl',
          phone: '+56 9 3456 7890',
          address: 'Av. Italia 890, Ñuñoa',
          position: 'Desarrollador',
          department: 'Tecnología',
          salary: 1500000,
          hireDate: '2023-06-01',
          status: 'active',
          emergencyContact: {
            name: 'Laura Silva',
            phone: '+56 9 6543 2109',
            relationship: 'Madre'
          }
        }
      ]
      setEmployees(mockEmployees)
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Error al cargar los empleados')
    }
  }

  const fetchPayrolls = async () => {
    try {
      // Datos de ejemplo de nóminas
      const mockPayrolls: Payroll[] = [
        {
          id: '1',
          employeeId: '1',
          employeeName: 'Juan Pérez',
          period: '2024-08',
          baseSalary: 800000,
          overtime: 50000,
          bonuses: 0,
          deductions: 170000,
          netSalary: 680000,
          status: 'paid'
        },
        {
          id: '2',
          employeeId: '2',
          employeeName: 'Ana González',
          period: '2024-08',
          baseSalary: 1200000,
          overtime: 0,
          bonuses: 100000,
          deductions: 260000,
          netSalary: 1040000,
          status: 'paid'
        },
        {
          id: '3',
          employeeId: '3',
          employeeName: 'Pedro Silva',
          period: '2024-08',
          baseSalary: 1500000,
          overtime: 75000,
          bonuses: 0,
          deductions: 315000,
          netSalary: 1260000,
          status: 'pending'
        }
      ]
      setPayrolls(mockPayrolls)
    } catch (error) {
      console.error('Error fetching payrolls:', error)
    }
  }

  const filterEmployees = () => {
    let filtered = employees

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(employee => employee.department === departmentFilter)
    }

    setFilteredEmployees(filtered)
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      rut: '',
      email: '',
      phone: '',
      address: '',
      position: '',
      department: '',
      salary: 0,
      hireDate: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: ''
    })
  }

  const handleCreateEmployee = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.rut || !formData.email) {
        toast.error('Por favor completa todos los campos obligatorios')
        return
      }

      // En una implementación real, enviarías los datos al servidor
      const newEmployee: Employee = {
        id: String(Date.now()),
        firstName: formData.firstName,
        lastName: formData.lastName,
        rut: formData.rut,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        position: formData.position,
        department: formData.department,
        salary: formData.salary,
        hireDate: formData.hireDate,
        status: 'active',
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        }
      }

      setEmployees([...employees, newEmployee])
      toast.success('Empleado creado exitosamente')
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error creating employee:', error)
      toast.error('Error al crear el empleado')
    }
  }

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      rut: employee.rut,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      hireDate: employee.hireDate,
      emergencyContactName: employee.emergencyContact.name,
      emergencyContactPhone: employee.emergencyContact.phone,
      emergencyContactRelationship: employee.emergencyContact.relationship
    })
    setIsEditMode(true)
    setIsCreateDialogOpen(true)
  }

  const closeDialog = () => {
    setIsCreateDialogOpen(false)
    setSelectedEmployee(null)
    setIsEditMode(false)
    resetForm()
  }

  const departments = [...new Set(employees.map(emp => emp.department))].filter(Boolean)

  const getPayrollStatusBadge = (status: Payroll['status']) => {
    const statusConfig = {
      draft: { label: 'Borrador', variant: 'secondary' as const },
      pending: { label: 'Pendiente', variant: 'default' as const },
      paid: { label: 'Pagada', variant: 'default' as const }
    }
    return statusConfig[status] || { label: status, variant: 'secondary' as const }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Empleados
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Nómina
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-6">
          {/* Filtros y búsqueda para empleados */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, RUT, email o cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              if (!open) closeDialog()
              else setIsCreateDialogOpen(true)
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Empleado
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? 'Editar Empleado' : 'Crear Nuevo Empleado'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombres *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Nombres"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Apellidos"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rut">RUT *</Label>
                      <Input
                        id="rut"
                        value={formData.rut}
                        onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                        placeholder="12.345.678-9"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="empleado@empresa.cl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hireDate">Fecha de Ingreso</Label>
                      <Input
                        id="hireDate"
                        type="date"
                        value={formData.hireDate}
                        onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Dirección completa"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Cargo o puesto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Área</Label>
                      <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar área" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ventas">Ventas</SelectItem>
                          <SelectItem value="Finanzas">Finanzas</SelectItem>
                          <SelectItem value="Tecnología">Tecnología</SelectItem>
                          <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                          <SelectItem value="Operaciones">Operaciones</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Sueldo Base</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Contacto de Emergencia</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactName">Nombre</Label>
                        <Input
                          id="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactPhone">Teléfono</Label>
                        <Input
                          id="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactRelationship">Parentesco</Label>
                        <Select value={formData.emergencyContactRelationship} onValueChange={(value) => setFormData({ ...formData, emergencyContactRelationship: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Esposo/a">Esposo/a</SelectItem>
                            <SelectItem value="Padre">Padre</SelectItem>
                            <SelectItem value="Madre">Madre</SelectItem>
                            <SelectItem value="Hermano/a">Hermano/a</SelectItem>
                            <SelectItem value="Hijo/a">Hijo/a</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={closeDialog}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateEmployee}>
                      {isEditMode ? 'Actualizar' : 'Crear'} Empleado
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de empleados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Empleados ({filteredEmployees.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>RUT</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead>Sueldo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </TableCell>
                          <TableCell>{employee.rut}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>${employee.salary.toLocaleString('es-CL')}</TableCell>
                          <TableCell>
                            <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                              {employee.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(employee)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                          {searchTerm || departmentFilter !== 'all' 
                            ? 'No se encontraron empleados que coincidan con los filtros.'
                            : 'No hay empleados registrados.'
                          }
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Nómina - Agosto 2024
                </span>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Procesar Nómina
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Sueldo Base</TableHead>
                      <TableHead>Horas Extra</TableHead>
                      <TableHead>Bonos</TableHead>
                      <TableHead>Descuentos</TableHead>
                      <TableHead>Líquido</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrolls.map((payroll) => {
                      const status = getPayrollStatusBadge(payroll.status)
                      return (
                        <TableRow key={payroll.id}>
                          <TableCell className="font-medium">{payroll.employeeName}</TableCell>
                          <TableCell>{payroll.period}</TableCell>
                          <TableCell>${payroll.baseSalary.toLocaleString('es-CL')}</TableCell>
                          <TableCell>${payroll.overtime.toLocaleString('es-CL')}</TableCell>
                          <TableCell>${payroll.bonuses.toLocaleString('es-CL')}</TableCell>
                          <TableCell>${payroll.deductions.toLocaleString('es-CL')}</TableCell>
                          <TableCell className="font-semibold">
                            ${payroll.netSalary.toLocaleString('es-CL')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

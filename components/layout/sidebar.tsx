
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  LayoutDashboard,
  FileText,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Truck,
  BarChart3,
  Calculator,
  ClipboardList,
  UserCheck
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Facturación',
    href: '/invoices',
    icon: FileText
  },
  {
    name: 'Cotizaciones',
    href: '/quotes',
    icon: ClipboardList
  },
  {
    name: 'Compras',
    href: '/purchases',
    icon: ShoppingCart
  },
  {
    name: 'Inventario',
    href: '/inventory',
    icon: Package
  },
  {
    name: 'Clientes',
    href: '/clients',
    icon: Users
  },
  {
    name: 'Proveedores',
    href: '/suppliers',
    icon: Truck
  },
  {
    name: 'Empleados',
    href: '/employees',
    icon: UserCheck
  },
  {
    name: 'Contabilidad',
    href: '/accounting',
    icon: Calculator
  },
  {
    name: 'Reportes',
    href: '/reports',
    icon: BarChart3
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings
  }
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession() || {}

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-sm",
        collapsed && "-translate-x-full lg:w-16",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md">
                  <Building2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground text-lg">ERP Chile</h1>
                  <p className="text-xs text-muted-foreground truncate">
                    {session?.user?.companyName || 'Empresa Demo Chile S.A.'}
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="lg:hidden"
            >
              {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                        collapsed && "justify-center"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5 transition-colors", 
                        isActive 
                          ? "text-primary-foreground" 
                          : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border bg-muted/30">
            {!collapsed && (
              <div className="mb-3 p-2 rounded-lg bg-card/50">
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.user?.firstName} {session?.user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
              </div>
            )}
            <Separator className="mb-3" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className={cn(
                "w-full justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive/90 transition-colors",
                collapsed && "justify-center"
              )}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Toggle button for desktop */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex fixed left-2 top-4 z-10"
      >
        <Menu className="w-4 h-4" />
      </Button>
    </>
  )
}

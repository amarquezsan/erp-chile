
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...')

  // Limpiar datos existentes en orden correcto (solo para demo)
  await prisma.invoiceItem.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.movement.deleteMany()
  await prisma.certificate.deleteMany()
  await prisma.product.deleteMany()
  await prisma.client.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()

  // Hashear password para admin
  const hashedPassword = await bcrypt.hash('admin123', 12)

  // Crear empresa demo
  const company = await prisma.company.create({
    data: {
      name: 'Empresa Demo Chile S.A.',
      rut: '76123456-7',
      giro: 'Servicios de consultoría en tecnología',
      address: 'Av. Providencia 1234',
      city: 'Providencia',
      region: 'Región Metropolitana',
      phone: '+56-2-2234-5678',
      email: 'contacto@empresademo.cl',
      website: 'www.empresademo.cl',
      economicActivity: 'Servicios de consultoría en informática'
    }
  })

  // Crear usuario admin
  const user = await prisma.user.create({
    data: {
      email: 'john@doe.com',
      password: hashedPassword,
      firstName: 'Administrador',
      lastName: 'Sistema',
      name: 'Administrador Sistema',
      companyId: company.id
    }
  })

  // Crear clientes demo
  const clients = await prisma.client.createMany({
    data: [
      {
        companyId: company.id,
        name: 'Constructora Los Andes Ltda.',
        rut: '96587123-4',
        giro: 'Construcción de obras civiles',
        address: 'Av. Las Condes 9876',
        city: 'Las Condes',
        region: 'Región Metropolitana',
        phone: '+56-2-2987-6543',
        email: 'ventas@losandes.cl',
        contactName: 'María González',
        contactPhone: '+56-9-8765-4321',
        contactEmail: 'maria@losandes.cl',
        paymentTerms: 30,
        creditLimit: 5000000
      },
      {
        companyId: company.id,
        name: 'Restaurant El Buen Sabor',
        rut: '77234567-8',
        giro: 'Restaurante y servicios gastronómicos',
        address: 'Av. Manuel Montt 567',
        city: 'Providencia',
        region: 'Región Metropolitana',
        phone: '+56-2-2345-6789',
        email: 'pedidos@buensabor.cl',
        contactName: 'Carlos Pérez',
        contactPhone: '+56-9-7654-3210',
        contactEmail: 'carlos@buensabor.cl',
        paymentTerms: 15,
        creditLimit: 1500000
      },
      {
        companyId: company.id,
        name: 'Comercial Sur S.A.',
        rut: '96345678-9',
        giro: 'Venta al por mayor de productos químicos',
        address: 'Camino a Melipilla 1234',
        city: 'Pudahuel',
        region: 'Región Metropolitana',
        phone: '+56-2-2456-7890',
        email: 'compras@comercialsur.cl',
        contactName: 'Ana Torres',
        contactPhone: '+56-9-6543-2109',
        contactEmail: 'ana@comercialsur.cl',
        paymentTerms: 45,
        creditLimit: 8000000
      }
    ]
  })

  // Crear productos demo
  const products = await prisma.product.createMany({
    data: [
      {
        companyId: company.id,
        code: 'SERV-001',
        name: 'Consultoría en Sistemas ERP',
        description: 'Servicios de consultoría e implementación de sistemas ERP',
        price: 150000,
        cost: 100000,
        stock: 100,
        minStock: 10,
        unit: 'HRS',
        taxRate: 19
      },
      {
        companyId: company.id,
        code: 'SERV-002',
        name: 'Soporte Técnico Mensual',
        description: 'Plan de soporte técnico mensual para sistemas implementados',
        price: 250000,
        cost: 180000,
        stock: 50,
        minStock: 5,
        unit: 'MES',
        taxRate: 19
      },
      {
        companyId: company.id,
        code: 'LIC-001',
        name: 'Licencia Software ERP',
        description: 'Licencia anual del software ERP empresarial',
        price: 500000,
        cost: 350000,
        stock: 20,
        minStock: 2,
        unit: 'LIC',
        taxRate: 19
      },
      {
        companyId: company.id,
        code: 'EQUIP-001',
        name: 'Servidor para ERP',
        description: 'Servidor dedicado para implementación ERP',
        price: 1200000,
        cost: 900000,
        stock: 5,
        minStock: 1,
        unit: 'UND',
        taxRate: 19
      },
      {
        companyId: company.id,
        code: 'CAP-001',
        name: 'Capacitación Usuario Final',
        description: 'Programa de capacitación para usuarios finales del sistema',
        price: 80000,
        cost: 50000,
        stock: 200,
        minStock: 20,
        unit: 'HRS',
        taxRate: 19
      }
    ]
  })

  console.log('✅ Seeding completado:')
  console.log(`- Empresa creada: ${company.name}`)
  console.log(`- Usuario admin: ${user.email}`)
  console.log('- 3 clientes demo creados')
  console.log('- 5 productos demo creados')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartbus2plus.com' },
    update: {},
    create: {
      email: 'admin@smartbus2plus.com',
      password: adminPassword,
      name: 'Admin User',
      phone: '+91-9876543210',
      role: 'admin'
    }
  });

  // Create sample passenger users
  const passengerPassword = await bcrypt.hash('passenger123', 12);
  const passengers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        password: passengerPassword,
        name: 'John Doe',
        phone: '+91-9876543211',
        role: 'passenger'
      }
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        password: passengerPassword,
        name: 'Jane Smith',
        phone: '+91-9876543212',
        role: 'passenger'
      }
    })
  ]);

  // Create sample buses
  const buses = await Promise.all([
    prisma.bus.upsert({
      where: { id: 'SB001' },
      update: {},
      create: {
        id: 'SB001',
        name: 'Volvo Multi-Axle',
        operator: 'Volvo',
        from: 'Mumbai',
        to: 'Delhi',
        price: 2500,
        departureTime: '22:30',
        arrivalTime: '06:30',
        capacity: 50,
        type: 'AC Sleeper',
        rating: 4.5,
        status: 'active'
      }
    }),
    prisma.bus.upsert({
      where: { id: 'SB002' },
      update: {},
      create: {
        id: 'SB002',
        name: 'Scania Metrolink',
        operator: 'Scania',
        from: 'Delhi',
        to: 'Bangalore',
        price: 3200,
        departureTime: '20:00',
        arrivalTime: '08:00',
        capacity: 45,
        type: 'AC Semi-Sleeper',
        rating: 4.7,
        status: 'active'
      }
    }),
    prisma.bus.upsert({
      where: { id: 'SB003' },
      update: {},
      create: {
        id: 'SB003',
        name: 'Mercedes Benz',
        operator: 'Mercedes',
        from: 'Bangalore',
        to: 'Chennai',
        price: 1800,
        departureTime: '06:00',
        arrivalTime: '12:00',
        capacity: 40,
        type: 'AC Seater',
        rating: 4.6,
        status: 'active'
      }
    }),
    prisma.bus.upsert({
      where: { id: 'SB004' },
      update: {},
      create: {
        id: 'SB004',
        name: 'Tata Marcopolo',
        operator: 'Tata',
        from: 'Chennai',
        to: 'Kolkata',
        price: 2200,
        departureTime: '18:00',
        arrivalTime: '06:00',
        capacity: 35,
        type: 'AC Sleeper',
        rating: 4.3,
        status: 'active'
      }
    }),
    prisma.bus.upsert({
      where: { id: 'SB005' },
      update: {},
      create: {
        id: 'SB005',
        name: 'Ashok Leyland',
        operator: 'Ashok Leyland',
        from: 'Kolkata',
        to: 'Hyderabad',
        price: 1900,
        departureTime: '19:30',
        arrivalTime: '07:30',
        capacity: 30,
        type: 'Non-AC Sleeper',
        rating: 4.1,
        status: 'active'
      }
    }),
    prisma.bus.upsert({
      where: { id: 'SB006' },
      update: {},
      create: {
        id: 'SB006',
        name: 'Eicher Pro',
        operator: 'Eicher',
        from: 'Hyderabad',
        to: 'Pune',
        price: 1600,
        departureTime: '21:00',
        arrivalTime: '09:00',
        capacity: 25,
        type: 'AC Seater',
        rating: 4.4,
        status: 'active'
      }
    }),
    prisma.bus.upsert({
      where: { id: 'SB007' },
      update: {},
      create: {
        id: 'SB007',
        name: 'Mahindra Comfio',
        operator: 'Mahindra',
        from: 'Pune',
        to: 'Jaipur',
        price: 2100,
        departureTime: '17:00',
        arrivalTime: '05:00',
        capacity: 42,
        type: 'AC Sleeper',
        rating: 4.2,
        status: 'active'
      }
    }),
    prisma.bus.upsert({
      where: { id: 'SB008' },
      update: {},
      create: {
        id: 'SB008',
        name: 'Force Traveller',
        operator: 'Force',
        from: 'Jaipur',
        to: 'Ahmedabad',
        price: 1400,
        departureTime: '08:00',
        arrivalTime: '16:00',
        capacity: 20,
        type: 'Non-AC Seater',
        rating: 3.9,
        status: 'active'
      }
    })
  ]);

  // Create sample bookings
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        userId: passengers[0].id,
        busId: buses[0].id,
        seats: JSON.stringify(['1A', '1B']),
        passengerName: 'John Doe',
        passengerEmail: 'john@example.com',
        passengerPhone: '+91-9876543211',
        totalPrice: 5000,
        status: 'confirmed'
      }
    }),
    prisma.booking.create({
      data: {
        userId: passengers[1].id,
        busId: buses[1].id,
        seats: JSON.stringify(['2A']),
        passengerName: 'Jane Smith',
        passengerEmail: 'jane@example.com',
        passengerPhone: '+91-9876543212',
        totalPrice: 3200,
        status: 'confirmed'
      }
    })
  ]);

  // Create sample routes
  const routes = await Promise.all([
    prisma.route.create({
      data: {
        name: 'Mumbai-Delhi Express',
        from: 'Mumbai',
        to: 'Delhi',
        distance: 1400,
        duration: 480,
        status: 'active'
      }
    }),
    prisma.route.create({
      data: {
        name: 'Delhi-Bangalore Premium',
        from: 'Delhi',
        to: 'Bangalore',
        distance: 2100,
        duration: 720,
        status: 'active'
      }
    }),
    prisma.route.create({
      data: {
        name: 'Bangalore-Chennai Fast',
        from: 'Bangalore',
        to: 'Chennai',
        distance: 350,
        duration: 360,
        status: 'active'
      }
    })
  ]);

  // Create sample stops
  const stops = await Promise.all([
    prisma.stop.create({
      data: {
        name: 'Mumbai Central',
        location: 'Mumbai Central Station',
        latitude: 19.0176,
        longitude: 72.8562
      }
    }),
    prisma.stop.create({
      data: {
        name: 'Delhi ISBT',
        location: 'Inter State Bus Terminal, Delhi',
        latitude: 28.6139,
        longitude: 77.2090
      }
    }),
    prisma.stop.create({
      data: {
        name: 'Bangalore Majestic',
        location: 'Kempegowda Bus Station',
        latitude: 12.9716,
        longitude: 77.5946
      }
    })
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Created ${admin ? 1 : 0} admin user`);
  console.log(`👥 Created ${passengers.length} passenger users`);
  console.log(`🚌 Created ${buses.length} buses`);
  console.log(`🎫 Created ${bookings.length} bookings`);
  console.log(`🛣️ Created ${routes.length} routes`);
  console.log(`🚏 Created ${stops.length} stops`);
  
  console.log('\n🔑 Default Login Credentials:');
  console.log('Admin: admin@smartbus2plus.com / admin123');
  console.log('Passenger: john@example.com / passenger123');
  console.log('Passenger: jane@example.com / passenger123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

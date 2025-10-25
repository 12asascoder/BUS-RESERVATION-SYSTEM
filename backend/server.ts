import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Serve static files
app.use(express.static('public'));

// Routes

// Landing page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  body('phone').isMobilePhone('any')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, phone, role = 'passenger' } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bus routes
app.get('/api/buses', async (req, res) => {
  try {
    const { from, to, date, type } = req.query;
    
    let whereClause: any = {};
    
    if (from) whereClause.from = from;
    if (to) whereClause.to = to;
    if (type && type !== 'all') whereClause.type = type;

    const buses = await prisma.bus.findMany({
      where: whereClause,
      include: {
        bookings: {
          select: {
            seats: true
          }
        }
      }
    });

    // Calculate available seats
    const busesWithAvailability = buses.map(bus => {
      const bookedSeats = bus.bookings.flatMap(booking => booking.seats);
      const availableSeats = bus.capacity - bookedSeats.length;
      
      return {
        ...bus,
        availableSeats,
        occupancy: Math.round((bookedSeats.length / bus.capacity) * 100)
      };
    });

    res.json(busesWithAvailability);
  } catch (error) {
    console.error('Get buses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/buses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const bus = await prisma.bus.findUnique({
      where: { id },
      include: {
        bookings: {
          select: {
            seats: true
          }
        }
      }
    });

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const bookedSeats = bus.bookings.flatMap(booking => booking.seats);
    const availableSeats = bus.capacity - bookedSeats.length;

    res.json({
      ...bus,
      availableSeats,
      bookedSeats,
      occupancy: Math.round((bookedSeats.length / bus.capacity) * 100)
    });
  } catch (error) {
    console.error('Get bus error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Booking routes
app.post('/api/bookings', authenticateToken, [
  body('busId').exists(),
  body('seats').isArray({ min: 1 }),
  body('passengerName').trim().isLength({ min: 2 }),
  body('passengerEmail').isEmail(),
  body('passengerPhone').isMobilePhone('any')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { busId, seats, passengerName, passengerEmail, passengerPhone } = req.body;
    const userId = req.user.userId;

    // Check if bus exists and has available seats
    const bus = await prisma.bus.findUnique({
      where: { id: busId },
      include: {
        bookings: {
          select: {
            seats: true
          }
        }
      }
    });

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const bookedSeats = bus.bookings.flatMap(booking => booking.seats);
    const requestedSeats = seats;
    
    // Check if all requested seats are available
    const unavailableSeats = requestedSeats.filter(seat => bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        error: 'Some seats are no longer available',
        unavailableSeats 
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        busId,
        seats: requestedSeats,
        passengerName,
        passengerEmail,
        passengerPhone,
        totalPrice: bus.price * requestedSeats.length,
        status: 'confirmed'
      }
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        busId: booking.busId,
        seats: booking.seats,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        bus: {
          select: {
            name: true,
            from: true,
            to: true,
            departureTime: true,
            arrivalTime: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const booking = await prisma.booking.findFirst({
      where: { id, userId }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await prisma.booking.delete({
      where: { id }
    });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin routes
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const totalUsers = await prisma.user.count();
    const totalBuses = await prisma.bus.count();
    const totalBookings = await prisma.booking.count();
    const totalRevenue = await prisma.booking.aggregate({
      _sum: { totalPrice: true }
    });

    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        bus: { select: { name: true, from: true, to: true } }
      }
    });

    res.json({
      totalUsers,
      totalBuses,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentBookings
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// IoT Data routes (for frontend monitoring)
app.get('/api/iot/data', async (req, res) => {
  try {
    // Simulate IoT sensor data
    const iotData = Array.from({ length: 20 }, (_, i) => ({
      id: `sensor_${i + 1}`,
      busId: `SB${String(i + 1).padStart(3, '0')}`,
      temperature: 20 + Math.random() * 15,
      humidity: 40 + Math.random() * 30,
      fuelLevel: 60 + Math.random() * 40,
      speed: 40 + Math.random() * 60,
      location: {
        latitude: 19.0760 + (Math.random() - 0.5) * 0.1,
        longitude: 72.8777 + (Math.random() - 0.5) * 0.1
      },
      timestamp: new Date().toISOString()
    }));

    res.json(iotData);
  } catch (error) {
    console.error('Get IoT data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// RFID Events routes
app.get('/api/rfid/events', async (req, res) => {
  try {
    // Simulate RFID boarding events
    const events = Array.from({ length: 15 }, (_, i) => ({
      id: `event_${i + 1}`,
      busId: `SB${String((i % 8) + 1).padStart(3, '0')}`,
      passengerId: `P${String(i + 1).padStart(4, '0')}`,
      eventType: ['BOARDING', 'ALIGHTING', 'CAPACITY_EXCEEDED'][Math.floor(Math.random() * 3)],
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      location: `Stop ${i + 1}`,
      status: ['SUCCESS', 'WARNING', 'ERROR'][Math.floor(Math.random() * 3)]
    }));

    res.json(events);
  } catch (error) {
    console.error('Get RFID events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Landing page: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

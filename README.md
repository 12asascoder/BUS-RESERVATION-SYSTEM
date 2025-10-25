# SmartBus2+ - Professional Bus Booking System

A comprehensive bus booking and management system built with modern technologies, featuring a professional web interface and advanced Java GUI for complex booking operations.

## 🚀 System Architecture

### Frontend (React/TypeScript)
- **Web Interface**: Professional landing page, dashboard, and basic booking
- **Authentication**: Complete login/register system with JWT
- **Real-time Monitoring**: IoT sensors, RFID boarding, analytics
- **Responsive Design**: Modern Material Design with mobile support

### Backend (Node.js/Express.js/TypeScript)
- **RESTful API**: Comprehensive endpoints for all operations
- **Authentication**: JWT-based security with role management
- **Database**: SQLite with Prisma ORM
- **Security**: Rate limiting, validation, error handling

### Java GUI (Advanced Features)
- **Production-ready**: Enterprise-level booking system
- **Interactive Features**: Seat selection, payment processing
- **Professional UI**: Modern Swing with Material Design
- **Comprehensive**: Booking management, admin panel

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Heroicons for icons
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express.js
- TypeScript for type safety
- Prisma ORM with SQLite
- JWT for authentication
- bcryptjs for password hashing
- Express-validator for validation

### Java GUI
- Java Swing with modern UI
- Material Design color scheme
- Interactive components
- Professional workflow

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Java 8+ (for GUI)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/12asascoder/BUS-RESERVATION-SYSTEM.git
cd BUS-RESERVATION-SYSTEM
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Java GUI Setup
```bash
cd java-gui
javac SmartBusBookingGUI.java
java SmartBusBookingGUI
```

## 🚀 Quick Start

### Start Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### Launch Java GUI
```bash
cd java-gui
javac SmartBusBookingGUI.java
java SmartBusBookingGUI
```

## 🔑 Default Credentials

### Admin Account
- **Email**: admin@smartbus2plus.com
- **Password**: admin123
- **Role**: Admin (full access)

### Passenger Accounts
- **Email**: john@example.com
- **Password**: passenger123
- **Role**: Passenger

- **Email**: jane@example.com
- **Password**: passenger123
- **Role**: Passenger

## 📊 Features

### Web Interface (React/TypeScript)
- ✅ Professional landing page with modern design
- ✅ Complete authentication system
- ✅ Real-time dashboard with statistics
- ✅ Bus search and filtering
- ✅ Booking history management
- ✅ IoT monitoring dashboard
- ✅ RFID boarding system
- ✅ AI travel assistant
- ✅ Analytics and reporting (admin)

### Java GUI (Advanced Features)
- ✅ Interactive seat selection
- ✅ Multiple payment methods
- ✅ Comprehensive booking management
- ✅ Professional admin panel
- ✅ Real-time seat availability
- ✅ Advanced search and filtering
- ✅ Booking history and cancellation
- ✅ System reports and analytics

### Backend API
- ✅ RESTful endpoints for all operations
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Comprehensive validation
- ✅ Error handling and logging
- ✅ Rate limiting and security
- ✅ Database management with Prisma

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Buses
- `GET /api/buses` - Get all buses (with filters)
- `GET /api/buses/:id` - Get specific bus details

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking

### Admin
- `GET /api/admin/stats` - Get system statistics

### IoT & Monitoring
- `GET /api/iot/data` - Get IoT sensor data
- `GET /api/rfid/events` - Get RFID boarding events

## 🎯 Usage Guide

### For Passengers
1. **Register/Login** on the web interface
2. **Search Buses** using the search page
3. **View Dashboard** for booking history
4. **Use Java GUI** for advanced booking features
5. **Monitor IoT** data for real-time bus tracking

### For Administrators
1. **Login** with admin credentials
2. **Access Analytics** for system overview
3. **Monitor IoT** sensors and RFID events
4. **Use Java GUI** for comprehensive management
5. **View Reports** and system statistics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Role-based access control

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Modern Material Design
- Accessible components

## 🚀 Production Deployment

### Environment Variables
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=your_production_database_url
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=your_frontend_url
```

### Database Migration
```bash
npm run db:migrate
npm run db:seed
```

### Build for Production
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Email**: support@smartbus2plus.com
- **Phone**: +91-800-123-4567
- **Documentation**: [API Docs](http://localhost:5000/api/docs)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

## 🎉 Acknowledgments

- Built with modern web technologies
- Professional UI/UX design
- Enterprise-level architecture
- Production-ready implementation

---

**SmartBus2+** - Experience the future of bus transportation! 🚌✨
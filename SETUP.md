# 🚌 SmartBus2+ - Complete Setup Guide

## Overview
SmartBus2+ is a futuristic bus reservation system featuring RFID-based smart boarding, IoT telemetry, AI-powered travel assistance, and sustainability analytics.

## 🏗️ Architecture

### Microservices
- **Eureka Server** (Port 8761) - Service Discovery
- **API Gateway** (Port 8080) - Central entry point
- **Auth Service** (Port 8081) - Authentication & JWT
- **Inventory Service** (Port 8082) - Buses, routes, schedules
- **Booking Service** (Port 8083) - Seat booking & holds
- **Payment Service** (Port 8084) - Transaction processing
- **IoT Telemetry Service** (Port 8085) - Sensor data streaming
- **RFID Gateway Service** (Port 8086) - Smart boarding
- **AI Assist Service** (Port 8087) - AI recommendations
- **Analytics Service** (Port 8088) - Energy optimization

### Frontend
- **React App** (Port 3000) - TypeScript + TailwindCSS

### Infrastructure
- **PostgreSQL** (Port 5432) - Primary database
- **Redis** (Port 6379) - Caching & seat locks
- **Kafka** (Port 9092) - Event streaming
- **Zookeeper** (Port 2181) - Kafka coordination

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 17+
- Node.js 18+
- Maven 3.6+

### 1. Start Infrastructure
```bash
# Start databases and message brokers
docker-compose up -d postgres redis kafka zookeeper
```

### 2. Build Backend Services
```bash
# Build all microservices
cd backend
for service in eureka-server api-gateway auth-service inventory-service booking-service payment-service iot-telemetry-service rfid-gateway-service ai-assist-service analytics-service; do
  cd $service
  mvn clean package -DskipTests
  cd ..
done
```

### 3. Start Backend Services
```bash
# Start all services
docker-compose up -d
```

### 4. Build and Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Swagger UI**: http://localhost:8080/swagger-ui.html

## 🔑 Demo Credentials

### Users
- **Admin**: `admin` / `admin`
- **Passenger**: `passenger1` / `password`
- **Operator**: `operator1` / `password`
- **Conductor**: `conductor1` / `password`

## 🎯 Key Features

### 1. RFID Smart Boarding
- Real-time ticket verification
- Automatic passenger tracking
- Boarding status monitoring
- WebSocket notifications

### 2. IoT Sensor Integration
- Live environmental monitoring
- Seat occupancy detection
- Real-time comfort scoring
- Automatic alerts

### 3. AI Travel Assistant
- Personalized seat recommendations
- Route optimization
- Predictive timing
- Comfort analysis

### 4. Energy Analytics
- Green score calculation
- Fuel efficiency tracking
- Driver behavior analysis
- Sustainability metrics

### 5. Smart Seat System
- Dynamic health monitoring
- Auto-adjustment pricing
- Real-time availability
- Comfort-based recommendations

## 📊 Real-time Features

### WebSocket Endpoints
- `/ws/iot` - IoT sensor data
- `/ws/rfid` - RFID boarding events
- `/ws/ai` - AI recommendations

### Kafka Topics
- `iot-telemetry` - Sensor data
- `rfid-events` - Boarding events
- `ai-recommendations` - AI insights
- `energy-analytics` - Performance data
- `booking-events` - Booking updates

## 🔧 Development

### Running Individual Services
```bash
# Example: Run auth service locally
cd backend/auth-service
mvn spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Management
```bash
# Connect to PostgreSQL
docker exec -it smartbus2plus_postgres_1 psql -U bus_user -d bus_reservation
```

## 📈 Monitoring

### Health Checks
- All services: `/actuator/health`
- Service discovery: http://localhost:8761
- Individual service health: `http://service:port/actuator/health`

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service
```

## 🛠️ Troubleshooting

### Common Issues

1. **Services not starting**
   - Check if ports are available
   - Verify Docker containers are running
   - Check service dependencies

2. **Database connection issues**
   - Ensure PostgreSQL is running
   - Check connection strings in application.yml
   - Verify database exists

3. **WebSocket connection issues**
   - Check WebSocket endpoints
   - Verify CORS configuration
   - Check network connectivity

4. **Kafka issues**
   - Ensure Zookeeper is running
   - Check Kafka broker configuration
   - Verify topic creation

### Reset Everything
```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: This will delete all data)
docker-compose down -v

# Restart
docker-compose up -d
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/validate` - Token validation

### Booking
- `POST /api/booking/create` - Create booking
- `GET /api/booking/user/{userId}` - Get user bookings
- `PUT /api/booking/{id}/confirm` - Confirm booking

### IoT Telemetry
- `GET /api/iot/bus/{busId}/environment` - Get bus environment
- `GET /api/iot/bus/{busId}/recent/{minutes}` - Recent data

### RFID Boarding
- `POST /api/rfid/scan` - Process RFID scan
- `GET /api/rfid/boarding-status/{busId}` - Boarding status

### AI Assistant
- `POST /api/ai/recommendations/seat` - Seat recommendations
- `POST /api/ai/recommendations/route` - Route optimization

### Analytics
- `POST /api/analytics/energy` - Calculate green score
- `GET /api/analytics/energy/bus/{busId}` - Bus analytics

## 🎨 Frontend Features

### Pages
- **Home** - Landing page with features
- **Dashboard** - Overview and quick actions
- **Booking** - Trip search and booking
- **Seat Map** - Interactive seat selection
- **IoT Dashboard** - Real-time sensor monitoring
- **RFID Boarding** - Smart boarding interface
- **AI Assistant** - Chat with AI
- **Analytics** - Performance metrics
- **Profile** - User management

### Components
- Real-time data visualization
- Interactive seat maps
- WebSocket integration
- Responsive design
- Modern UI with TailwindCSS

## 🔒 Security

### Authentication
- JWT-based authentication
- Role-based access control
- Secure password hashing

### Data Protection
- Input validation
- SQL injection prevention
- CORS configuration
- Secure headers

## 🌱 Sustainability Features

### Green Scoring
- Fuel efficiency tracking
- Driver behavior analysis
- Route optimization
- Carbon footprint reduction

### Energy Analytics
- Real-time monitoring
- Predictive maintenance
- Efficiency recommendations
- Environmental impact tracking

## 📱 Mobile Responsiveness

The frontend is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🚀 Production Deployment

### Environment Variables
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db:5432/bus_reservation
SPRING_DATASOURCE_USERNAME=your-username
SPRING_DATASOURCE_PASSWORD=your-password

# Redis
SPRING_REDIS_HOST=your-redis-host
SPRING_REDIS_PORT=6379

# Kafka
KAFKA_BOOTSTRAP_SERVERS=your-kafka:9092
```

### Scaling
- Horizontal scaling of microservices
- Database replication
- Load balancing
- Caching strategies

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review service logs
3. Verify configuration
4. Check network connectivity

## 🎉 Conclusion

SmartBus2+ represents the future of smart transportation with:
- Cutting-edge technology integration
- Real-time data processing
- AI-powered insights
- Sustainable operations
- Enhanced passenger experience

Welcome to the future of bus travel! 🚌✨


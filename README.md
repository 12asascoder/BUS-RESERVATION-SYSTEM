# 🚌 SmartBus2+ - Futuristic Bus Reservation System

A cutting-edge, comprehensive bus reservation platform featuring RFID-based smart boarding, IoT telemetry, AI-powered travel assistance, sustainability analytics, and advanced passenger management capabilities.

## 🌟 Key Features

### 🔐 Authentication & User Management
- **JWT-based Authentication** with role-based access control
- **Dual User Roles**: Admin and Passenger interfaces
- **Secure Registration & Login** with email validation
- **Profile Management** with booking history
- **Role-based Navigation** and feature access

### 🚌 Core Booking Features
- **Advanced Bus Search** with comprehensive filters (route, date, time, bus type, price range)
- **Dynamic Seat Selection** with airplane-style interactive seat map
- **Real-time Seat Availability** with occupancy tracking
- **Multi-step Booking Process** (11-step passenger journey)
- **Payment Integration** (UPI, Credit/Debit, Wallet, Net Banking)
- **Instant Ticket Generation** with PNR numbers
- **Booking Management** (view, cancel, modify bookings)
- **Comprehensive Bus Fleet** (90+ buses across major Indian routes)

### 🚀 Futuristic Features

#### 1. **RFID-Based Smart Boarding System**
- **Digital RFID-enabled tickets** with QR+RFID hybrid technology
- **Real-time boarding verification** via WebSocket-connected RFID scanners
- **Automatic passenger tracking** and boarding status updates
- **Capacity Management** with overbooking prevention
- **Boarding Progress Monitoring** with live statistics
- **No-show Detection** and automated alerts to conductors

#### 2. **IoT Sensor Integration & Telemetry**
- **Live Environmental Monitoring**: Temperature, humidity, vibration tracking
- **Seat Pressure Sensors** for real-time occupancy detection
- **Comfort Scoring** based on environmental factors
- **Real-time Dashboard** with live sensor data visualization
- **Automated Alerts** for temperature thresholds and route deviations
- **Data Streaming** every 5 seconds via WebSocket + Kafka

#### 3. **AI Travel Assistant**
- **Personalized Seat Recommendations** based on comfort, sunlight, and motion preferences
- **Predictive Traffic Delay Estimation** using AI algorithms
- **Automatic Route Re-routing** suggestions
- **Real-time Travel Insights** and recommendations
- **Smart Travel Planning** assistance
- **Always-on AI Support** for both admin and passenger users

#### 4. **Energy Optimization Analytics**
- **Driver Behavior Tracking** for fuel efficiency analysis
- **Green Score Calculation** per trip based on eco-driving patterns
- **Operator Eco-analytics Dashboards** with sustainability metrics
- **Optimal Driving Pattern Recommendations** for fuel cost optimization
- **Environmental Impact Tracking** and reporting

#### 5. **Dynamic Smart-Seat System**
- **Seat Health Monitoring** with pressure sensor integration
- **Automatic Maintenance Detection** for broken or less cushioned seats
- **Dynamic Pricing** based on seat comfort levels
- **Mid-journey Seat Reallocation** suggestions
- **Seat Status Tracking** (Available, Occupied, Under Maintenance)

#### 6. **Lost Item & Security System**
- **RFID Item Tracking** for luggage and personal belongings
- **Automated Alerts** if items are left behind
- **Simulated IoT Scanner** for tagged item detection
- **Security Monitoring** with incident detection

#### 7. **Identity & Face Match Boarding**
- **Optional Facial Recognition** boarding with RFID + camera verification
- **Secure Logging** and GDPR-compliant consent management
- **Multi-factor Authentication** for enhanced security

#### 8. **AI Incident Detector**
- **IoT + GPS + Audio Analysis** for unusual event detection
- **Automated Incident Reports** for sudden braking, abnormal acceleration, loud noises
- **AI Bus Health Index** for predictive maintenance
- **Real-time Safety Monitoring**

#### 9. **Social Seating & Smart Matching**
- **Opt-in Intelligent Pairing** based on travel patterns and preferences
- **Privacy-safe Algorithms** for passenger matching
- **Comfort-based Seating** recommendations

#### 10. **Tokenized Rebooking System**
- **Rebook Tokens** instead of traditional refunds
- **Shareable/Transferable Tokens** for flexible travel planning
- **Optional Blockchain Integration** simulation via signed tokens

## 🏗️ Architecture

### Microservices Architecture
- **`eureka-server`** - Service discovery and registration
- **`api-gateway`** - Centralized API routing and load balancing
- **`auth-service`** - User authentication, JWT management, and authorization
- **`inventory-service`** - Bus fleet, routes, schedules, and seat configurations
- **`booking-service`** - Seat booking, hold management, and Redis-based seat locking
- **`payment-service`** - Transaction processing and payment gateway integration
- **`iot-telemetry-service`** - IoT sensor data collection, processing, and WebSocket streaming
- **`rfid-gateway-service`** - RFID hardware simulation and boarding event management
- **`ai-assist-service`** - AI recommendations, predictions, and travel assistance
- **`analytics-service`** - Performance analytics, energy optimization, and reporting

### Frontend Modules
- **`SeatMapCanvas`** - Interactive seat selection with real-time availability
- **`SmartBoarding`** - RFID and facial recognition boarding dashboard
- **`EcoAnalyticsPanel`** - Sustainability metrics and energy optimization
- **`AITravelAssistant`** - AI-powered travel insights and recommendations
- **`LostItemTracker`** - Luggage management and RFID tracking
- **`PassengerBookingPage`** - Comprehensive 11-step booking process
- **`IoTDashboardPage`** - Real-time sensor data visualization
- **`RFIDBoardingPage`** - Smart boarding management with capacity control

## 🛠️ Tech Stack

### Backend Technologies
- **Java 17+** with Spring Boot 3+
- **Maven** for dependency management and build automation
- **PostgreSQL** for persistent data storage and ACID compliance
- **Redis** for caching, session management, and seat locking
- **Apache Kafka** for event streaming and real-time data processing
- **WebSocket** for real-time bidirectional communication
- **Spring Security** for authentication and authorization
- **JWT (JSON Web Tokens)** for stateless authentication
- **Spring Cloud Gateway** for API routing and load balancing
- **Eureka Server** for service discovery and registration

### Frontend Technologies
- **React 18+** with TypeScript for type-safe development
- **Vite** for fast build tooling and development server
- **TailwindCSS** for utility-first styling and responsive design
- **React Router** for client-side routing and navigation
- **WebSocket Client** for real-time updates and live data
- **Context API** for global state management
- **Heroicons** for consistent iconography

### Infrastructure & DevOps
- **Docker Compose** for containerized local development
- **Docker** for containerization and deployment
- **Swagger/OpenAPI** for comprehensive API documentation
- **Maven** for Java dependency management
- **npm** for Node.js package management

## 🚀 Quick Start

### Prerequisites
```bash
- Docker & Docker Compose
- Java 17+
- Node.js 18+
- Git
```

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/12asascoder/BUS-RESERVATION-SYSTEM.git
   cd BUS-RESERVATION-SYSTEM
   ```

2. **Start the Complete System**
   ```bash
   docker-compose up -d --build
   ```

3. **Access Applications**
   - **Frontend Application**: http://localhost:3000
   - **API Gateway**: http://localhost:8080
   - **Swagger API Documentation**: http://localhost:8080/swagger-ui.html
   - **Eureka Server Dashboard**: http://localhost:8761

### Demo Credentials

#### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **Features**: Full system access, bus management, analytics, IoT monitoring

#### Passenger Access
- **Username**: `passenger`
- **Password**: `passenger123`
- **Features**: Booking, seat selection, AI assistant, booking history

## 📊 Comprehensive Demo Data

The system includes extensive seed data for realistic testing:

### Bus Fleet (90+ Buses)
- **Mumbai → Delhi**: 12 buses (Premium, Luxury, Standard categories)
- **Bangalore → Chennai**: 12 buses (Various models and amenities)
- **Delhi → Jaipur**: 12 buses (Heritage and modern routes)
- **Mumbai → Pune**: 12 buses (Tech corridor express services)
- **Delhi → Chandigarh**: 12 buses (Capital region connectivity)
- **Kolkata → Hyderabad**: 12 buses (East-West corridor)
- **Chennai → Bangalore**: 12 buses (Silicon Valley express)
- **Maintenance/Standby**: 6 buses for operational flexibility

### Route Coverage
- **Major Indian Cities**: Mumbai, Delhi, Bangalore, Chennai, Pune, Jaipur, Chandigarh, Kolkata, Hyderabad
- **Distance Ranges**: 150km to 1500km routes
- **Multiple Departure Times**: Morning, afternoon, evening, and night services
- **Price Ranges**: ₹400 to ₹2500 based on route and bus category

### Mock Data Systems
- **IoT Sensor Data**: Temperature, humidity, vibration, fuel levels
- **RFID Events**: Boarding, scan failures, capacity exceeded scenarios
- **AI Recommendations**: Seat suggestions, traffic predictions, route optimizations
- **Analytics Data**: Energy scores, driver behavior patterns, sustainability metrics

## 🔧 Development

### Backend Development
```bash
# Start individual microservices
cd backend/auth-service && mvn spring-boot:run
cd backend/inventory-service && mvn spring-boot:run
cd backend/booking-service && mvn spring-boot:run
# ... repeat for other services
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Management
```bash
# PostgreSQL connection
psql -h localhost -p 5432 -U smartbus -d smartbus_db
```

## 📈 Real-time Monitoring & Analytics

### IoT Dashboard Features
- **Live Sensor Data**: Temperature, humidity, vibration monitoring
- **Environmental Alerts**: Threshold-based notifications
- **Comfort Scoring**: Real-time passenger comfort analysis
- **Bus Health Monitoring**: Predictive maintenance indicators

### RFID Boarding System
- **Real-time Boarding Progress**: Live passenger tracking
- **Capacity Management**: Overbooking prevention and alerts
- **Event Logging**: Comprehensive boarding event history
- **Success Rate Analytics**: RFID scan performance metrics

### AI Assistant Capabilities
- **Seat Recommendations**: AI-powered comfort and preference matching
- **Traffic Predictions**: Real-time delay estimation
- **Route Optimization**: Dynamic re-routing suggestions
- **Travel Insights**: Personalized travel recommendations

### Energy Analytics
- **Green Score Tracking**: Eco-driving performance metrics
- **Fuel Efficiency Analysis**: Driver behavior optimization
- **Sustainability Reporting**: Environmental impact tracking
- **Cost Optimization**: Fuel cost vs. speed analysis

## 🎨 User Interface Features

### Design System
- **Cosmos Theme**: Dark background with star effects and cosmic gradients
- **Purple Headings**: Consistent purple color scheme for all headings
- **White Text**: High contrast white text for optimal readability
- **Glass Morphism**: Modern glass-like UI elements with transparency
- **Responsive Design**: Mobile-first approach with TailwindCSS

### User Experience
- **Role-based Navigation**: Different interfaces for admin and passenger users
- **Intuitive Booking Flow**: 11-step guided booking process
- **Real-time Updates**: Live data synchronization across all components
- **Interactive Seat Maps**: Visual seat selection with availability status
- **Comprehensive Dashboards**: Rich data visualization and analytics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin and passenger permission systems
- **Data Encryption**: Secure data transmission and storage
- **GDPR Compliance**: Privacy-safe data handling
- **Input Validation**: Comprehensive form validation and sanitization

## 🚀 Deployment

### Production Deployment
```bash
# Build all services
docker-compose -f docker-compose.prod.yml up -d --build

# Scale services as needed
docker-compose up -d --scale booking-service=3
```

### Environment Configuration
- **Development**: Local Docker Compose setup
- **Staging**: Container orchestration with load balancing
- **Production**: Kubernetes deployment with auto-scaling

## 📚 API Documentation

### Available Endpoints
- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Bus Management**: `/api/inventory/buses`, `/api/inventory/routes`
- **Booking**: `/api/booking/search`, `/api/booking/create`
- **IoT Data**: `/api/iot/telemetry`, `/api/iot/dashboard`
- **RFID Events**: `/api/rfid/events`, `/api/rfid/scan`
- **AI Assistant**: `/api/ai/recommendations`, `/api/ai/predictions`
- **Analytics**: `/api/analytics/energy`, `/api/analytics/reports`

### Swagger Documentation
Access comprehensive API documentation at: http://localhost:8080/swagger-ui.html

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot community for excellent microservices framework
- React team for the powerful frontend library
- TailwindCSS for the utility-first CSS framework
- Docker for containerization platform
- PostgreSQL and Redis for robust data storage solutions

---

**Built with ❤️ for the future of smart mobility and sustainable transportation.**

*SmartBus2+ - Revolutionizing bus travel with cutting-edge technology, AI-powered insights, and sustainable practices.*
# 🚌 SmartBus2+ - API Documentation

## Overview
SmartBus2+ provides a comprehensive REST API for managing bus reservations, IoT telemetry, RFID boarding, AI recommendations, and analytics.

## Base URL
```
http://localhost:8080/api
```

## Authentication
All endpoints (except login/register) require JWT authentication:
```
Authorization: Bearer <jwt-token>
```

---

## 🔐 Authentication Service

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@futuretransit.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN"
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Validate Token
```http
POST /api/auth/validate
Authorization: Bearer <jwt-token>
```

---

## 🚌 Inventory Service

### Get All Buses
```http
GET /api/inventory/buses
```

### Get Bus by ID
```http
GET /api/inventory/buses/{id}
```

### Get Schedules by Route
```http
GET /api/inventory/schedules/route/{routeId}
```

### Get Seat Configurations
```http
GET /api/inventory/seats/bus/{busId}
```

### Update Seat Health Status
```http
PUT /api/inventory/seats/bus/{busId}/seat/{seatNumber}/health?status=MAINTENANCE
```

---

## 🎫 Booking Service

### Create Booking
```http
POST /api/booking/create
Content-Type: application/x-www-form-urlencoded

userId=1&scheduleId=1&seatNumber=3A&totalAmount=45.00&travelDate=2024-01-15
```

### Get User Bookings
```http
GET /api/booking/user/{userId}
```

### Confirm Booking
```http
PUT /api/booking/{bookingId}/confirm
```

### Cancel Booking
```http
PUT /api/booking/{bookingId}/cancel
```

### Check Seat Availability
```http
GET /api/booking/seat/available?scheduleId=1&seatNumber=3A&travelDate=2024-01-15
```

---

## 💳 Payment Service

### Process Payment
```http
POST /api/payment/process
Content-Type: application/x-www-form-urlencoded

bookingId=1&paymentMethod=CREDIT_CARD&amount=45.00
```

### Refund Payment
```http
POST /api/payment/{paymentId}/refund?refundAmount=45.00
```

### Get Payment by ID
```http
GET /api/payment/{paymentId}
```

### Get Total Revenue
```http
GET /api/payment/revenue/total
```

---

## 📡 IoT Telemetry Service

### Send Telemetry Data
```http
POST /api/iot/telemetry
Content-Type: application/json

{
  "busId": 1,
  "sensorType": "temperature",
  "sensorId": "TEMP_001",
  "value": 22.5,
  "unit": "°C",
  "location": "cabin"
}
```

### Get Bus Environment
```http
GET /api/iot/bus/{busId}/environment
```

**Response:**
```json
{
  "busId": 1,
  "temperature": 22.5,
  "humidity": 45.0,
  "vibration": 0.8,
  "noiseLevel": 65.0,
  "speed": 75.0,
  "comfortScore": 0.87,
  "timestamp": "2024-01-15T10:30:00"
}
```

### Get Recent Telemetry Data
```http
GET /api/iot/bus/{busId}/recent/{minutes}
```

---

## 🎫 RFID Gateway Service

### Process RFID Scan
```http
POST /api/rfid/scan
Content-Type: application/json

{
  "busId": 1,
  "rfidReaderId": "READER_001",
  "ticketId": "TICKET_123",
  "location": "boarding_gate_1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Boarding successful",
  "eventType": "BOARDING",
  "passengerId": 1,
  "seatNumber": "3A",
  "busNumber": "BUS-1",
  "scanTime": "2024-01-15T10:30:00"
}
```

### Get Boarding Status
```http
GET /api/rfid/boarding-status/{busId}
```

**Response:**
```json
{
  "busId": 1,
  "busNumber": "BUS-1",
  "totalPassengers": 25,
  "boardedPassengers": 18,
  "missedPassengers": 7,
  "boardingPercentage": 72.0,
  "lastUpdate": "2024-01-15T10:30:00"
}
```

### Get RFID Events
```http
GET /api/rfid/events/bus/{busId}
```

---

## 🤖 AI Assist Service

### Generate Seat Recommendation
```http
POST /api/ai/recommendations/seat?userId=1&busId=1&preferences=window_preference
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "recommendationType": "seat_suggestion",
  "content": "{\"recommendedSeat\":\"3A\",\"reason\":\"Optimal comfort and view\",\"busId\":1}",
  "confidenceScore": 0.92,
  "isApplied": false,
  "createdAt": "2024-01-15T10:30:00"
}
```

### Generate Route Optimization
```http
POST /api/ai/recommendations/route?userId=1&origin=New York&destination=Boston
```

### Generate Timing Recommendation
```http
POST /api/ai/recommendations/timing?userId=1&routeId=ROUTE_001
```

### Generate Comfort Analysis
```http
POST /api/ai/recommendations/comfort?userId=1&busId=1
```

### Get User Recommendations
```http
GET /api/ai/recommendations/user/{userId}
```

### Mark Recommendation as Applied
```http
PUT /api/ai/recommendations/{id}/apply
```

---

## 📊 Analytics Service

### Calculate Green Score
```http
POST /api/analytics/energy?busId=1&tripId=TRIP_001&driverId=1&fuelConsumption=95.5&distanceKm=350.0
```

**Response:**
```json
{
  "id": 1,
  "busId": 1,
  "tripId": "TRIP_001",
  "driverId": 1,
  "fuelConsumption": 95.5,
  "distanceKm": 350.0,
  "greenScore": 0.87,
  "efficiencyMetrics": "{\"fuelEfficiency\":3.67,\"smoothnessScore\":0.85,\"idleTimeScore\":0.92}",
  "tripDate": "2024-01-15",
  "createdAt": "2024-01-15T10:30:00"
}
```

### Get Analytics by Bus
```http
GET /api/analytics/energy/bus/{busId}
```

### Get Average Green Score
```http
GET /api/analytics/energy/bus/{busId}/average-green-score
```

### Get Analytics by Date Range
```http
GET /api/analytics/energy/date-range?startDate=2024-01-01&endDate=2024-01-31
```

---

## 🔌 WebSocket Endpoints

### IoT Telemetry
```javascript
const socket = new SockJS('http://localhost:8080/ws/iot');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function() {
  // Subscribe to IoT data
  stompClient.subscribe('/topic/iot/environment', function(data) {
    const telemetryData = JSON.parse(data.body);
    console.log('IoT Data:', telemetryData);
  });
});
```

### RFID Events
```javascript
const socket = new SockJS('http://localhost:8080/ws/rfid');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function() {
  // Subscribe to RFID events
  stompClient.subscribe('/topic/rfid/events', function(data) {
    const rfidEvent = JSON.parse(data.body);
    console.log('RFID Event:', rfidEvent);
  });
  
  // Subscribe to boarding status
  stompClient.subscribe('/topic/rfid/boarding-status', function(data) {
    const status = JSON.parse(data.body);
    console.log('Boarding Status:', status);
  });
});
```

### AI Recommendations
```javascript
const socket = new SockJS('http://localhost:8080/ws/ai');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function() {
  // Subscribe to AI recommendations
  stompClient.subscribe('/topic/ai/recommendations', function(data) {
    const recommendation = JSON.parse(data.body);
    console.log('AI Recommendation:', recommendation);
  });
});
```

---

## 📈 Kafka Topics

### IoT Telemetry
- **Topic**: `iot-telemetry`
- **Data**: Environmental sensor data, seat occupancy

### RFID Events
- **Topic**: `rfid-events`
- **Data**: Boarding events, ticket scans

### AI Recommendations
- **Topic**: `ai-recommendations`
- **Data**: Seat suggestions, route optimization

### Energy Analytics
- **Topic**: `energy-analytics`
- **Data**: Green scores, fuel efficiency

### Booking Events
- **Topic**: `booking-events`
- **Data**: Booking creation, confirmation, cancellation

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid input parameters",
  "path": "/api/booking/create"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token is invalid or expired",
  "path": "/api/booking/user/1"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found",
  "path": "/api/inventory/buses/999"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/payment/process"
}
```

---

## 🔧 Health Checks

### Service Health
```http
GET /actuator/health
```

**Response:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 499963174912,
        "free": 250790912000,
        "threshold": 10485760
      }
    }
  }
}
```

---

## 📝 Rate Limiting

### Default Limits
- **Authentication**: 10 requests per minute
- **Booking**: 5 requests per minute
- **Payment**: 3 requests per minute
- **IoT Data**: 100 requests per minute

### Headers
```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1642248600
```

---

## 🔒 Security Headers

### CORS
- **Allowed Origins**: `*` (development), specific domains (production)
- **Allowed Methods**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **Allowed Headers**: `Authorization`, `Content-Type`

### Security Headers
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 📊 Response Formats

### Success Response
```json
{
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00"
}
```

### Paginated Response
```json
{
  "content": [ ... ],
  "pageable": {
    "sort": {
      "sorted": true,
      "unsorted": false
    },
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 100,
  "totalPages": 5,
  "first": true,
  "last": false,
  "numberOfElements": 20
}
```

---

## 🎯 Best Practices

### Request Headers
```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
Accept: application/json
```

### Error Handling
- Always check HTTP status codes
- Parse error messages for user feedback
- Implement retry logic for transient failures
- Log errors for debugging

### Performance
- Use pagination for large datasets
- Implement caching where appropriate
- Use WebSocket for real-time data
- Optimize database queries

---

## 📞 Support

For API support and questions:
1. Check the Swagger UI: http://localhost:8080/swagger-ui.html
2. Review service logs
3. Test endpoints with provided examples
4. Verify authentication tokens

---

*SmartBus2+ API Documentation - Version 1.0*

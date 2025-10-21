package com.smartbus2plus.inventory.service;

import com.smartbus2plus.inventory.model.Bus;
import com.smartbus2plus.inventory.model.Schedule;
import com.smartbus2plus.inventory.model.SeatConfiguration;
import com.smartbus2plus.inventory.model.Route;
import com.smartbus2plus.inventory.repository.BusRepository;
import com.smartbus2plus.inventory.repository.ScheduleRepository;
import com.smartbus2plus.inventory.repository.SeatConfigurationRepository;
import com.smartbus2plus.inventory.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

/**
 * Service to initialize comprehensive bus data for SmartBus2+
 */
@Service
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private ScheduleRepository scheduleRepository;
    
    @Autowired
    private SeatConfigurationRepository seatConfigurationRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    
    @Override
    public void run(String... args) throws Exception {
        initializeData();
    }
    
    private void initializeData() {
        // Initialize routes
        initializeRoutes();
        
        // Initialize buses
        initializeBuses();
        
        // Initialize schedules
        initializeSchedules();
        
        // Initialize seat configurations
        initializeSeatConfigurations();
    }
    
    private void initializeRoutes() {
        List<Route> routes = Arrays.asList(
            createRoute("MUMBAI-DELHI", "Mumbai", "Delhi", 1400, "Express Highway"),
            createRoute("DELHI-MUMBAI", "Delhi", "Mumbai", 1400, "Express Highway"),
            createRoute("BANGALORE-CHENNAI", "Bangalore", "Chennai", 350, "State Highway"),
            createRoute("CHENNAI-BANGALORE", "Chennai", "Bangalore", 350, "State Highway"),
            createRoute("DELHI-JAIPUR", "Delhi", "Jaipur", 280, "National Highway"),
            createRoute("JAIPUR-DELHI", "Jaipur", "Delhi", 280, "National Highway"),
            createRoute("KOLKATA-HYDERABAD", "Kolkata", "Hyderabad", 800, "Express Highway"),
            createRoute("HYDERABAD-KOLKATA", "Hyderabad", "Kolkata", 800, "Express Highway"),
            createRoute("MUMBAI-PUNE", "Mumbai", "Pune", 150, "Express Highway"),
            createRoute("PUNE-MUMBAI", "Pune", "Mumbai", 150, "Express Highway"),
            createRoute("DELHI-CHANDIGARH", "Delhi", "Chandigarh", 250, "National Highway"),
            createRoute("CHANDIGARH-DELHI", "Chandigarh", "Delhi", 250, "National Highway"),
            createRoute("BANGALORE-HYDERABAD", "Bangalore", "Hyderabad", 570, "State Highway"),
            createRoute("HYDERABAD-BANGALORE", "Hyderabad", "Bangalore", 570, "State Highway"),
            createRoute("MUMBAI-AHMEDABAD", "Mumbai", "Ahmedabad", 530, "Express Highway"),
            createRoute("AHMEDABAD-MUMBAI", "Ahmedabad", "Mumbai", 530, "Express Highway")
        );
        
        routeRepository.saveAll(routes);
    }
    
    private Route createRoute(String routeCode, String fromCity, String toCity, int distance, String highway) {
        Route route = new Route();
        route.setRouteCode(routeCode);
        route.setFromCity(fromCity);
        route.setToCity(toCity);
        route.setDistance(distance);
        route.setHighway(highway);
        route.setIsActive(true);
        return route;
    }
    
    private void initializeBuses() {
        List<Bus> buses = Arrays.asList(
            createBus("SB-001", "SmartBus Pro", "Volvo B11R", 50, "Premium", true),
            createBus("SB-002", "SmartBus Elite", "Scania K360", 45, "Luxury", true),
            createBus("SB-003", "SmartBus Express", "Mercedes-Benz Tourismo", 40, "Standard", true),
            createBus("SB-004", "SmartBus Premium", "Volvo B9R", 55, "Premium", true),
            createBus("SB-005", "SmartBus Comfort", "Ashok Leyland", 48, "Standard", true),
            createBus("SB-006", "SmartBus Deluxe", "Tata Marcopolo", 42, "Luxury", true),
            createBus("SB-007", "SmartBus City", "Mahindra Comfio", 35, "Standard", true),
            createBus("SB-008", "SmartBus Intercity", "Volvo B11R", 50, "Premium", true),
            createBus("SB-009", "SmartBus Long Haul", "Scania K410", 60, "Luxury", true),
            createBus("SB-010", "SmartBus Regional", "Ashok Leyland", 45, "Standard", true),
            createBus("SB-011", "SmartBus Metro", "Mercedes-Benz Tourismo", 40, "Premium", true),
            createBus("SB-012", "SmartBus Connect", "Volvo B9R", 50, "Standard", true),
            createBus("SB-013", "SmartBus Executive", "Scania K360", 45, "Luxury", true),
            createBus("SB-014", "SmartBus Rapid", "Tata Marcopolo", 48, "Standard", true),
            createBus("SB-015", "SmartBus Classic", "Ashok Leyland", 42, "Standard", true),
            createBus("SB-016", "SmartBus Modern", "Volvo B11R", 50, "Premium", true),
            createBus("SB-017", "SmartBus Eco", "Mahindra Comfio", 38, "Eco", true),
            createBus("SB-018", "SmartBus Plus", "Mercedes-Benz Tourismo", 45, "Premium", true),
            createBus("SB-019", "SmartBus Max", "Scania K410", 55, "Luxury", true),
            createBus("SB-020", "SmartBus Prime", "Volvo B9R", 50, "Premium", true)
        );
        
        busRepository.saveAll(buses);
    }
    
    private Bus createBus(String busNumber, String busName, String model, int capacity, String category, boolean isActive) {
        Bus bus = new Bus();
        bus.setBusNumber(busNumber);
        bus.setBusName(busName);
        bus.setModel(model);
        bus.setCapacity(capacity);
        bus.setCategory(category);
        bus.setIsActive(isActive);
        bus.setCompanyId(1L); // Default company
        return bus;
    }
    
    private void initializeSchedules() {
        // Get routes and buses
        List<Route> routes = routeRepository.findAll();
        List<Bus> buses = busRepository.findAll();
        
        if (routes.isEmpty() || buses.isEmpty()) return;
        
        // Create schedules for major routes
        createScheduleForRoute(routes.get(0), buses.get(0), LocalTime.of(8, 0), LocalTime.of(20, 0), 2500); // Mumbai-Delhi
        createScheduleForRoute(routes.get(0), buses.get(1), LocalTime.of(14, 0), LocalTime.of(2, 0), 2500);
        createScheduleForRoute(routes.get(2), buses.get(2), LocalTime.of(9, 0), LocalTime.of(15, 0), 1200); // Bangalore-Chennai
        createScheduleForRoute(routes.get(4), buses.get(3), LocalTime.of(7, 0), LocalTime.of(12, 0), 800); // Delhi-Jaipur
        createScheduleForRoute(routes.get(6), buses.get(4), LocalTime.of(10, 0), LocalTime.of(22, 0), 1800); // Kolkata-Hyderabad
        createScheduleForRoute(routes.get(8), buses.get(5), LocalTime.of(6, 30), LocalTime.of(9, 0), 400); // Mumbai-Pune
        createScheduleForRoute(routes.get(10), buses.get(6), LocalTime.of(8, 30), LocalTime.of(13, 0), 600); // Delhi-Chandigarh
        createScheduleForRoute(routes.get(12), buses.get(7), LocalTime.of(11, 0), LocalTime.of(20, 0), 1500); // Bangalore-Hyderabad
        createScheduleForRoute(routes.get(14), buses.get(8), LocalTime.of(9, 30), LocalTime.of(18, 0), 1000); // Mumbai-Ahmedabad
        
        // Add more schedules for different times
        createScheduleForRoute(routes.get(0), buses.get(9), LocalTime.of(22, 0), LocalTime.of(10, 0), 2500); // Mumbai-Delhi Night
        createScheduleForRoute(routes.get(2), buses.get(10), LocalTime.of(15, 0), LocalTime.of(21, 0), 1200); // Bangalore-Chennai Evening
        createScheduleForRoute(routes.get(4), buses.get(11), LocalTime.of(13, 0), LocalTime.of(18, 0), 800); // Delhi-Jaipur Afternoon
    }
    
    private void createScheduleForRoute(Route route, Bus bus, LocalTime departureTime, LocalTime arrivalTime, int price) {
        Schedule schedule = new Schedule();
        schedule.setRouteId(route.getId());
        schedule.setBusId(bus.getId());
        schedule.setDepartureTime(departureTime);
        schedule.setArrivalTime(arrivalTime);
        schedule.setPrice(new BigDecimal(price));
        schedule.setDayOfWeek(1); // Monday
        schedule.setIsActive(true);
        scheduleRepository.save(schedule);
    }
    
    private void initializeSeatConfigurations() {
        List<Bus> buses = busRepository.findAll();
        
        for (Bus bus : buses) {
            createSeatConfigurationForBus(bus);
        }
    }
    
    private void createSeatConfigurationForBus(Bus bus) {
        int capacity = bus.getCapacity();
        
        for (int i = 1; i <= capacity; i++) {
            SeatConfiguration seat = new SeatConfiguration();
            seat.setBusId(bus.getId());
            seat.setSeatNumber(String.format("%02d", i));
            seat.setSeatType(determineSeatType(i, capacity));
            seat.setHealthStatus(SeatConfiguration.HealthStatus.GOOD);
            seat.setIsWindowSeat(isWindowSeat(i, capacity));
            seat.setIsAisleSeat(isAisleSeat(i, capacity));
            seat.setPriceMultiplier(calculatePriceMultiplier(i, capacity));
            
            seatConfigurationRepository.save(seat);
        }
    }
    
    private SeatConfiguration.SeatType determineSeatType(int seatNumber, int capacity) {
        if (seatNumber <= 4) return SeatConfiguration.SeatType.PREMIUM;
        if (seatNumber <= capacity * 0.3) return SeatConfiguration.SeatType.STANDARD;
        return SeatConfiguration.SeatType.ECONOMY;
    }
    
    private boolean isWindowSeat(int seatNumber, int capacity) {
        int seatsPerRow = 4; // 2+2 configuration
        int row = (seatNumber - 1) / seatsPerRow;
        int positionInRow = (seatNumber - 1) % seatsPerRow;
        return positionInRow == 0 || positionInRow == 3; // Window seats
    }
    
    private boolean isAisleSeat(int seatNumber, int capacity) {
        int seatsPerRow = 4; // 2+2 configuration
        int positionInRow = (seatNumber - 1) % seatsPerRow;
        return positionInRow == 1 || positionInRow == 2; // Aisle seats
    }
    
    private BigDecimal calculatePriceMultiplier(int seatNumber, int capacity) {
        if (seatNumber <= 4) return new BigDecimal("1.5"); // Premium seats
        if (seatNumber <= capacity * 0.3) return new BigDecimal("1.2"); // Standard seats
        return new BigDecimal("1.0"); // Economy seats
    }
}

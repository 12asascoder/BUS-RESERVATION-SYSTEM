import javax.swing.*;
import javax.swing.border.*;
import javax.swing.table.*;
import java.awt.*;
import java.awt.event.*;
import java.text.*;
import java.util.*;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class SmartBusBookingGUI extends JFrame {
    // Modern UI Components
    private JTabbedPane mainTabbedPane;
    private JPanel headerPanel, searchPanel, resultsPanel, seatSelectionPanel, bookingPanel;
    private JComboBox<String> fromComboBox, toComboBox, busTypeComboBox;
    private JDatePicker datePicker;
    private JTextField passengerNameField, passengerEmailField, passengerPhoneField, passengerAgeField;
    private JComboBox<String> genderComboBox, seatPreferenceComboBox;
    private JList<BusResult> busResultsList;
    private JTable bookingHistoryTable, adminTable;
    private JLabel totalPriceLabel, selectedSeatsLabel, busDetailsLabel;
    private JButton searchButton, bookButton, payButton, cancelButton;
    
    // Interactive Seat Map
    private JPanel seatMapPanel;
    private Map<String, JButton> seatButtons = new HashMap<>();
    private List<String> selectedSeats = new ArrayList<>();
    
    // Data Models
    private List<Bus> buses = new ArrayList<>();
    private List<Booking> bookings = new ArrayList<>();
    private Map<String, Boolean> seatAvailability = new HashMap<>();
    private Bus selectedBus = null;
    private double totalPrice = 0.0;
    
    // Modern Color Scheme (Material Design inspired)
    private final Color PRIMARY_COLOR = new Color(25, 118, 210);      // Blue
    private final Color PRIMARY_DARK = new Color(13, 71, 161);       // Dark Blue
    private final Color ACCENT_COLOR = new Color(255, 87, 34);       // Orange
    private final Color SUCCESS_COLOR = new Color(76, 175, 80);      // Green
    private final Color ERROR_COLOR = new Color(244, 67, 54);         // Red
    private final Color WARNING_COLOR = new Color(255, 152, 0);       // Amber
    private final Color BACKGROUND_COLOR = new Color(250, 250, 250);   // Light Gray
    private final Color CARD_COLOR = Color.WHITE;
    private final Color TEXT_PRIMARY = new Color(33, 33, 33);
    private final Color TEXT_SECONDARY = new Color(117, 117, 117);
    
    // Fonts
    private final Font HEADER_FONT = new Font("Segoe UI", Font.BOLD, 28);
    private final Font SUBHEADER_FONT = new Font("Segoe UI", Font.BOLD, 18);
    private final Font BODY_FONT = new Font("Segoe UI", Font.PLAIN, 14);
    private final Font SMALL_FONT = new Font("Segoe UI", Font.PLAIN, 12);
    
    public SmartBusBookingGUI() {
        initializeData();
        initializeGUI();
        setupEventHandlers();
        startRealTimeUpdates();
    }
    
    private void initializeData() {
        // Initialize comprehensive bus data
        buses.add(new Bus("SB001", "Volvo Multi-Axle", "Mumbai", "Delhi", 2500, "22:30", "06:30", 50, "AC Sleeper", "Volvo", 4.5));
        buses.add(new Bus("SB002", "Scania Metrolink", "Delhi", "Bangalore", 3200, "20:00", "08:00", 45, "AC Semi-Sleeper", "Scania", 4.7));
        buses.add(new Bus("SB003", "Mercedes Benz", "Bangalore", "Chennai", 1800, "06:00", "12:00", 40, "AC Seater", "Mercedes", 4.6));
        buses.add(new Bus("SB004", "Tata Marcopolo", "Chennai", "Kolkata", 2200, "18:00", "06:00", 35, "AC Sleeper", "Tata", 4.3));
        buses.add(new Bus("SB005", "Ashok Leyland", "Kolkata", "Hyderabad", 1900, "19:30", "07:30", 30, "Non-AC Sleeper", "Ashok Leyland", 4.1));
        buses.add(new Bus("SB006", "Eicher Pro", "Hyderabad", "Pune", 1600, "21:00", "09:00", 25, "AC Seater", "Eicher", 4.4));
        buses.add(new Bus("SB007", "Mahindra Comfio", "Pune", "Jaipur", 2100, "17:00", "05:00", 42, "AC Sleeper", "Mahindra", 4.2));
        buses.add(new Bus("SB008", "Force Traveller", "Jaipur", "Ahmedabad", 1400, "08:00", "16:00", 20, "Non-AC Seater", "Force", 3.9));
        
        // Initialize seat availability
        for (Bus bus : buses) {
            for (int row = 1; row <= 12; row++) {
                for (int col = 0; col < 4; col++) {
                    String seatNumber = row + String.valueOf((char)('A' + col));
                    seatAvailability.put(bus.getId() + "_" + seatNumber, Math.random() > 0.4);
                }
            }
        }
    }
    
    private void initializeGUI() {
        setTitle("SmartBus2+ - Professional Bus Booking System");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setLocationRelativeTo(null);
        
        setLayout(new BorderLayout());
        getContentPane().setBackground(BACKGROUND_COLOR);
        
        // Create main components
        createHeader();
        createMainContent();
        
        // Add components to frame
        add(headerPanel, BorderLayout.NORTH);
        add(mainTabbedPane, BorderLayout.CENTER);
    }
    
    private void createHeader() {
        headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(PRIMARY_COLOR);
        headerPanel.setBorder(new EmptyBorder(15, 30, 15, 30));
        
        // Logo and title
        JPanel logoPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        logoPanel.setOpaque(false);
        
        JLabel logoLabel = new JLabel("🚌 SmartBus2+");
        logoLabel.setFont(HEADER_FONT);
        logoLabel.setForeground(Color.WHITE);
        logoPanel.add(logoLabel);
        
        JLabel taglineLabel = new JLabel("Professional Bus Booking System");
        taglineLabel.setFont(SMALL_FONT);
        taglineLabel.setForeground(new Color(255, 255, 255, 200));
        logoPanel.add(taglineLabel);
        
        // User info panel
        JPanel userPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        userPanel.setOpaque(false);
        
        JLabel userLabel = new JLabel("👤 Welcome, User");
        userLabel.setFont(BODY_FONT);
        userLabel.setForeground(Color.WHITE);
        userPanel.add(userLabel);
        
        JButton logoutButton = createModernButton("Logout", ERROR_COLOR, Color.WHITE);
        logoutButton.setPreferredSize(new Dimension(80, 30));
        userPanel.add(logoutButton);
        
        headerPanel.add(logoPanel, BorderLayout.WEST);
        headerPanel.add(userPanel, BorderLayout.EAST);
    }
    
    private void createMainContent() {
        mainTabbedPane = new JTabbedPane();
        mainTabbedPane.setFont(SUBHEADER_FONT);
        mainTabbedPane.setBackground(BACKGROUND_COLOR);
        
        // Create tabs
        mainTabbedPane.addTab("🔍 Search & Book", createSearchTab());
        mainTabbedPane.addTab("🪑 Seat Selection", createSeatSelectionTab());
        mainTabbedPane.addTab("💳 Payment", createPaymentTab());
        mainTabbedPane.addTab("📋 My Bookings", createBookingsTab());
        mainTabbedPane.addTab("👑 Admin Panel", createAdminTab());
        mainTabbedPane.addTab("ℹ️ Help & Support", createHelpTab());
    }
    
    private JPanel createSearchTab() {
        JPanel mainPanel = new JPanel(new BorderLayout(20, 20));
        mainPanel.setBorder(new EmptyBorder(30, 30, 30, 30));
        mainPanel.setBackground(BACKGROUND_COLOR);
        
        // Search Panel
        searchPanel = createSearchPanel();
        mainPanel.add(searchPanel, BorderLayout.NORTH);
        
        // Results Panel
        resultsPanel = createResultsPanel();
        mainPanel.add(resultsPanel, BorderLayout.CENTER);
        
        return mainPanel;
    }
    
    private JPanel createSearchPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(CARD_COLOR);
        panel.setBorder(new CompoundBorder(
            new LineBorder(new Color(224, 224, 224), 1),
            new EmptyBorder(25, 25, 25, 25)
        ));
        
        // Title
        JLabel titleLabel = new JLabel("Search Buses");
        titleLabel.setFont(SUBHEADER_FONT);
        titleLabel.setForeground(TEXT_PRIMARY);
        panel.add(titleLabel, BorderLayout.NORTH);
        
        // Search form
        JPanel formPanel = new JPanel(new GridLayout(3, 4, 15, 15));
        formPanel.setBorder(new EmptyBorder(20, 0, 0, 0));
        
        // From location
        formPanel.add(createFormLabel("From"));
        fromComboBox = createModernComboBox(new String[]{
            "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Ahmedabad", "Kochi"
        });
        formPanel.add(fromComboBox);
        
        // To location
        formPanel.add(createFormLabel("To"));
        toComboBox = createModernComboBox(new String[]{
            "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Ahmedabad", "Kochi"
        });
        formPanel.add(toComboBox);
        
        // Date
        formPanel.add(createFormLabel("Date"));
        datePicker = new JDatePicker();
        formPanel.add(datePicker);
        
        // Bus Type
        formPanel.add(createFormLabel("Bus Type"));
        busTypeComboBox = createModernComboBox(new String[]{"All", "AC Sleeper", "AC Seater", "Non-AC Sleeper", "Non-AC Seater"});
        formPanel.add(busTypeComboBox);
        
        // Search button
        searchButton = createModernButton("🔍 Search Buses", PRIMARY_COLOR, Color.WHITE);
        searchButton.setFont(SUBHEADER_FONT);
        searchButton.setPreferredSize(new Dimension(200, 50));
        formPanel.add(searchButton);
        
        panel.add(formPanel, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createResultsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(CARD_COLOR);
        panel.setBorder(new CompoundBorder(
            new LineBorder(new Color(224, 224, 224), 1),
            new EmptyBorder(25, 25, 25, 25)
        ));
        
        JLabel titleLabel = new JLabel("Available Buses");
        titleLabel.setFont(SUBHEADER_FONT);
        titleLabel.setForeground(TEXT_PRIMARY);
        panel.add(titleLabel, BorderLayout.NORTH);
        
        // Bus results list
        DefaultListModel<BusResult> listModel = new DefaultListModel<>();
        busResultsList = new JList<>(listModel);
        busResultsList.setCellRenderer(new BusResultRenderer());
        busResultsList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        busResultsList.setFont(BODY_FONT);
        
        JScrollPane scrollPane = new JScrollPane(busResultsList);
        scrollPane.setPreferredSize(new Dimension(800, 400));
        scrollPane.setBorder(null);
        
        panel.add(scrollPane, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createSeatSelectionTab() {
        JPanel mainPanel = new JPanel(new BorderLayout(20, 20));
        mainPanel.setBorder(new EmptyBorder(30, 30, 30, 30));
        mainPanel.setBackground(BACKGROUND_COLOR);
        
        // Bus details
        JPanel busDetailsPanel = createBusDetailsPanel();
        mainPanel.add(busDetailsPanel, BorderLayout.NORTH);
        
        // Seat selection
        seatSelectionPanel = createSeatSelectionPanel();
        mainPanel.add(seatSelectionPanel, BorderLayout.CENTER);
        
        // Passenger details
        JPanel passengerPanel = createPassengerDetailsPanel();
        mainPanel.add(passengerPanel, BorderLayout.SOUTH);
        
        return mainPanel;
    }
    
    private JPanel createBusDetailsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(CARD_COLOR);
        panel.setBorder(new CompoundBorder(
            new LineBorder(new Color(224, 224, 224), 1),
            new EmptyBorder(20, 20, 20, 20)
        ));
        
        busDetailsLabel = new JLabel("Select a bus to view details");
        busDetailsLabel.setFont(SUBHEADER_FONT);
        busDetailsLabel.setForeground(TEXT_PRIMARY);
        panel.add(busDetailsLabel, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createSeatSelectionPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(CARD_COLOR);
        panel.setBorder(new CompoundBorder(
            new LineBorder(new Color(224, 224, 224), 1),
            new EmptyBorder(20, 20, 20, 20)
        ));
        
        JLabel titleLabel = new JLabel("Select Your Seats");
        titleLabel.setFont(SUBHEADER_FONT);
        titleLabel.setForeground(TEXT_PRIMARY);
        panel.add(titleLabel, BorderLayout.NORTH);
        
        // Seat map
        seatMapPanel = new JPanel(new GridBagLayout());
        seatMapPanel.setBackground(CARD_COLOR);
        seatMapPanel.setBorder(new EmptyBorder(20, 0, 0, 0));
        
        JScrollPane scrollPane = new JScrollPane(seatMapPanel);
        scrollPane.setPreferredSize(new Dimension(600, 300));
        scrollPane.setBorder(null);
        
        panel.add(scrollPane, BorderLayout.CENTER);
        
        // Selected seats info
        JPanel infoPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        infoPanel.setBackground(CARD_COLOR);
        
        selectedSeatsLabel = new JLabel("Selected Seats: None");
        selectedSeatsLabel.setFont(BODY_FONT);
        selectedSeatsLabel.setForeground(PRIMARY_COLOR);
        infoPanel.add(selectedSeatsLabel);
        
        panel.add(infoPanel, BorderLayout.SOUTH);
        
        return panel;
    }
    
    private JPanel createPassengerDetailsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(CARD_COLOR);
        panel.setBorder(new CompoundBorder(
            new LineBorder(new Color(224, 224, 224), 1),
            new EmptyBorder(20, 20, 20, 20)
        ));
        
        JLabel titleLabel = new JLabel("Passenger Details");
        titleLabel.setFont(SUBHEADER_FONT);
        titleLabel.setForeground(TEXT_PRIMARY);
        panel.add(titleLabel, BorderLayout.NORTH);
        
        // Form
        JPanel formPanel = new JPanel(new GridLayout(2, 4, 15, 15));
        formPanel.setBorder(new EmptyBorder(20, 0, 0, 0));
        
        formPanel.add(createFormLabel("Full Name"));
        passengerNameField = createModernTextField();
        formPanel.add(passengerNameField);
        
        formPanel.add(createFormLabel("Email"));
        passengerEmailField = createModernTextField();
        formPanel.add(passengerEmailField);
        
        formPanel.add(createFormLabel("Phone"));
        passengerPhoneField = createModernTextField();
        formPanel.add(passengerPhoneField);
        
        formPanel.add(createFormLabel("Age"));
        passengerAgeField = createModernTextField();
        formPanel.add(passengerAgeField);
        
        formPanel.add(createFormLabel("Gender"));
        genderComboBox = createModernComboBox(new String[]{"Male", "Female", "Other"});
        formPanel.add(genderComboBox);
        
        formPanel.add(createFormLabel("Seat Preference"));
        seatPreferenceComboBox = createModernComboBox(new String[]{"Window", "Aisle", "No Preference"});
        formPanel.add(seatPreferenceComboBox);
        
        // Price display
        JPanel pricePanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        pricePanel.setBackground(CARD_COLOR);
        
        JLabel priceTextLabel = new JLabel("Total Price:");
        priceTextLabel.setFont(BODY_FONT);
        priceTextLabel.setForeground(TEXT_SECONDARY);
        pricePanel.add(priceTextLabel);
        
        totalPriceLabel = new JLabel("₹0");
        totalPriceLabel.setFont(new Font("Segoe UI", Font.BOLD, 24));
        totalPriceLabel.setForeground(SUCCESS_COLOR);
        pricePanel.add(totalPriceLabel);
        
        formPanel.add(pricePanel);
        
        panel.add(formPanel, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createPaymentTab() {
        JPanel mainPanel = new JPanel(new BorderLayout(20, 20));
        mainPanel.setBorder(new EmptyBorder(30, 30, 30, 30));
        mainPanel.setBackground(BACKGROUND_COLOR);
        
        // Payment methods
        JPanel paymentPanel = new JPanel(new BorderLayout());
        paymentPanel.setBackground(CARD_COLOR);
        paymentPanel.setBorder(new CompoundBorder(
            new LineBorder(new Color(224, 224, 224), 1),
            new EmptyBorder(25, 25, 25, 25)
        ));
        
        JLabel titleLabel = new JLabel("Payment Options");
        titleLabel.setFont(SUBHEADER_FONT);
        titleLabel.setForeground(TEXT_PRIMARY);
        paymentPanel.add(titleLabel, BorderLayout.NORTH);
        
        // Payment methods
        JPanel methodsPanel = new JPanel(new GridLayout(2, 2, 20, 20));
        methodsPanel.setBorder(new EmptyBorder(20, 0, 0, 0));
        
        JButton cardButton = createPaymentMethodButton("💳 Credit/Debit Card", PRIMARY_COLOR);
        JButton upiButton = createPaymentMethodButton("📱 UPI Payment", SUCCESS_COLOR);
        JButton walletButton = createPaymentMethodButton("💰 Digital Wallet", WARNING_COLOR);
        JButton netBankingButton = createPaymentMethodButton("🏦 Net Banking", ACCENT_COLOR);
        
        methodsPanel.add(cardButton);
        methodsPanel.add(upiButton);
        methodsPanel.add(walletButton);
        methodsPanel.add(netBankingButton);
        
        paymentPanel.add(methodsPanel, BorderLayout.CENTER);
        
        // Payment button
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        buttonPanel.setBackground(CARD_COLOR);
        
        payButton = createModernButton("💳 Pay Now", SUCCESS_COLOR, Color.WHITE);
        payButton.setFont(SUBHEADER_FONT);
        payButton.setPreferredSize(new Dimension(200, 50));
        buttonPanel.add(payButton);
        
        paymentPanel.add(buttonPanel, BorderLayout.SOUTH);
        
        mainPanel.add(paymentPanel, BorderLayout.CENTER);
        
        return mainPanel;
    }
    
    private JPanel createBookingsTab() {
        JPanel mainPanel = new JPanel(new BorderLayout(20, 20));
        mainPanel.setBorder(new EmptyBorder(30, 30, 30, 30));
        mainPanel.setBackground(BACKGROUND_COLOR);
        
        // Title
        JLabel titleLabel = new JLabel("My Bookings");
        titleLabel.setFont(SUBHEADER_FONT);
        titleLabel.setForeground(TEXT_PRIMARY);
        mainPanel.add(titleLabel, BorderLayout.NORTH);
        
        // Bookings table
        String[] columnNames = {"Booking ID", "Bus", "Route", "Seats", "Passenger", "Date", "Status", "Price", "Actions"};
        DefaultTableModel model = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return column == 8; // Only actions column is editable
            }
        };
        
        bookingHistoryTable = new JTable(model);
        bookingHistoryTable.setFont(BODY_FONT);
        bookingHistoryTable.setRowHeight(40);
        bookingHistoryTable.getTableHeader().setFont(SUBHEADER_FONT);
        bookingHistoryTable.setBackground(CARD_COLOR);
        bookingHistoryTable.setGridColor(new Color(224, 224, 224));
        
        // Custom renderer for action buttons
        bookingHistoryTable.getColumn("Actions").setCellRenderer(new ButtonRenderer());
        bookingHistoryTable.getColumn("Actions").setCellEditor(new ButtonEditor(new JCheckBox()));
        
        JScrollPane scrollPane = new JScrollPane(bookingHistoryTable);
        scrollPane.setBorder(new LineBorder(new Color(224, 224, 224), 1));
        mainPanel.add(scrollPane, BorderLayout.CENTER);
        
        return mainPanel;
    }
    
    private JPanel createAdminTab() {
        JPanel mainPanel = new JPanel(new BorderLayout(20, 20));
        mainPanel.setBorder(new EmptyBorder(30, 30, 30, 30));
        mainPanel.setBackground(BACKGROUND_COLOR);
        
        // Title
        JLabel titleLabel = new JLabel("Admin Panel");
        titleLabel.setFont(SUBHEADER_FONT);
        titleLabel.setForeground(TEXT_PRIMARY);
        mainPanel.add(titleLabel, BorderLayout.NORTH);
        
        // Admin table
        String[] columnNames = {"Bus ID", "Name", "From", "To", "Price", "Departure", "Arrival", "Capacity", "Type", "Rating", "Status"};
        DefaultTableModel model = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return column == 10; // Only status is editable
            }
        };
        
        adminTable = new JTable(model);
        adminTable.setFont(BODY_FONT);
        adminTable.setRowHeight(35);
        adminTable.getTableHeader().setFont(SUBHEADER_FONT);
        adminTable.setBackground(CARD_COLOR);
        adminTable.setGridColor(new Color(224, 224, 224));
        
        // Populate admin table
        for (Bus bus : buses) {
            model.addRow(new Object[]{
                bus.getId(), bus.getName(), bus.getFrom(), bus.getTo(),
                "₹" + bus.getPrice(), bus.getDepartureTime(), bus.getArrivalTime(),
                bus.getCapacity(), bus.getType(), bus.getRating() + " ⭐", "Active"
            });
        }
        
        JScrollPane scrollPane = new JScrollPane(adminTable);
        scrollPane.setBorder(new LineBorder(new Color(224, 224, 224), 1));
        mainPanel.add(scrollPane, BorderLayout.CENTER);
        
        // Admin buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        buttonPanel.setBackground(BACKGROUND_COLOR);
        
        JButton addBusButton = createModernButton("➕ Add Bus", SUCCESS_COLOR, Color.WHITE);
        JButton editBusButton = createModernButton("✏️ Edit Bus", WARNING_COLOR, Color.WHITE);
        JButton deleteBusButton = createModernButton("🗑️ Delete Bus", ERROR_COLOR, Color.WHITE);
        JButton reportsButton = createModernButton("📊 Reports", PRIMARY_COLOR, Color.WHITE);
        
        buttonPanel.add(addBusButton);
        buttonPanel.add(editBusButton);
        buttonPanel.add(deleteBusButton);
        buttonPanel.add(reportsButton);
        
        mainPanel.add(buttonPanel, BorderLayout.SOUTH);
        
        return mainPanel;
    }
    
    private JPanel createHelpTab() {
        JPanel mainPanel = new JPanel(new BorderLayout(20, 20));
        mainPanel.setBorder(new EmptyBorder(30, 30, 30, 30));
        mainPanel.setBackground(BACKGROUND_COLOR);
        
        JTextArea helpText = new JTextArea();
        helpText.setFont(BODY_FONT);
        helpText.setEditable(false);
        helpText.setBackground(CARD_COLOR);
        helpText.setBorder(new EmptyBorder(20, 20, 20, 20));
        helpText.setText(getHelpText());
        
        JScrollPane scrollPane = new JScrollPane(helpText);
        scrollPane.setBorder(new LineBorder(new Color(224, 224, 224), 1));
        mainPanel.add(scrollPane, BorderLayout.CENTER);
        
        return mainPanel;
    }
    
    // Helper methods for creating modern UI components
    private JLabel createFormLabel(String text) {
        JLabel label = new JLabel(text);
        label.setFont(BODY_FONT);
        label.setForeground(TEXT_PRIMARY);
        return label;
    }
    
    private JComboBox<String> createModernComboBox(String[] items) {
        JComboBox<String> comboBox = new JComboBox<>(items);
        comboBox.setFont(BODY_FONT);
        comboBox.setBackground(CARD_COLOR);
        comboBox.setBorder(new LineBorder(new Color(224, 224, 224), 1));
        comboBox.setPreferredSize(new Dimension(150, 35));
        return comboBox;
    }
    
    private JTextField createModernTextField() {
        JTextField textField = new JTextField();
        textField.setFont(BODY_FONT);
        textField.setBackground(CARD_COLOR);
        textField.setBorder(new LineBorder(new Color(224, 224, 224), 1));
        textField.setPreferredSize(new Dimension(150, 35));
        return textField;
    }
    
    private JButton createModernButton(String text, Color backgroundColor, Color textColor) {
        JButton button = new JButton(text);
        button.setFont(BODY_FONT);
        button.setBackground(backgroundColor);
        button.setForeground(textColor);
        button.setFocusPainted(false);
        button.setBorderPainted(false);
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));
        button.setPreferredSize(new Dimension(120, 40));
        
        // Add hover effect
        button.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                button.setBackground(backgroundColor.darker());
            }
            
            @Override
            public void mouseExited(MouseEvent e) {
                button.setBackground(backgroundColor);
            }
        });
        
        return button;
    }
    
    private JButton createPaymentMethodButton(String text, Color backgroundColor) {
        JButton button = new JButton(text);
        button.setFont(SUBHEADER_FONT);
        button.setBackground(backgroundColor);
        button.setForeground(Color.WHITE);
        button.setFocusPainted(false);
        button.setBorderPainted(false);
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));
        button.setPreferredSize(new Dimension(200, 80));
        
        // Add hover effect
        button.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                button.setBackground(backgroundColor.darker());
            }
            
            @Override
            public void mouseExited(MouseEvent e) {
                button.setBackground(backgroundColor);
            }
        });
        
        return button;
    }
    
    private void setupEventHandlers() {
        // Search button
        searchButton.addActionListener(e -> performSearch());
        
        // Bus selection
        busResultsList.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                BusResult selectedResult = busResultsList.getSelectedValue();
                if (selectedResult != null) {
                    selectedBus = selectedResult.getBus();
                    updateBusDetails();
                    updateSeatMap();
                    mainTabbedPane.setSelectedIndex(1); // Switch to seat selection tab
                }
            }
        });
        
        // Payment button
        payButton.addActionListener(e -> processPayment());
        
        // Seat selection (will be handled in updateSeatMap)
    }
    
    private void performSearch() {
        String from = (String) fromComboBox.getSelectedItem();
        String to = (String) toComboBox.getSelectedItem();
        String busType = (String) busTypeComboBox.getSelectedItem();
        
        DefaultListModel<BusResult> model = (DefaultListModel<BusResult>) busResultsList.getModel();
        model.clear();
        
        for (Bus bus : buses) {
            if (bus.getFrom().equals(from) && bus.getTo().equals(to)) {
                if (busType.equals("All") || bus.getType().equals(busType)) {
                    model.addElement(new BusResult(bus));
                }
            }
        }
        
        if (model.isEmpty()) {
            JOptionPane.showMessageDialog(this, "No buses found for the selected route and criteria.", "No Results", JOptionPane.INFORMATION_MESSAGE);
        }
    }
    
    private void updateBusDetails() {
        if (selectedBus != null) {
            String details = String.format(
                "<html><div style='padding: 10px;'>" +
                "<h3>%s (%s)</h3>" +
                "<p><strong>Route:</strong> %s → %s</p>" +
                "<p><strong>Departure:</strong> %s | <strong>Arrival:</strong> %s</p>" +
                "<p><strong>Type:</strong> %s | <strong>Operator:</strong> %s</p>" +
                "<p><strong>Rating:</strong> %.1f ⭐ | <strong>Price:</strong> ₹%.0f</p>" +
                "</div></html>",
                selectedBus.getName(), selectedBus.getId(),
                selectedBus.getFrom(), selectedBus.getTo(),
                selectedBus.getDepartureTime(), selectedBus.getArrivalTime(),
                selectedBus.getType(), selectedBus.getOperator(),
                selectedBus.getRating(), selectedBus.getPrice()
            );
            busDetailsLabel.setText(details);
        }
    }
    
    private void updateSeatMap() {
        seatMapPanel.removeAll();
        seatButtons.clear();
        
        if (selectedBus == null) {
            JLabel noBusLabel = new JLabel("Please select a bus first");
            noBusLabel.setFont(SUBHEADER_FONT);
            noBusLabel.setForeground(TEXT_SECONDARY);
            seatMapPanel.add(noBusLabel);
            return;
        }
        
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(2, 2, 2, 2);
        
        // Driver section
        JLabel driverLabel = new JLabel("🚌 Driver");
        driverLabel.setFont(BODY_FONT);
        driverLabel.setForeground(TEXT_SECONDARY);
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 4;
        seatMapPanel.add(driverLabel, gbc);
        
        // Seat buttons
        for (int row = 1; row <= 12; row++) {
            for (int col = 0; col < 4; col++) {
                String seatNumber = row + String.valueOf((char)('A' + col));
                String seatKey = selectedBus.getId() + "_" + seatNumber;
                boolean isAvailable = seatAvailability.getOrDefault(seatKey, true);
                
                JButton seatButton = new JButton(seatNumber);
                seatButton.setFont(SMALL_FONT);
                seatButton.setPreferredSize(new Dimension(50, 30));
                seatButton.setFocusPainted(false);
                
                if (selectedSeats.contains(seatNumber)) {
                    seatButton.setBackground(SUCCESS_COLOR);
                    seatButton.setForeground(Color.WHITE);
                } else if (!isAvailable) {
                    seatButton.setBackground(ERROR_COLOR);
                    seatButton.setForeground(Color.WHITE);
                    seatButton.setEnabled(false);
                } else {
                    seatButton.setBackground(CARD_COLOR);
                    seatButton.setForeground(TEXT_PRIMARY);
                    seatButton.setBorder(new LineBorder(new Color(224, 224, 224), 1));
                }
                
                seatButton.addActionListener(e -> toggleSeatSelection(seatNumber));
                seatButtons.put(seatNumber, seatButton);
                
                gbc.gridx = col;
                gbc.gridy = row;
                gbc.gridwidth = 1;
                seatMapPanel.add(seatButton, gbc);
            }
        }
        
        seatMapPanel.revalidate();
        seatMapPanel.repaint();
    }
    
    private void toggleSeatSelection(String seatNumber) {
        if (selectedSeats.contains(seatNumber)) {
            selectedSeats.remove(seatNumber);
        } else {
            selectedSeats.add(seatNumber);
        }
        
        updateSeatMap();
        updateSelectedSeatsDisplay();
        updatePriceDisplay();
    }
    
    private void updateSelectedSeatsDisplay() {
        if (selectedSeats.isEmpty()) {
            selectedSeatsLabel.setText("Selected Seats: None");
        } else {
            selectedSeatsLabel.setText("Selected Seats: " + String.join(", ", selectedSeats));
        }
    }
    
    private void updatePriceDisplay() {
        if (selectedBus != null) {
            totalPrice = selectedBus.getPrice() * selectedSeats.size();
            totalPriceLabel.setText("₹" + String.format("%.0f", totalPrice));
        }
    }
    
    private void processPayment() {
        if (selectedSeats.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please select at least one seat.", "No Seats Selected", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        String name = passengerNameField.getText().trim();
        String email = passengerEmailField.getText().trim();
        String phone = passengerPhoneField.getText().trim();
        
        if (name.isEmpty() || email.isEmpty() || phone.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill in all passenger details.", "Missing Information", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        // Simulate payment processing
        JProgressBar progressBar = new JProgressBar(0, 100);
        progressBar.setStringPainted(true);
        progressBar.setString("Processing Payment...");
        
        JDialog progressDialog = new JDialog(this, "Payment Processing", true);
        progressDialog.setLayout(new BorderLayout());
        progressDialog.add(progressBar, BorderLayout.CENTER);
        progressDialog.setSize(300, 100);
        progressDialog.setLocationRelativeTo(this);
        
        // Simulate payment processing
        javax.swing.Timer timer = new javax.swing.Timer(100, e -> {
            int value = progressBar.getValue();
            if (value < 100) {
                progressBar.setValue(value + 10);
            } else {
                progressDialog.dispose();
                
                // Create booking
                String bookingId = "BK" + System.currentTimeMillis();
                Booking booking = new Booking(bookingId, selectedBus.getId(), name, email, phone,
                    new ArrayList<>(selectedSeats), totalPrice, new Date());
                bookings.add(booking);
                
                // Mark seats as occupied
                for (String seat : selectedSeats) {
                    String seatKey = selectedBus.getId() + "_" + seat;
                    seatAvailability.put(seatKey, false);
                }
                
                JOptionPane.showMessageDialog(this,
                    "Payment successful!\nBooking ID: " + bookingId + "\nPlease save this ID for future reference.",
                    "Booking Confirmed", JOptionPane.INFORMATION_MESSAGE);
                
                // Clear form and switch to bookings tab
                clearForm();
                mainTabbedPane.setSelectedIndex(3);
                refreshBookingHistory();
            }
        });
        timer.start();
        
        progressDialog.setVisible(true);
    }
    
    private void clearForm() {
        passengerNameField.setText("");
        passengerEmailField.setText("");
        passengerPhoneField.setText("");
        passengerAgeField.setText("");
        selectedSeats.clear();
        selectedBus = null;
        totalPrice = 0.0;
        totalPriceLabel.setText("₹0");
        selectedSeatsLabel.setText("Selected Seats: None");
    }
    
    private void refreshBookingHistory() {
        DefaultTableModel model = (DefaultTableModel) bookingHistoryTable.getModel();
        model.setRowCount(0);
        
        for (Booking booking : bookings) {
            Bus bus = buses.stream().filter(b -> b.getId().equals(booking.getBusId())).findFirst().orElse(null);
            if (bus != null) {
                model.addRow(new Object[]{
                    booking.getId(),
                    bus.getName(),
                    bus.getFrom() + " → " + bus.getTo(),
                    String.join(", ", booking.getSeats()),
                    booking.getPassengerName(),
                    new SimpleDateFormat("yyyy-MM-dd").format(booking.getBookingDate()),
                    "Confirmed",
                    "₹" + String.format("%.0f", booking.getTotalPrice()),
                    "Cancel"
                });
            }
        }
    }
    
    private void startRealTimeUpdates() {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> {
            SwingUtilities.invokeLater(() -> {
                // Update seat availability randomly (simulate real-time updates)
                for (Bus bus : buses) {
                    for (int row = 1; row <= 12; row++) {
                        for (int col = 0; col < 4; col++) {
                            String seatNumber = row + String.valueOf((char)('A' + col));
                            String seatKey = bus.getId() + "_" + seatNumber;
                            if (Math.random() < 0.1) { // 10% chance of change
                                seatAvailability.put(seatKey, Math.random() > 0.3);
                            }
                        }
                    }
                }
                
                // Refresh seat map if currently viewing
                if (selectedBus != null && mainTabbedPane.getSelectedIndex() == 1) {
                    updateSeatMap();
                }
            });
        }, 5, 5, TimeUnit.SECONDS);
    }
    
    private String getHelpText() {
        return "SmartBus2+ Professional Booking System - Help Guide\n\n" +
               "🔍 SEARCH & BOOK TAB:\n" +
               "• Select your departure and destination cities\n" +
               "• Choose your travel date using the date picker\n" +
               "• Filter by bus type (AC Sleeper, AC Seater, etc.)\n" +
               "• Click 'Search Buses' to find available options\n" +
               "• View detailed bus information including ratings\n" +
               "• Select a bus to proceed to seat selection\n\n" +
               "🪑 SEAT SELECTION TAB:\n" +
               "• View interactive seat map for selected bus\n" +
               "• Click on available seats to select them\n" +
               "• Selected seats are highlighted in green\n" +
               "• Occupied seats are shown in red and disabled\n" +
               "• Fill in passenger details (name, email, phone, age, gender)\n" +
               "• Choose seat preference (window, aisle, no preference)\n" +
               "• View total price calculation\n\n" +
               "💳 PAYMENT TAB:\n" +
               "• Choose from multiple payment methods:\n" +
               "  - Credit/Debit Card\n" +
               "  - UPI Payment\n" +
               "  - Digital Wallet\n" +
               "  - Net Banking\n" +
               "• Click 'Pay Now' to process payment\n" +
               "• Payment processing is simulated with progress bar\n\n" +
               "📋 MY BOOKINGS TAB:\n" +
               "• View all your booking history\n" +
               "• See booking details including seats and prices\n" +
               "• Cancel bookings if needed\n" +
               "• Print tickets for your journeys\n\n" +
               "👑 ADMIN PANEL TAB:\n" +
               "• Manage bus routes and schedules\n" +
               "• Add, edit, or delete buses\n" +
               "• View system reports and analytics\n" +
               "• Monitor booking statistics\n\n" +
               "✨ FEATURES:\n" +
               "• Real-time seat availability updates\n" +
               "• Modern Material Design UI\n" +
               "• Responsive layout\n" +
               "• Professional booking workflow\n" +
               "• Comprehensive admin panel\n" +
               "• Multi-payment options\n" +
               "• Booking history management\n\n" +
               "📞 SUPPORT:\n" +
               "• Email: support@smartbus2plus.com\n" +
               "• Phone: +91-800-123-4567\n" +
               "• Website: www.smartbus2plus.com\n\n" +
               "Version: 2.0 Professional\n" +
               "Last Updated: " + new SimpleDateFormat("yyyy-MM-dd").format(new Date());
    }
    
    // Inner classes for data models and renderers
    private static class Bus {
        private String id, name, from, to, departureTime, arrivalTime, type, operator;
        private double price, rating;
        private int capacity;
        
        public Bus(String id, String name, String from, String to, double price, String departureTime, String arrivalTime, int capacity, String type, String operator, double rating) {
            this.id = id;
            this.name = name;
            this.from = from;
            this.to = to;
            this.price = price;
            this.departureTime = departureTime;
            this.arrivalTime = arrivalTime;
            this.capacity = capacity;
            this.type = type;
            this.operator = operator;
            this.rating = rating;
        }
        
        // Getters
        public String getId() { return id; }
        public String getName() { return name; }
        public String getFrom() { return from; }
        public String getTo() { return to; }
        public double getPrice() { return price; }
        public String getDepartureTime() { return departureTime; }
        public String getArrivalTime() { return arrivalTime; }
        public int getCapacity() { return capacity; }
        public String getType() { return type; }
        public String getOperator() { return operator; }
        public double getRating() { return rating; }
    }
    
    private static class BusResult {
        private Bus bus;
        
        public BusResult(Bus bus) {
            this.bus = bus;
        }
        
        public Bus getBus() { return bus; }
        
        @Override
        public String toString() {
            return String.format("%s (%s) - ₹%.0f - %s-%s - %.1f⭐", 
                bus.getName(), bus.getId(), bus.getPrice(), bus.getDepartureTime(), bus.getArrivalTime(), bus.getRating());
        }
    }
    
    private static class Booking {
        private String id, busId, passengerName, passengerEmail, passengerPhone;
        private List<String> seats;
        private double totalPrice;
        private Date bookingDate;
        
        public Booking(String id, String busId, String passengerName, String passengerEmail, String passengerPhone, List<String> seats, double totalPrice, Date bookingDate) {
            this.id = id;
            this.busId = busId;
            this.passengerName = passengerName;
            this.passengerEmail = passengerEmail;
            this.passengerPhone = passengerPhone;
            this.seats = seats;
            this.totalPrice = totalPrice;
            this.bookingDate = bookingDate;
        }
        
        // Getters
        public String getId() { return id; }
        public String getBusId() { return busId; }
        public String getPassengerName() { return passengerName; }
        public String getPassengerEmail() { return passengerEmail; }
        public String getPassengerPhone() { return passengerPhone; }
        public List<String> getSeats() { return seats; }
        public double getTotalPrice() { return totalPrice; }
        public Date getBookingDate() { return bookingDate; }
    }
    
    private static class BusResultRenderer extends DefaultListCellRenderer {
        @Override
        public Component getListCellRendererComponent(JList<?> list, Object value, int index, boolean isSelected, boolean cellHasFocus) {
            super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
            
            if (isSelected) {
                setBackground(new Color(25, 118, 210));
                setForeground(Color.WHITE);
            } else {
                setBackground(Color.WHITE);
                setForeground(Color.BLACK);
            }
            
            return this;
        }
    }
    
    private static class ButtonRenderer extends JButton implements TableCellRenderer {
        public ButtonRenderer() {
            setOpaque(true);
        }
        
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
            setText("Cancel");
            setBackground(new Color(244, 67, 54));
            setForeground(Color.WHITE);
            return this;
        }
    }
    
    private static class ButtonEditor extends DefaultCellEditor {
        protected JButton button;
        private String label;
        private boolean isPushed;
        private JTable table;
        private int row;
        
        public ButtonEditor(JCheckBox checkBox) {
            super(checkBox);
            button = new JButton();
            button.setOpaque(true);
            button.addActionListener(e -> fireEditingStopped());
        }
        
        @Override
        public Component getTableCellEditorComponent(JTable table, Object value, boolean isSelected, int row, int column) {
            this.table = table;
            this.row = row;
            
            button.setText("Cancel");
            button.setBackground(new Color(244, 67, 54));
            button.setForeground(Color.WHITE);
            
            isPushed = true;
            return button;
        }
        
        @Override
        public Object getCellEditorValue() {
            if (isPushed) {
                // Handle cancel booking logic here
                JOptionPane.showMessageDialog(button, "Booking cancellation feature will be implemented.");
            }
            isPushed = false;
            return "Cancel";
        }
        
        @Override
        public boolean stopCellEditing() {
            isPushed = false;
            return super.stopCellEditing();
        }
    }
    
    // Simple Date Picker implementation
    private static class JDatePicker extends JPanel {
        private JTextField dateField;
        private JButton calendarButton;
        
        public JDatePicker() {
            setLayout(new BorderLayout());
            
            dateField = new JTextField();
            dateField.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            dateField.setBackground(Color.WHITE);
            dateField.setBorder(new LineBorder(new Color(224, 224, 224), 1));
            dateField.setPreferredSize(new Dimension(150, 35));
            dateField.setText(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
            
            calendarButton = new JButton("📅");
            calendarButton.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            calendarButton.setBackground(new Color(25, 118, 210));
            calendarButton.setForeground(Color.WHITE);
            calendarButton.setFocusPainted(false);
            calendarButton.setBorderPainted(false);
            calendarButton.setPreferredSize(new Dimension(35, 35));
            
            add(dateField, BorderLayout.CENTER);
            add(calendarButton, BorderLayout.EAST);
        }
        
        public String getText() {
            return dateField.getText();
        }
    }
    
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new SmartBusBookingGUI().setVisible(true);
        });
    }
}
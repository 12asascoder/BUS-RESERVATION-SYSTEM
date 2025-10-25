import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;

public class SmartBusBookingGUI extends JFrame {
    private JPanel mainPanel;
    private JComboBox<String> fromComboBox;
    private JComboBox<String> toComboBox;
    private JTextField dateField;
    private JList<String> busList;
    private JTextArea seatMapArea;
    private JTextField passengerNameField;
    private JTextField passengerEmailField;
    private JTextField passengerPhoneField;
    private JLabel totalPriceLabel;
    private List<String> selectedSeats = new ArrayList<>();
    
    public SmartBusBookingGUI() {
        initializeGUI();
        setupEventHandlers();
    }
    
    private void initializeGUI() {
        setTitle("SmartBus2+ - Booking System");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1000, 700);
        setLocationRelativeTo(null);
        
        mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(new EmptyBorder(20, 20, 20, 20));
        
        // Header
        JPanel headerPanel = new JPanel();
        headerPanel.setBackground(new Color(59, 130, 246));
        JLabel titleLabel = new JLabel("SmartBus2+ Booking System", JLabel.CENTER);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
        titleLabel.setForeground(Color.WHITE);
        headerPanel.add(titleLabel);
        
        // Main content panel
        JPanel contentPanel = new JPanel(new GridLayout(1, 2, 10, 0));
        
        // Left panel - Search and Bus Selection
        JPanel leftPanel = createLeftPanel();
        
        // Right panel - Seat Selection and Booking
        JPanel rightPanel = createRightPanel();
        
        contentPanel.add(leftPanel);
        contentPanel.add(rightPanel);
        
        mainPanel.add(headerPanel, BorderLayout.NORTH);
        mainPanel.add(contentPanel, BorderLayout.CENTER);
        
        add(mainPanel);
    }
    
    private JPanel createLeftPanel() {
        JPanel panel = new JPanel(new BorderLayout(5, 5));
        panel.setBorder(BorderFactory.createTitledBorder("Search & Select Bus"));
        
        // Search section
        JPanel searchPanel = new JPanel(new GridLayout(3, 2, 5, 5));
        
        searchPanel.add(new JLabel("From:"));
        fromComboBox = new JComboBox<>(new String[]{
            "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur"
        });
        searchPanel.add(fromComboBox);
        
        searchPanel.add(new JLabel("To:"));
        toComboBox = new JComboBox<>(new String[]{
            "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur"
        });
        searchPanel.add(toComboBox);
        
        searchPanel.add(new JLabel("Date:"));
        dateField = new JTextField("2024-01-20");
        searchPanel.add(dateField);
        
        JButton searchButton = new JButton("Search Buses");
        searchButton.setBackground(new Color(34, 197, 94));
        searchButton.setForeground(Color.WHITE);
        searchButton.setFont(new Font("Arial", Font.BOLD, 14));
        searchPanel.add(searchButton);
        
        panel.add(searchPanel, BorderLayout.NORTH);
        
        // Bus list
        JPanel busListPanel = new JPanel(new BorderLayout());
        busListPanel.add(new JLabel("Available Buses:"), BorderLayout.NORTH);
        
        String[] buses = {
            "SmartBus Pro (SB-001) - ₹3000 - 08:00-20:00",
            "SmartBus Elite (SB-002) - ₹3750 - 14:00-02:00",
            "SmartBus Express (SB-003) - ₹2400 - 09:00-15:00",
            "SmartBus Premium (SB-004) - ₹2160 - 07:00-12:00",
            "SmartBus Standard (SB-005) - ₹2000 - 10:00-22:00"
        };
        
        busList = new JList<>(buses);
        busList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        busList.setFont(new Font("Monospaced", Font.PLAIN, 12));
        
        JScrollPane busScrollPane = new JScrollPane(busList);
        busScrollPane.setPreferredSize(new Dimension(400, 200));
        
        busListPanel.add(busScrollPane, BorderLayout.CENTER);
        panel.add(busListPanel, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createRightPanel() {
        JPanel panel = new JPanel(new BorderLayout(5, 5));
        panel.setBorder(BorderFactory.createTitledBorder("Seat Selection & Booking"));
        
        // Seat map
        JPanel seatMapPanel = new JPanel(new BorderLayout());
        seatMapPanel.add(new JLabel("Seat Map:"), BorderLayout.NORTH);
        
        seatMapArea = new JTextArea();
        seatMapArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        seatMapArea.setEditable(false);
        seatMapArea.setText(generateSeatMap());
        
        JScrollPane seatScrollPane = new JScrollPane(seatMapArea);
        seatScrollPane.setPreferredSize(new Dimension(400, 150));
        
        seatMapPanel.add(seatScrollPane, BorderLayout.CENTER);
        
        // Passenger details
        JPanel passengerPanel = new JPanel(new GridLayout(3, 2, 5, 5));
        passengerPanel.setBorder(BorderFactory.createTitledBorder("Passenger Details"));
        
        passengerPanel.add(new JLabel("Name:"));
        passengerNameField = new JTextField();
        passengerPanel.add(passengerNameField);
        
        passengerPanel.add(new JLabel("Email:"));
        passengerEmailField = new JTextField();
        passengerPanel.add(passengerEmailField);
        
        passengerPanel.add(new JLabel("Phone:"));
        passengerPhoneField = new JTextField();
        passengerPanel.add(passengerPhoneField);
        
        // Booking section
        JPanel bookingPanel = new JPanel(new BorderLayout());
        
        JPanel pricePanel = new JPanel(new FlowLayout());
        pricePanel.add(new JLabel("Total Price:"));
        totalPriceLabel = new JLabel("₹0");
        totalPriceLabel.setFont(new Font("Arial", Font.BOLD, 16));
        totalPriceLabel.setForeground(new Color(34, 197, 94));
        pricePanel.add(totalPriceLabel);
        
        JButton bookButton = new JButton("Book Now");
        bookButton.setBackground(new Color(239, 68, 68));
        bookButton.setForeground(Color.WHITE);
        bookButton.setFont(new Font("Arial", Font.BOLD, 14));
        bookButton.setPreferredSize(new Dimension(120, 40));
        
        bookingPanel.add(pricePanel, BorderLayout.NORTH);
        bookingPanel.add(bookButton, BorderLayout.SOUTH);
        
        panel.add(seatMapPanel, BorderLayout.NORTH);
        panel.add(passengerPanel, BorderLayout.CENTER);
        panel.add(bookingPanel, BorderLayout.SOUTH);
        
        return panel;
    }
    
    private String generateSeatMap() {
        StringBuilder seatMap = new StringBuilder();
        seatMap.append("    Driver\n");
        seatMap.append("┌─────────────────┐\n");
        
        for (int row = 1; row <= 12; row++) {
            seatMap.append("│ ");
            for (int col = 0; col < 4; col++) {
                String seatNumber = row + String.valueOf((char)('A' + col));
                if (Math.random() > 0.7) {
                    seatMap.append("[X] "); // Occupied
                } else {
                    seatMap.append("[").append(seatNumber).append("] ");
                }
            }
            seatMap.append("│\n");
        }
        
        seatMap.append("└─────────────────┘\n");
        seatMap.append("\nLegend: [X] = Occupied, [1A] = Available\n");
        seatMap.append("Click on seat numbers to select/deselect");
        
        return seatMap.toString();
    }
    
    private void setupEventHandlers() {
        // Search button
        JButton searchButton = (JButton) ((JPanel) ((JPanel) mainPanel.getComponent(1)).getComponent(0)).getComponent(0).getComponent(5);
        searchButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String from = (String) fromComboBox.getSelectedItem();
                String to = (String) toComboBox.getSelectedItem();
                String date = dateField.getText();
                
                JOptionPane.showMessageDialog(SmartBusBookingGUI.this,
                    "Searching buses from " + from + " to " + to + " on " + date,
                    "Search Results", JOptionPane.INFORMATION_MESSAGE);
            }
        });
        
        // Book button
        JButton bookButton = (JButton) ((JPanel) ((JPanel) mainPanel.getComponent(1)).getComponent(1)).getComponent(2);
        bookButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String name = passengerNameField.getText();
                String email = passengerEmailField.getText();
                String phone = passengerPhoneField.getText();
                
                if (name.isEmpty() || email.isEmpty() || phone.isEmpty()) {
                    JOptionPane.showMessageDialog(SmartBusBookingGUI.this,
                        "Please fill in all passenger details",
                        "Missing Information", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                
                if (selectedSeats.isEmpty()) {
                    JOptionPane.showMessageDialog(SmartBusBookingGUI.this,
                        "Please select at least one seat",
                        "No Seats Selected", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                
                int result = JOptionPane.showConfirmDialog(SmartBusBookingGUI.this,
                    "Confirm booking for " + name + "?\nSeats: " + selectedSeats + "\nTotal: " + totalPriceLabel.getText(),
                    "Confirm Booking", JOptionPane.YES_NO_OPTION);
                
                if (result == JOptionPane.YES_OPTION) {
                    JOptionPane.showMessageDialog(SmartBusBookingGUI.this,
                        "Booking confirmed! Booking ID: BK" + System.currentTimeMillis(),
                        "Booking Successful", JOptionPane.INFORMATION_MESSAGE);
                    
                    // Reset form
                    passengerNameField.setText("");
                    passengerEmailField.setText("");
                    passengerPhoneField.setText("");
                    selectedSeats.clear();
                    totalPriceLabel.setText("₹0");
                }
            }
        });
    }
    
    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                try {
                    UIManager.setLookAndFeel(UIManager.getSystemLookAndFeel());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                
                new SmartBusBookingGUI().setVisible(true);
            }
        });
    }
}

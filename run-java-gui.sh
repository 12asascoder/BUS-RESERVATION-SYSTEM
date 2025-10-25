#!/bin/bash

# SmartBus2+ Java Booking GUI Launcher
echo "Starting SmartBus2+ Java Booking GUI..."

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed or not in PATH"
    echo "Please install Java JDK 8 or higher"
    exit 1
fi

# Compile the Java file
echo "Compiling Java application..."
javac java-gui/SmartBusBookingGUI.java

if [ $? -eq 0 ]; then
    echo "Compilation successful!"
    echo "Launching Java Booking GUI..."
    java -cp java-gui SmartBusBookingGUI
else
    echo "Compilation failed!"
    exit 1
fi

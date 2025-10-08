# MediCube 💊  
*An IoT-Based Medicine Monitoring and Delivery System using Arduino R4 WiFi*  
*by Amishi Sharma – 2025*

---

## Demo & Prototype  

<p align="center">
  <img src="assets/medicube-demo.gif" width="400" alt="MediCube Prototype Demo">
</p>

> 🎞️ *Preview the MediCube system in action – real-time sensor monitoring, Firebase logging, and automated pump control.*

---

## Overview  

**MediCube** is a smart IoT-based prototype designed to monitor medicine storage conditions and automate the delivery of medicinal or infused water to plants.  
Built on the **Arduino Uno R4 WiFi**, the system integrates environmental sensors, MQTT networking, and a **React Native mobile app** that visualises live data stored in **Firebase Realtime Database**.  

This project bridges healthcare and environmental sustainability, addressing how environmental instability can affect both **pharmaceutical potency** and **plant-based medicine efficacy**.

---

## Motivation  

MediCube was inspired by a growing challenge — the loss of medicinal efficacy under uncontrolled conditions.  
Liquid or herbal formulations deteriorate when stored outside ideal temperature or humidity ranges, and medicinal plants often suffer from irregular watering.  

MediCube combines both concerns by providing:
- Continuous **temperature and humidity monitoring** for safe storage, and  
- Automated **infused-water delivery** when soil moisture levels drop.  

Through the **ThanniWorks initiative**, MediCube explores how embedded systems can enhance both **human health and environmental care**.

---

## Problem Statement  

Conventional home medicine storage lacks **real-time feedback** on environmental conditions.  
Similarly, **manual plant watering** is error-prone and inconsistent.  
This creates two risks:
1. Degraded or spoiled medicine used unknowingly by patients.  
2. Medicinal plants receiving improper hydration and losing efficacy.  

MediCube bridges this gap by integrating:
- **Environmental sensors (DHT11, moisture probe)** for monitoring.  
- **Automated actuation (LED and pump)** for alert and correction.  
- **Cloud logging (Firebase)** for visibility and record-keeping.  
- **Mobile visualisation (React Native)** for intuitive tracking.  

---

## System Architecture  

### Components  

**Hardware**  
- Arduino UNO R4 WiFi  
- DHT11 Temperature & Humidity Sensor  
- Soil Moisture Sensor  
- IRF520 MOSFET Module (Pump Driver)  
- Built-in LED (Alert System)  
- USB / Battery Power Supply  

**Software**  
- Arduino IDE (C++ firmware)  
- MQTT (via HiveMQ Broker)  
- Firebase Realtime Database  
- React Native (Expo) Mobile App  
- MQTT.js for client communication  
- Firebase Admin SDK  

---

### System Flow  

```mermaid
graph TD
A[Arduino Sensors<br>DHT11 + Moisture Probe] -->|MQTT| B[HiveMQ Broker]
B -->|Data Stream| C[React Native App]
A -->|HTTP POST| D[Firebase Realtime DB]
C -->|Read/Write| D
D -->|Historical Logs| E[Charts & Alerts]

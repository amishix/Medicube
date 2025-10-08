// secrets.h – Configuration file (safe for sharing)

// WiFi credentials
#define WIFI_SSID     "YourWiFiNetworkName"
#define WIFI_PASSWORD "YourWiFiPassword"

// Firebase Realtime Database settings
#define REFERENCE_URL "your-database.firebaseio.com"
#define AUTH_TOKEN    "your-firebase-auth-token"

// MQTT broker settings
#define MQTT_BROKER   "192.168.1.X"   // Replace with your MQTT broker IP
#define MQTT_PORT     1883
#define MQTT_USER     ""              // Optional: add username if secured
#define MQTT_PASS     ""              // Optional: add password if secured
#define MQTT_TOPIC    "smartplant/data"
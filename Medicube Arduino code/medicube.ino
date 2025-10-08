#include <WiFiS3.h>
#include <Firebase.h>
#include <PubSubClient.h>
#include <DHT.h>
#include "secrets.h"

// Firebase
Firebase fb(REFERENCE_URL, AUTH_TOKEN);

// MQTT
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

// DHT sensor
#define DHTPIN 11
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Pins
#define MOISTURE_PIN A1
#define MEDICINE_PUMP_PIN 6
#define LED_BUILTIN_PIN LED_BUILTIN

// State
float temperature = 0;
float humidity = 0;
int medicineDelivered = 0;
unsigned long lastPumpTime = 0;
bool pumpCooldown = false;

void connectToWiFi() {
  Serial.print("🌐 Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("✅ WiFi connected!");
    Serial.print("📡 IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("❌ Failed to connect to WiFi.");
  }
}

void connectToMQTT() {
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  if (!mqttClient.connected()) {
    Serial.print("🔌 Connecting to MQTT...");
    if (mqttClient.connect("MediCubeClient", MQTT_USER, MQTT_PASS)) {
      Serial.println("✅ MQTT connected!");
    } else {
      Serial.print("❌ MQTT Failed. Code: ");
      Serial.println(mqttClient.state());
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(MOISTURE_PIN, INPUT);
  pinMode(MEDICINE_PUMP_PIN, OUTPUT);
  pinMode(LED_BUILTIN_PIN, OUTPUT);
  digitalWrite(MEDICINE_PUMP_PIN, LOW);
  digitalWrite(LED_BUILTIN_PIN, LOW);
  dht.begin();

  connectToWiFi();
  connectToMQTT();
  fb.setString("DeviceStatus", "MediCube Monitoring Active");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectToWiFi();
  connectToMQTT();
  mqttClient.loop();

  // Read sensors
  int moisture = analogRead(MOISTURE_PIN);
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  String mood = (moisture < 400) ? "Needs Attention" : "Stable";

  // 💊 Auto water delivery logic
  unsigned long now = millis();
  if (moisture < 400 && !pumpCooldown) {
    Serial.println("💧 Moisture low. Activating pump...");
    digitalWrite(MEDICINE_PUMP_PIN, HIGH);
    digitalWrite(LED_BUILTIN_PIN, HIGH);
    delay(30000); // pump for 30 seconds
    digitalWrite(MEDICINE_PUMP_PIN, LOW);
    digitalWrite(LED_BUILTIN_PIN, LOW);
    medicineDelivered += 20;
    pumpCooldown = true;
    lastPumpTime = now;
  }

  if (pumpCooldown && (now - lastPumpTime > 600000)) { // 10 min cooldown
    pumpCooldown = false;
  }

  // 📤 Publish to MQTT
  String payload = "{\"temperature\":" + String(temperature, 2) +
                   ",\"humidity\":" + String(humidity, 2) +
                   ",\"moisture\":" + String(moisture) +
                   ",\"medicine_ml\":" + String(medicineDelivered) + "}";
  mqttClient.publish(MQTT_TOPIC, payload.c_str());
  Serial.println("📤 MQTT Published: " + payload);

  // ☁️ Log to Firebase
  String base = "/medicube_log/";
  fb.setFloat(base + "temperature", temperature);
  fb.setFloat(base + "humidity", humidity);
  fb.setInt(base + "moisture", moisture);
  fb.setInt(base + "medicine_ml", medicineDelivered);
  fb.setString(base + "status", mood);

  delay(10000); // check again every 10s
}
// services/mqttService.js
import mqtt from 'mqtt'; // ✅ correct import

const MQTT_BROKER = 'wss://broker.hivemq.com:8884/mqtt';
const MQTT_TOPIC = 'medicube/command';

let client;

export const connectMQTT = () => {
  if (!client || !client.connected) {
    client = mqtt.connect(MQTT_BROKER);
    client.on('connect', () => console.log('✅ MQTT connected'));
    client.on('error', (err) => console.error('❌ MQTT error:', err));
  }
};

export const isMQTTConnected = () => {
  return client && client.connected;
};

export const sendMQTTCommand = (command) => {
  if (client && client.connected) {
    client.publish(MQTT_TOPIC, command);
    console.log('📤 Sent MQTT command:', command);
  } else {
    console.error('❌ MQTT not connected. Command failed:', command);
  }
};
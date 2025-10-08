// constants/config.js

export const mqttConfig = {
  broker: '192.168.1.118',     // your computer’s IP address
  port: 1884,                  // your Mosquitto broker port
  clientId: 'MediCubeClient',
  topic: 'smartplant/data'
};
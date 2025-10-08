import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { connectMQTT, isMQTTConnected, sendMQTTCommand } from '../services/mqttService';

const ManualControlScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [mqttConnected, setMqttConnected] = useState(false);

  useEffect(() => {
    connectMQTT();
    const interval = setInterval(() => {
      if (typeof isMQTTConnected === 'function') {
        setMqttConnected(isMQTTConnected());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePump = () => {
    if (mqttConnected) sendMQTTCommand('activate_pump');
  };

  const handleAutoOn = () => {
    if (mqttConnected) sendMQTTCommand('auto_on');
  };

  const handleAutoOff = () => {
    if (mqttConnected) sendMQTTCommand('auto_off');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Manual Controls</Text>

      <TouchableOpacity
        onPress={handlePump}
        disabled={!mqttConnected}
        style={[styles.button, { backgroundColor: mqttConnected ? '#007AFF' : '#ccc' }]}
      >
        <Text style={styles.buttonText}>Activate Pump</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleAutoOn}
        disabled={!mqttConnected}
        style={[styles.button, { backgroundColor: mqttConnected ? '#28a745' : '#ccc' }]}
      >
        <Text style={styles.buttonText}>Auto Mode On</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleAutoOff}
        disabled={!mqttConnected}
        style={[styles.button, { backgroundColor: mqttConnected ? '#dc3545' : '#ccc' }]}
      >
        <Text style={styles.buttonText}>Auto Mode Off</Text>
      </TouchableOpacity>

      {!mqttConnected && (
        <Text style={[styles.warning, { color: theme.text }]}>⚠️ MQTT not connected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  warning: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default ManualControlScreen;
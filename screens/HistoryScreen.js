// /screens/HistoryScreen.js

import { onValue, ref } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TemperatureChart from '../components/TemperatureChart';
import { ThemeContext } from '../context/ThemeContext';
import { database } from '../services/firebaseService';

const HistoryScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logRef = ref(database, 'medicube_history');
    onValue(logRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.entries(data).map(([time, entry]) => ({ time, ...entry })).reverse();
        setLogs(formatted.slice(0, 10));
      }
    });
  }, []);

  const latest = logs[0] || {};
  const medicineStatus =
    latest.temperature < 26 &&
    latest.humidity < 70 &&
    latest.moisture > 300
      ? '✅ Medicine in Good Condition'
      : '⚠️ Medicine May Be Affected';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>📈 Temperature Trend</Text>
      <TemperatureChart />

      <Text style={[styles.subheader, { color: theme.text }]}>🕓 Recent Activity Log</Text>
      <View style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={[styles.logEntry, { color: theme.text }]}>💊 {log.medicine_ml}ml delivered at {log.time.replace('time_', '').replace(/(\d{2})(?=\d{2})/g, '$1:')}</Text>
        ))}
      </View>

      <Text style={[styles.status, {
        color: latest.temperature < 26 && latest.humidity < 70 && latest.moisture > 300 ? 'green' : 'red',
      }]}>💡 {medicineStatus}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  logContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  logEntry: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default HistoryScreen;
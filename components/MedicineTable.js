// components/MedicineTable.js

import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MedicineTable() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const historyRef = ref(db, 'medicube_history');

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([timestamp, value]) => ({
          timestamp,
          ...value,
        }));
        const sorted = list.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        setEntries(sorted);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💊 Medicine Delivery History</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Time</Text>
        <Text style={styles.headerCell}>Patient</Text>
        <Text style={styles.headerCell}>Delivered (ml)</Text>
      </View>
      {entries.map((entry, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{entry.timestamp.replace('time_', '')}</Text>
          <Text style={styles.cell}>{entry.patient || 'N/A'}</Text>
          <Text style={styles.cell}>{entry.medicine_ml || 0}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 6,
    marginBottom: 6,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
  },
  cell: {
    flex: 1,
    fontSize: 13,
  },
});
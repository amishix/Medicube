// SensorCard placeholder
import { StyleSheet, Text, View } from 'react-native';

const SensorCard = ({ title, value, unit, status }) => {
  const getStatusColor = () => {
    if (status === 'good') return '#2ecc71'; // green
    if (status === 'warning') return '#f1c40f'; // yellow
    if (status === 'critical') return '#e74c3c'; // red
    return '#bdc3c7'; // default grey
  };

  return (
    <View style={[styles.card, { borderLeftColor: getStatusColor() }]}> 
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value} {unit}</Text>
      <Text style={[styles.status, { color: getStatusColor() }]}>{status.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});

export default SensorCard;
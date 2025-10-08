import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const HumidityChart = () => {
  const [humidityData, setHumidityData] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const historyRef = ref(db, 'medicube_history');

    onValue(historyRef, (snapshot) => {
      const history = snapshot.val();
      if (history) {
        const values = Object.values(history)
          .map(entry => ({
            y: entry?.humidity || 0,
          }))
          .slice(-10); // last 10 readings
        setHumidityData(values);
      }
    });
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>Humidity</Text>
      <LineChart
        data={{
          labels: humidityData.map((_, i) => `H${i + 1}`),
          datasets: [{ data: humidityData.map(entry => entry.y) }],
        }}
        width={Dimensions.get('window').width - 32}
        height={220}
        yAxisSuffix="%"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#74c0fc',
          backgroundGradientTo: '#d0ebff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 51, 102, ${opacity})`,
          labelColor: () => '#000',
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#003366',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 12,
        }}
      />
    </View>
  );
};

export default HumidityChart;
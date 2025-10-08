// components/TemperatureChart.js

import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const TemperatureChart = () => {
  const [temperatureData, setTemperatureData] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const dataRef = ref(db, 'medicube_history');

    onValue(dataRef, (snapshot) => {
      const history = snapshot.val();
      if (history) {
        const values = Object.values(history)
          .map(entry => ({
            x: entry?.timestamp || '',
            y: entry?.temperature || 0,
          }))
          .slice(-10); // last 10 readings

        setTemperatureData(values);
      }
    });
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>Temperature (°C)</Text>
      <LineChart
        data={{
          labels: temperatureData.map((_, i) => `T${i + 1}`),
          datasets: [
            {
              data: temperatureData.map(item => item.y),
            },
          ],
        }}
        width={Dimensions.get('window').width - 32}
        height={220}
        yAxisSuffix="°C"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#0077b6',
          backgroundGradientTo: '#90e0ef',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => '#000',
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#000',
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

export default TemperatureChart;
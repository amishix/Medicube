// components/MoistureChart.js

import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const MoistureChart = () => {
  const [moistureData, setMoistureData] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const dataRef = ref(db, 'medicube_history');

    onValue(dataRef, (snapshot) => {
      const history = snapshot.val();
      if (history) {
        const values = Object.values(history)
          .map(entry => ({
            y: entry?.moisture || 0,
          }))
          .slice(-10); // last 10 readings
        setMoistureData(values);
      }
    });
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>Moisture</Text>
      <LineChart
        data={{
          labels: moistureData.map((_, i) => `M${i + 1}`),
          datasets: [{ data: moistureData.map(entry => entry.y) }],
        }}
        width={Dimensions.get('window').width - 32}
        height={220}
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#52b788',
          backgroundGradientTo: '#d8f3dc',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 37, 41, ${opacity})`,
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

export default MoistureChart;
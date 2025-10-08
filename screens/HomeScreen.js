import * as ImagePicker from 'expo-image-picker';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import HumidityChart from '../components/HumidityChart';
import MoistureChart from '../components/MoistureChart';
import TemperatureChart from '../components/TemperatureChart';
import { ThemeContext } from '../context/ThemeContext';
import * as firebaseService from '../services/firebaseService';

const HomeScreen = () => {
  const { theme } = useContext(ThemeContext);

  const [lastUpdated, setLastUpdated] = useState('');
  const [latestReadings, setLatestReadings] = useState({});
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [photoURI, setPhotoURI] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseService.listenToSensorData((data) => {
      if (data) {
        setLatestReadings(data);
        setLastUpdated(data.timestamp
          ? new Date(data.timestamp).toLocaleString()
          : new Date().toLocaleString());
        setLoading(false);
      }
    });

    firebaseService.fetchPatientData().then((data) => {
      if (data) {
        setPatientName(data.name || '');
        setPhotoURI(data.photo || null);
      }
    });

    return () => unsubscribe();
  }, []);

  const isMedicineGood = () => {
    const { temperature, humidity, moisture } = latestReadings;
    return (
      temperature >= 18 && temperature <= 26 &&
      humidity >= 30 && humidity <= 70 &&
      moisture >= 300 && moisture <= 800
    );
  };

  const pickImage = async () => {
    Alert.alert(
      'Upload Photo',
      'Choose image source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const { granted } = await ImagePicker.requestCameraPermissionsAsync();
            if (!granted) return alert('Camera permission denied');

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              setPhotoURI(uri);
              firebaseService.savePatientData(patientName, uri);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) return alert('Media library permission denied');

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              setPhotoURI(uri);
              firebaseService.savePatientData(patientName, uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNameChange = (text) => {
    setPatientName(text);
    firebaseService.savePatientData(text, photoURI);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={require('../assets/thanniworks-logo.png')} style={styles.logo} resizeMode="contain" />

      <View style={[styles.card, { backgroundColor: theme.card || '#f0f0f0' }]}>
        <TouchableOpacity onPress={pickImage}>
          {photoURI ? (
            <Image source={{ uri: photoURI }} style={styles.patientPhoto} />
          ) : (
            <Text style={[styles.noPhoto, { color: theme.text }]}>📷 Tap to add photo</Text>
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Enter patient name"
          value={patientName}
          onChangeText={handleNameChange}
          placeholderTextColor="#aaa"
          style={[styles.nameInput, { color: theme.text, borderColor: theme.text }]}
        />
      </View>

      <Text style={[styles.timestamp, { color: theme.text }]}>
        Last updated: {lastUpdated || '—'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.text} style={{ marginVertical: 20 }} />
      ) : (
        <>
          <View style={styles.readingsContainer}>
            <Text style={[styles.reading, { color: theme.text }]}>🌡 Temp: {latestReadings.temperature ?? '--'}°C</Text>
            <Text style={[styles.reading, { color: theme.text }]}>💧 Humidity: {latestReadings.humidity ?? '--'}%</Text>
            <Text style={[styles.reading, { color: theme.text }]}>🌱 Moisture: {latestReadings.moisture ?? '--'}</Text>
          </View>

          <Text style={[
            styles.statusMessage,
            isMedicineGood() ? styles.statusGood : styles.statusBad
          ]}>
            {isMedicineGood() ? '✅ Medicine is in good condition' : '⚠️ Medicine may be compromised'}
          </Text>

          <Text style={[styles.chartLabel, { color: theme.text }]}>Temperature Trend</Text>
          <TemperatureChart />
          <Text style={[styles.chartLabel, { color: theme.text }]}>Humidity Trend</Text>
          <HumidityChart />
          <Text style={[styles.chartLabel, { color: theme.text }]}>Moisture Trend</Text>
          <MoistureChart />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  logo: {
    width: '60%',
    height: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  timestamp: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 8,
  },
  readingsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 12,
  },
  reading: {
    fontSize: 16,
    marginVertical: 4,
  },
  statusMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  statusGood: {
    color: 'green',
  },
  statusBad: {
    color: 'red',
  },
  chartLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  patientPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  nameInput: {
    borderBottomWidth: 1,
    fontSize: 16,
    padding: 4,
    textAlign: 'center',
    width: 160,
  },
  noPhoto: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default HomeScreen;
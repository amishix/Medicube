// components/PatientCard.js

import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

const PatientCard = () => {
  const [name, setName] = useState('');
  const [photoURI, setPhotoURI] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required.');
      }
    })();
  }, []);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhotoURI(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Patient Profile</Text>
      {photoURI ? (
        <Image source={{ uri: photoURI }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}><Text>No photo</Text></View>
      )}
      <Button title="Take Photo" onPress={pickPhoto} />
      <Text style={styles.name}>{name || 'Enter name below'}</Text>
      <Button title="Set Name as 'Charlie'" onPress={() => setName('Charlie')} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    marginVertical: 8,
  },
});

export default PatientCard;
import { initializeApp } from 'firebase/app';
import {
    child,
    get,
    getDatabase,
    onValue,
    ref,
    set
} from 'firebase/database';
import {
    getDownloadURL,
    getStorage,
    ref as sRef,
    uploadBytes
} from 'firebase/storage';

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDvbqdwp9maQwaN0ov7Gl4BWuzZC2gzOpk',
  authDomain: 'iotproject-e442b.firebaseapp.com',
  databaseURL: 'https://iotproject-e442b-default-rtdb.firebaseio.com/',
  projectId: 'iotproject-e442b',
  storageBucket: 'iotproject-e442b.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef123456'
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);

// 🔁 Realtime listener for medicube_log
export const listenToSensorData = (callback) => {
  const sensorRef = ref(database, 'medicube_log');
  return onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

// 📥 Fetch historical sensorData (used in History screen)
export const fetchLatestSensorData = async () => {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, 'sensorData'));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error fetching sensorData:', error);
    return null;
  }
};

// 📤 Upload patient photo
export const uploadPatientPhoto = async (uri, filename) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const photoRef = sRef(storage, `patientPhotos/${filename}`);
    await uploadBytes(photoRef, blob);
    const downloadURL = await getDownloadURL(photoRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
};

// 💾 Save patient name + photo
export const savePatientData = async (name, photoURL) => {
  try {
    const patientRef = ref(database, 'patientData');
    await set(patientRef, {
      name,
      photo: photoURL,
    });
  } catch (error) {
    console.error('Error saving patient data:', error);
  }
};

// 📤 Fetch patient name + photo (✅ this fixes your crash)
export const fetchPatientData = async () => {
  try {
    const dbRef = ref(database, 'patientData');
    const snapshot = await get(dbRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return null;
  }
};
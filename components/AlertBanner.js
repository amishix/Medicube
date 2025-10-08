// AlertBanner placeholder
// components/AlertBanner.js

import { StyleSheet, Text, View } from 'react-native';

const AlertBanner = ({ type, message }) => {
  const getBannerStyle = () => {
    switch (type) {
      case 'warning':
        return styles.warning;
      case 'critical':
        return styles.critical;
      case 'success':
        return styles.success;
      default:
        return styles.default;
    }
  };

  return (
    <View style={[styles.banner, getBannerStyle()]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  warning: {
    backgroundColor: '#f39c12',
  },
  critical: {
    backgroundColor: '#e74c3c',
  },
  success: {
    backgroundColor: '#2ecc71',
  },
  default: {
    backgroundColor: '#3498db',
  },
});

export default AlertBanner;
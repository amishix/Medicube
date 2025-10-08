// hooks/useMQTT.js

import { useEffect } from 'react';
import { disconnectMQTT, initMQTT } from '../services/mqttService';

export const useMQTT = (callback) => {
  useEffect(() => {
    initMQTT(callback);
    return () => disconnectMQTT();
  }, []);
};
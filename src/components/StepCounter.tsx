import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import NativeStepCounter from './../../specs/NativeStepCounter';
import { requestActivityRecognitionPermission } from '../utils/request-permissions';

const StepCounter = () => {
  const [steps, setSteps] = useState<number>(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  useEffect(() => {
    requestActivityRecognitionPermission();
  }, []);

  useEffect(() => {
    if (isTracking) {
      NativeStepCounter.startStepCounting();

      const interval = setInterval(() => {
        NativeStepCounter?.getCurrentStepCount()
          .then((count: number) => {
            setSteps(count);
          })
          .catch(err => console.error(err));
      }, 1000);

      return () => {
        clearInterval(interval);
        NativeStepCounter.stopStepCounting();
      };
    }
  }, [isTracking]);

  const handleTrackingToggle = useCallback(() => {
    if (isTracking) {
      Alert.alert(
        'Остановить отслеживание?',
        'Вы уверены, что хотите остановить шагомер?',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Да',
            onPress: () => setIsTracking(false),
            style: 'destructive',
          },
        ],
        { cancelable: true },
      );
    } else {
      setIsTracking(true);
    }
  }, [isTracking]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Шагомер</Text>
      <Text style={styles.steps}>Шаги: {steps}</Text>
      <Button
        title={isTracking ? 'Остановить' : 'Начать отслеживание'}
        onPress={handleTrackingToggle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  steps: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default StepCounter;

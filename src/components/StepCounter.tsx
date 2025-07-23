import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  DeviceEventEmitter,
  TextInput,
} from 'react-native';
import NativeStepCounter from './../../specs/NativeStepCounter';
import { requestActivityRecognitionPermission } from '../utils/request-permissions';
import ProgressBar from './progress-bar/ProgressBar';

const StepCounter = () => {
  const [steps, setSteps] = useState<number>(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [goal, setGoal] = useState<string>('10000');

  useEffect(() => {
    requestActivityRecognitionPermission();
  }, []);

  useEffect(() => {
    if (isTracking) {
      NativeStepCounter.startStepCounting();

      const subscription = DeviceEventEmitter.addListener(
        'stepCountChanged',
        count => {
          setSteps(count);
        },
      );

      return () => {
        subscription.remove();
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

  const progress = +goal > 0 ? Math.min(steps / +goal, 1) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Шагомер</Text>
      <Text style={styles.steps}>Шаги: {steps}</Text>
      <Button
        title={isTracking ? 'Остановить' : 'Начать отслеживание'}
        color={isTracking ? 'red' : 'green'}
        onPress={handleTrackingToggle}
      />

      <View style={styles.barWrapper}>
        <ProgressBar
          progress={progress}
          progressColor="green"
          style={styles.bar}
        />
      </View>

      <Text style={styles.goalLabel}>Цель (шагов):</Text>
      <TextInput
        style={styles.input}
        value={goal.toString()}
        onChangeText={setGoal}
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 60,
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
  barWrapper: {
    alignSelf: 'center',
    width: '80%',
    marginTop: 50,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
  },
  bar: {
    height: 40,
  },
  goalLabel: {
    marginTop: 30,
    fontSize: 16,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default StepCounter;

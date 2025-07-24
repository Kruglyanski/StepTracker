import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import StepCounter from './src/components/StepCounter';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StepCounter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;

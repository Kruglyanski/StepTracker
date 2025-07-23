import React from 'react';
import { SafeAreaView } from 'react-native';

import StepCounter from './src/components/StepCounter';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StepCounter />
    </SafeAreaView>
  );
}

export default App;

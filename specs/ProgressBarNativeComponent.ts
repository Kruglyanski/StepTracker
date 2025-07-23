import type { HostComponent, ViewProps } from 'react-native';
import type { Float } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

interface NativeProps extends ViewProps {
  progress?: Float;
  progressColor?: string;
}

export default codegenNativeComponent<NativeProps>(
  'ProgressBarView',
) as HostComponent<NativeProps>;

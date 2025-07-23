import React from 'react';
import type { HostComponent } from 'react-native';
import type { ProgressBarProps } from './types';

const ProgressBarNativeComponent =
  require('../../../specs/ProgressBarNativeComponent')
    .default as HostComponent<ProgressBarProps>;

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  progressColor = 'blue',
  style,
}) => {
  return (
    <ProgressBarNativeComponent
      style={{ height: 20, width: '100%', ...style }}
      progress={progress}
      progressColor={progressColor}
    />
  );
};

export default ProgressBar;

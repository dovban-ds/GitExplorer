// reactotron must initialize before React Native bridge to intercept network calls
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@shared/utils/reactotron');
}

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {AppProviders} from './providers';
import {RootNavigator} from '@navigation/RootNavigator';
import {ErrorBoundary} from '@shared/components/ErrorBoundary';

export default function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </ErrorBoundary>
    </AppProviders>
  );
}

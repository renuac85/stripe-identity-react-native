import React, { useState, useCallback } from 'react';
import { StripeIdentityProvider } from 'stripe-identity-react-native';
import { StyleSheet, Image, View, SafeAreaView } from 'react-native';
import logo from '../assets/RocketRides.png';
import { getTestCredentials } from '../utils/api';
import { Options } from '../components/Options';
import { Identity } from '../components/Identity';
import { AllowedTypes, VerificationSessionOptions } from '../types';

export function HomeScreen() {
  const [options, setOptions] = useState<VerificationSessionOptions>({
    requireMatchingSelfie: false,
    requireIdNumber: false,
    allowedTypes: {
      [AllowedTypes.DRIVING_LICENSE]: true,
      [AllowedTypes.ID_CARD]: true,
      [AllowedTypes.PASSPORT]: true,
    },
    requireLiveCapture: false,
  });

  const fetchCredentials = useCallback(async () => {
    const credentials = await getTestCredentials(options);
    return {
      sessionId: credentials.id,
      ephemeralKeySecret: credentials.ephemeral_key_secret,
      merchantLogo: Image.resolveAssetSource(logo),
    };
  }, [options]);

  return (
    <SafeAreaView style={styles.container}>
      <Options options={options} setOptions={setOptions} />
      <View style={styles.divider} />
      <StripeIdentityProvider optionsProvider={fetchCredentials}>
        <Identity />
      </StripeIdentityProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
});

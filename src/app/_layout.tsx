
import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { appTheme } from '../constants/theme';
import { checkAuth, logoutUser } from '../services/auth';

export default function RootLayout() {
  const [authChecked, setAuthChecked] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const segments = useSegments();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function initializeApp() {
      try {
        await logoutUser();
      } catch (error) {
        console.log('Logout error:', error);
      }

      if (cancelled) return;

      unsubscribe = checkAuth((user) => {
        setUserExists(!!user);
        setAuthChecked(true);

        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
          setSplashDone(true);
        }, 2500);
      });
    }

    initializeApp();

    return () => {
      cancelled = true;
      unsubscribe?.();

      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!authChecked || !splashDone) return;

    const currentScreen = segments[0];

    if (userExists) {
      if (currentScreen === 'login' || currentScreen === 'register') {
        router.replace('/home');
      }
    } else {
      if (currentScreen !== 'login' && currentScreen !== 'register') {
        router.replace('/login');
      }
    }
  }, [authChecked, splashDone, userExists, segments]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={appTheme}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />

          {(!authChecked || !splashDone) && (
            <View style={styles.container}>
              <Image
                source={require('../../assets/images/recipe-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.subtitle}>
                Discover. Cook. Enjoy.
              </Text>
            </View>
          )}
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF9F2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 10
  },
  logo: {
    width: 320,
    height: 320
  },
  subtitle: {
    color: '#6B8E65',
    fontSize: 16,
    marginTop: 12,
    letterSpacing: 1
  }
});

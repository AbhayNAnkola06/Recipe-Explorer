
import { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

import {
  Text,
  TextInput,
  Button,
  HelperText
} from 'react-native-paper';

import { Link, router } from 'expo-router';
import { loginUser } from '../services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      await loginUser(email.trim(), password);
      router.replace('/home');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/recipe-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.welcome}>Welcome back!</Text>

          <Text style={styles.description}>
            Sign in to discover delicious recipes.
          </Text>
        </View>

        <View style={styles.form}>
          <Text variant="headlineSmall" style={styles.heading}>
            Login
          </Text>

          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="email-outline" />}
            style={styles.input}
            outlineColor="#E8D8C8"
            activeOutlineColor="#E87932"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            outlineColor="#E8D8C8"
            activeOutlineColor="#E87932"
          />

          {error ? (
            <HelperText type="error" visible>
              {error}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            buttonColor="#E87932"
          >
            Login
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>

            <Link href="/register" style={styles.link}>
              Register
            </Link>
          </View>
        </View>

        <Text style={styles.bottomText}>
          YOUR DAILY DOSE OF DELICIOUS
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F2'
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 25
  },
  header: {
    alignItems: 'center',
    marginBottom: 22
  },
  logo: {
    width: 270,
    height: 270
  },
  welcome: {
    color: '#302820',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 12
  },
  description: {
    color: '#8A8178',
    fontSize: 14,
    marginTop: 7,
    textAlign: 'center'
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 22,
    elevation: 3
  },
  heading: {
    color: '#302820',
    fontWeight: 'bold',
    marginBottom: 22
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF'
  },
  button: {
    marginTop: 12,
    borderRadius: 12
  },
  buttonContent: {
    height: 50
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  footerText: {
    color: '#6B625A'
  },
  link: {
    color: '#E87932',
    fontWeight: 'bold',
    marginLeft: 5
  },
  bottomText: {
    textAlign: 'center',
    color: '#A99A8C',
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 25
  }
});

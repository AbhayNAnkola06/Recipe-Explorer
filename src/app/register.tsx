
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
import { registerUser } from '../services/auth';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      await registerUser(
        name.trim(),
        email.trim(),
        password
      );

      router.replace('/home');

    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Please choose a stronger password.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
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

          <Text style={styles.title}>
            Join Recipe Explorer
          </Text>

          <Text style={styles.subtitle}>
            Create an account and start exploring!
          </Text>
        </View>

        <View style={styles.form}>
          <Text variant="headlineSmall" style={styles.heading}>
            Create Account
          </Text>

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            autoCapitalize="words"
            left={<TextInput.Icon icon="account-outline" />}
            style={styles.input}
            outlineColor="#E8D8C8"
            activeOutlineColor="#E87932"
          />

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

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            left={<TextInput.Icon icon="lock-check-outline" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
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
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            buttonColor="#E87932"
          >
            Create Account
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?
            </Text>

            <Link href="/login" style={styles.link}>
              Login
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
    justifyContent: 'center',
    marginBottom: 25
  },
  logo: {
    width: 230,
    height: 230,
    alignSelf: 'center'
  },
  title: {
    color: '#E87932',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8
  },
  subtitle: {
    color: '#8A8178',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8
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

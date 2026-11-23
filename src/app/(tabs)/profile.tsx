
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from '../../services/firebase';
import { logoutUser } from '../../services/auth';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Unable to log out. Please try again.');
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#29443A" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>My Profile</Text>
      <Text style={styles.subtitle}>Manage your account</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={45} color="#FFFFFF" />
        </View>
        <Text style={styles.name}>
          {user?.displayName || 'Recipe Explorer User'}
        </Text>
        <Text style={styles.email}>
          {user?.email || 'No email available'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Account Information</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <Ionicons name="mail-outline" size={21} color="#29443A" />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.label}>Email Address</Text>
            <Text style={styles.value}>
              {user?.email || 'Not available'}
            </Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <Ionicons name="person-outline" size={21} color="#29443A" />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.label}>Display Name</Text>
            <Text style={styles.value}>
              {user?.displayName || 'Not set'}
            </Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <Ionicons name="shield-checkmark-outline" size={21} color="#29443A" />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.label}>Account Status</Text>
            <Text style={styles.value}>Signed In</Text>
          </View>
        </View>
      </View>

      <View style={styles.appCard}>
        <Ionicons name="restaurant-outline" size={25} color="#D6A85F" />
        <View style={styles.appText}>
          <Text style={styles.appName}>Recipe Explorer</Text>
          <Text style={styles.appVersion}>Discover something delicious</Text>
        </View>
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={21} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EF'
  },
  scrollContent: {
    padding: 22,
    paddingTop: 35,
    paddingBottom: 50
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F5EF'
  },
  heading: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#29443A'
  },
  subtitle: {
    fontSize: 14,
    color: '#829087',
    marginTop: 5,
    marginBottom: 25
  },
  profileCard: {
    backgroundColor: '#29443A',
    borderRadius: 22,
    padding: 25,
    alignItems: 'center',
    marginBottom: 28
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: '#78947A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  name: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold'
  },
  email: {
    color: '#D8E0D8',
    fontSize: 13,
    marginTop: 7
  },
  sectionTitle: {
    color: '#29443A',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 13
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 17
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EDF2EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13
  },
  infoText: {
    flex: 1
  },
  label: {
    fontSize: 12,
    color: '#89938B'
  },
  value: {
    fontSize: 14,
    color: '#29443A',
    fontWeight: '600',
    marginTop: 4
  },
  line: {
    height: 1,
    backgroundColor: '#EEF0EB',
    marginVertical: 5
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginTop: 22
  },
  appText: {
    marginLeft: 13
  },
  appName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#29443A'
  },
  appVersion: {
    fontSize: 12,
    color: '#89938B',
    marginTop: 4
  },
  logoutButton: {
    backgroundColor: '#29443A',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    gap: 10
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

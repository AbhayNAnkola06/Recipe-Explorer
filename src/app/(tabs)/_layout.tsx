
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#29443A',
        tabBarInactiveTintColor: '#A3A99F',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E9E7DE',
          height: 65,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={String(color)} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={String(color)} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={String(color)} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={String(color)} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

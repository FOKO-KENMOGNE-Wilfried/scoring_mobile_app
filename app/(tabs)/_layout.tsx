import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';

export default function TabLayout() {

  const router = useRouter();

    useEffect(() => {
      const fetchToken = async () => {
        const res = await LocalStorageManagement.getItem('token');
        if (!res) {
          router.replace("/pages/login")
        };
        console.log(res);
      }
      fetchToken();
    }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Manage Account',
          tabBarIcon: ({ color }) => <MaterialIcons color={color} size={28} name={"manage-accounts"} />,
        }}
      />
    </Tabs>
  );
}

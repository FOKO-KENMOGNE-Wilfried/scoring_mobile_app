import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';
import * as jwtDecode from "jwt-decode";

export default function TabLayout() {

  const router = useRouter();

    useEffect(() => {
      const fetchToken = async () => {
        try {
          const res = await LocalStorageManagement.getItem('token');
          if (!res) {
            console.log("Aucun token trouvé.");
            router.replace("/pages/login");
            return;
          }
          const expirationTime = jwtDecode.jwtDecode(res).exp as unknown as number;
          console.log(res)
          if (!expirationTime || expirationTime * 1000 < new Date().getTime()) {
            console.log("Le token a expiré.");
            router.replace("/pages/login");
          } else {
            console.log("Le token est valide.");
            router.replace("/");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération ou validation du token :", error);
          router.replace("/pages/login");
        }
      };
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

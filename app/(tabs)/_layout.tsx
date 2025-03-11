import { Tabs, useRouter, useSegments } from 'expo-router';
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

  const extractExpirationDate = (token: any) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      if (payload.exp) {
        const expirationDate = new Date(payload.exp * 1000);
        console.log('Date d\'expiration :', expirationDate);
        return expirationDate;
      } else {
        console.log('Le token ne contient pas de clé exp.');
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse du token :', error);
      return null;
    }
  };


    useEffect(() => {
      const fetchToken = async () => {
        try {
          const res = await LocalStorageManagement.getItem('token');
          if (!res) {
            console.log("Aucun token trouvé.");
            router.replace("/pages/login");
            return;
          }
          const expirationTime = extractExpirationDate(res) as unknown as number;
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

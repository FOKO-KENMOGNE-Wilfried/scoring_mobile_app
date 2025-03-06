import AsyncStorage from "@react-native-async-storage/async-storage";

export class LocalStorageManagement {

    static setItem = async (key: any, value: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting item:', error);
        }
    };

    static getItem = async (key: any) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value != null ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error getting item:', error);
            return null;
        }
    };

    static removeItem = async (key: any) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

}

// import SecureStore from 'expo-secure-store';

// export class LocalStorageManagement {
//   static setItem = async (key: string, value: any) => {
//     await SecureStore.setItemAsync(key, JSON.stringify(value));
//   };

//   static getItem = async (key: string) => {
//     const value = await SecureStore.getItemAsync(key);
//     return value ? JSON.parse(value) : null;
//   };

//   static removeItem = async (key: string) => {
//     await SecureStore.deleteItemAsync(key);
//   };
// }

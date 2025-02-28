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
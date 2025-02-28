import { StyleSheet, Dimensions, Text, View } from 'react-native';

import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';

export default function HomeScreen() {


  // const token = await LocalStorageManagement.getItem('token');

  // if( true ) {
  //   return <Redirect href="/pages/login" />;
  // }

  return (
    <View style={styles.container}>
        <Text>Home page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: Dimensions.get("window").height,
      width: Dimensions.get("window").width,
      backgroundColor: "#F5FCFF",
    }
});

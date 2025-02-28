import { StyleSheet, Dimensions, Text, View, Image } from 'react-native';

import { Redirect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';

export default function HomeScreen() {

  const router = useRouter();


  // const token = await LocalStorageManagement.getItem('token');

  // if( true ) {
  //   return <Redirect href="/pages/login" />;
  // }

  return (
    <View style={styles.container}>
        <View style={{
          borderWidth: 1,
          padding: 20,
          borderRadius: 10,
          marginBottom: 10,
          justifyContent: "center",
          borderColor: "black"
        }}>
          <Text style={{
            fontWeight: "semibold",
            fontSize: 24,
          }}>Bon retour</Text>
          <Text style={{
            fontWeight: "bold",
            fontSize: 24,
          }}>FOKO KENMOGNE Wilfried</Text>
        </View>
        {/*  */}
        <View style={{
          backgroundColor: "#224A6D",
          padding: 20,
          borderRadius: 10,
          marginTop: 10,
          marginBottom: 10,
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Text style={{
            color: "white",
            textAlign: "center",
            fontSize: 20,
          }}>Votre lieux d'affectation est le site de COPSCECO</Text>
          <Text style={{
            color: "white",
            textAlign: "center",
            fontSize: 20,
          }}>vos horaire de travail sont de 8h - 17h</Text>
        </View>
        {/*  */}
        <View style={{
          marginTop: 40,
          display: "flex",
          gap: 10,
          marginBottom: 10,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: "semibold",
            color: "gray"
          }}>Demarrer votre procedure de pointage !</Text>
          <View style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
            marginBottom: 10,
            backgroundColor: "#8FA3B5",
            height: 120,
            borderRadius: 10,
          }} onTouchStart={() => router.push({ pathname: "/pages/scoringByController", params: { title: "Pointage via un controller" } })}>
            {/* <Image source={require("")}></Image> */}
            <Text style={{
              color: "white",
              fontSize: 15
            }}>Envoyer une requete au controller</Text>
          </View>
          <View style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
            marginBottom: 10,
            backgroundColor: "#8FA3B5",
            height: 120,
            borderRadius: 10,
          }} onTouchStart={() => router.push({ pathname: "/pages/autoScoring", params: { title: "Pointage via un controller" } })}>
            {/* <Image source={require("")}></Image> */}
            <Text style={{
              color: "white",
              fontSize: 15
            }}>Pointage par reconnaissance biometrique</Text>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      display: "flex",
      paddingHorizontal: 10,
      height: Dimensions.get("window").height,
      width: Dimensions.get("window").width,
      backgroundColor: "#F5FCFF",
    }
});

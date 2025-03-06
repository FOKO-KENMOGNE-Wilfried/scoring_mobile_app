import { LocalStorageManagement } from '@/utils/LocalStorageManagement';
import { useRouter } from 'expo-router';
import { Button, Dimensions, Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function TabTwoScreen() {

  const router = useRouter()

  async function logout() {
    LocalStorageManagement.removeItem('token');
    console.log('logged out');
    router.replace("/pages/login");
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          gap: 20,
        }}>
          <Image
            source={require("@/assets/images/profile.jpg")}
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
            }}
          ></Image>
          <Text style={{
            fontWeight: "semibold",
            fontSize: 24,
            marginTop: 10,
          }}>Wilfried FOKO KENOMGNE</Text>
        </View>
        <View style={{
            display: "flex",
            marginBottom: 10,
          }}>
            {/*  */}
          <View style={{
            display: "flex",
            gap: 10,
            marginBottom: 10,
          }}>
            <Text style={{}}>Ancien mot de passe</Text>
            <TextInput
              placeholder="Entrez votre mot de passe actuel"
              style={{
                padding: 10,
                backgroundColor: "white",
                marginBottom: 10,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "gray",
                width: 0.8*Dimensions.get("window").width,
                height: 45,
              }}
              secureTextEntry={true}
            />
          </View>
          <View style={{
            display: "flex",
            gap: 10,
            marginBottom: 10,
          }}>
            <Text style={{}}>Nouveau mot de passe</Text>
            <TextInput
              placeholder="Entrez votre nouveau mot de passe"
              style={{
                padding: 10,
                backgroundColor: "white",
                marginBottom: 10,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "gray",
                width: 0.8*Dimensions.get("window").width,
                height: 45,
              }}
              secureTextEntry={true}
            />
          </View>
          {/*  */}
          <Button onPress={() => null} color={"#224A6D"} title="Enregistrer" />
        </View>
      </View>
      <View style={{
        display: "flex",
        width: Dimensions.get("window").width,
        paddingHorizontal: 30
      }}>
        <Button onPress={() => logout()} color={"#812D25"} title="Se deconnecter" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "#F5FCFF"
  }
});

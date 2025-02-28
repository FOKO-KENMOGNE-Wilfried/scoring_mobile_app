import { useRouter } from 'expo-router';
import { Button, Dimensions, Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Login() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
      }}>
        <Image source={require("@/assets/images/logo.png")}
        style={{
          width: 100,
          height: 100,
          resizeMode: "contain",
        }}
        ></Image>
        <Text style={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
        }}>Connectez-vous</Text>
      </View>
      <View style={{
        display: "flex",
        gap: 8
      }}>
        <View style={styles.inputContainer}>
          <Text style={styles.textColor}>Email</Text>
          <TextInput
            placeholder="Votre adresse email"
            style={{
              padding: 10,
              backgroundColor: "white",
              marginBottom: 10,
              borderRadius: 5,
              width: 0.8*Dimensions.get("window").width,
              height: 45,
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textColor}>Mot de passe</Text>
          <TextInput
            placeholder="Votre mot de passe"
            style={{
              padding: 10,
              backgroundColor: "white",
              marginBottom: 10,
              borderRadius: 5,
              width: 0.8*Dimensions.get("window").width,
              height: 45,
            }}
            secureTextEntry={true}
          />
        </View>
        <Button onPress={() => router.replace("/")} color={"#224A6D"} title="Se connecter" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "#8FA3B5",
  },
  textColor: {
    color: "white",
  },
  inputContainer: {
    display: "flex",
    gap: 4,
  }
});

import CameraPopUp from '@/components/CameraPopUp';
import AppLoader from '@/components/ui/AppLoader';
import API from '@/utils/API';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Dimensions, Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeImage, setEmployeeImage] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = new API();

  const [isDisplayCamera, setIsDisplayCamera] = useState(false);

  const handleSubmit = async () => {
    // (async () => {
    const data = {
      email,
      password,
    }
    console.log(data)
    await api.postData(api.apiUrl + "/auth/checkCredentials", data)
      .then(async (res) => {

        setTempToken(res.token);
        setIsDisplayCamera(true);

      }).catch((error) => {
        throw new Error(error);
      })
    // })();
  }

  useEffect(() => {

    const formData = new FormData();
    formData.append("profile", {
      uri: employeeImage,
      type: 'image/jpeg',
      name: 'profile.jpg'
    });

    if (employeeImage) {
      setIsLoading(true);
      api.postData(api.apiUrl + "/auth/login", formData, tempToken, true)
        .then(async (res) => {

          await LocalStorageManagement.setItem("token", res.token);
          const token = await LocalStorageManagement.getItem("token");
          // console.log("Token récupéré:", token);
          setIsDisplayCamera(false);

          if (token) {
            router.replace("/");
          } else {
            console.error("Erreur: le token est null.");
          }

        }).catch((err) => {
          setIsLoading(false)
          throw new Error(err)
        })
    }

  }, [employeeImage])

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
            onChangeText={((email) => setEmail(email))}
            value={email}
            placeholder="Votre adresse email"
            style={{
              padding: 10,
              backgroundColor: "white",
              marginBottom: 10,
              borderRadius: 5,
              width: 0.8 * Dimensions.get("window").width,
              height: 45,
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textColor}>Mot de passe</Text>
          <TextInput
            onChangeText={((password) => setPassword(password))}
            placeholder="Votre mot de passe"
            style={{
              padding: 10,
              backgroundColor: "white",
              marginBottom: 10,
              borderRadius: 5,
              width: 0.8 * Dimensions.get("window").width,
              height: 45,
            }}
            secureTextEntry={true}
          />
        </View>
        <Button onPress={() => handleSubmit()} color={"#224A6D"} title="Se connecter" />
        {/*  */}
      </View>
      {
        isDisplayCamera
          ?
          <View style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}>
            <CameraPopUp displayLoading={isLoading} setIsDisplayCamera={setIsDisplayCamera} setEmployeeImage={setEmployeeImage} customStyle={styles.cameraPopup} />
          </View>
          :
          <View style={{
            display: "none"
          }}></View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    paddingTop: 100,
    gap: 40,
    position: "relative",
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
  },
  cameraPopup: {
  }
});

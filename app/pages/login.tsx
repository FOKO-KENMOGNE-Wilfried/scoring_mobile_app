import CameraPopUp from '@/components/CameraPopUp';
import API from '@/utils/API';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
    const data = {
      email,
      password,
    };
    console.log(data);
    await api.postData(api.apiUrl + "/auth/checkCredentials", data)
      .then(async (res) => {
        setTempToken(res.token);
        setIsDisplayCamera(true);
      }).catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("profile", {
      uri: employeeImage,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });

    if (employeeImage) {
      setIsLoading(true);
      api.postData(api.apiUrl + "/auth/login", formData, tempToken, true)
        .then(async (res) => {
          await LocalStorageManagement.setItem("token", res.token);
          const token = await LocalStorageManagement.getItem("token");
          setIsDisplayCamera(false);

          if (token) {
            router.replace("/");
          } else {
            console.error("Erreur : le token est null.");
          }
        }).catch((err) => {
          setIsLoading(false);
          console.error(err);
        });
    }
  }, [employeeImage]);

  return (
    <ScrollView style={{ backgroundColor: "#F0F4F8" }}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.title}>Connectez-vous</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              onChangeText={(email) => setEmail(email)}
              value={email}
              placeholder="Votre adresse email"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TextInput
              onChangeText={(password) => setPassword(password)}
              value={password}
              placeholder="Votre mot de passe"
              style={styles.input}
              secureTextEntry={true}
            />
          </View>
          <Button onPress={() => handleSubmit()} color={"#224A6D"} title="Se connecter" />
        </View>
        {isDisplayCamera && (
          <View style={styles.cameraPopup}>
            <CameraPopUp
              displayLoading={isLoading}
              setIsDisplayCamera={setIsDisplayCamera}
              setEmployeeImage={setEmployeeImage}
              customStyle={styles.cameraPopupContent}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "relative",
    height: Dimensions.get("window").height,
    backgroundColor: "#F0F4F8",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#224A6D",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  cameraPopup: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraPopupContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
  },
});

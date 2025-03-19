import API from '@/utils/API';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';
import { useRouter } from 'expo-router';
import * as jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Button, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function TabTwoScreen() {

  const router = useRouter()
  const api = new API();
  const [userData, setUserData] = useState<any>()

  async function logout() {
    LocalStorageManagement.removeItem('token');
    console.log('logged out');
    router.replace("/pages/login");
  }

  useEffect(() => {
    (async () => {
      const token = await LocalStorageManagement.getItem("token")
      api.getData(api.apiUrl + `/employees/employee/${jwtDecode.jwtDecode(await LocalStorageManagement.getItem("token")).id}`, await LocalStorageManagement.getItem("token"))
        .then((res) => {
          setUserData(res.employee);

          // api.putData(api.apiUrl + "/", FormData, token)
          // .then(async (res) => {
          //   api.postData(api.apiUrl + "/", FormData, token, true)
          // }).catch((err) => {
          //   throw new Error(err);
          // })

        }).catch((err) => {throw new Error(err);});

    })();
  }, [])

  return (
    <ScrollView style={{
       backgroundColor: "#F5FCFF"
    }}>
      <View style={styles.container}>
        <View>
          <View style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            gap: 20,
          }}>
            <View style={{
              borderColor: "#224A6D",
              borderStyle: "solid",
              borderWidth: 2,
              borderRadius: 100,
              overflow: "hidden"
            }}>
              {
                !userData ?
                <Image
                  source={require("@/assets/images/adaptive-icon.png")}
                  style={{
                    width: 200,
                    height: 200,
                  }}
                ></Image>
                :
                <Image
                  source={{uri: `${api.apiUrl + "/" + userData?.profile}`}}
                  style={{
                    width: 200,
                    height: 200,
                  }}
                ></Image>
              }
            </View>
            <Text style={{
              fontWeight: "semibold",
              fontSize: 24,
              marginTop: 10,
            }}>{userData?.name + " " + userData?.surname}</Text>
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
    </ScrollView>
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

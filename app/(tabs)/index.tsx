import { StyleSheet, Dimensions, Text, View, Image } from 'react-native';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';
import API from '@/utils/API';
import * as jwtDecode from "jwt-decode";

export default function HomeScreen() {

  const router = useRouter();
  const api = new API();

  const [userRole, setUserRole] = useState<"employee" | "admin" | "controller">("admin");
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState([])

  useEffect(() => {
    (async () => {
      setUserRole(await LocalStorageManagement.getItem("role"));
      setUserId(jwtDecode.jwtDecode(await LocalStorageManagement.getItem("token")).id);
      api.getData(api.apiUrl + `/employees/employee/${jwtDecode.jwtDecode(await LocalStorageManagement.getItem("token")).id}`, await LocalStorageManagement.getItem("token"))
        .then((res) => {
          console.log(res);
          setUserData(res.employee);
        }).catch((err) => {throw new Error(err);});
    })();
  }, [])

  async function sendScoringRequest() {
    api.postData(api.apiUrl + `/scoring/requestForScoring/${ userId }`, {}, null, false)
      .then((res) => {
        if(res.message === "No more scoring permitted") {
          alert("Aucun pointage supplementaire n'est autorise de la journnee")
        } else {
          alert("Requete de pointage envoyer au controller avec succes")
        }
      }).catch((err) => {throw new Error(err);});
  }

  return (
    userRole === "employee" || userRole === "controller" ?
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
          }}>{userData.name + " " + userData.surname}</Text>
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
          { userRole == "employee" ?
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
            }}
            // onTouchStart={() => router.push({ pathname: "/pages/scoringByController", params: { title: "Pointage via un controller" } })}
            onTouchStart={() => sendScoringRequest()}
            >
              {/* <Image source={require("")}></Image> */}
              <Text style={{
                color: "white",
                fontSize: 15
              }}>Envoyer une requete au controller</Text>
            </View>
          :
          <View></View>
          }
          { userRole == "controller" ?
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
            }}
            onTouchStart={() => router.push({ pathname: "/pages/scoringList", params: { title: "Pointage via un controller" } })}
            >
              {/* <Image source={require("")}></Image> */}
              <Text style={{
                color: "white",
                fontSize: 15
              }}>Liste des requetes</Text>
            </View>
          :
          <View></View>
          }
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
    :
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
      <View>
        <Text>Que voulez-vous faire ?</Text>
        <View style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "row",
          marginLeft: 50,
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 10,
        }}>
          <View style={{
              display: "flex",
              justifyContent: "space-around",
              paddingHorizontal: 10,
              alignItems: "center",
              backgroundColor: "#8FA3B5",
              height: 150,
              width: 150,
              borderRadius: 10,
            }} onTouchStart={() => router.push({ pathname: "/pages/registerForm", params: { title: "Ajouter un employee" } })}>
              {/* <Image source={require("")}></Image> */}
              <Text style={{
                color: "white",
                fontSize: 15,
                textAlign: "center"
              }}>Ajouter un employee</Text>
            </View>

            <View style={{
              display: "flex",
              justifyContent: "space-around",
              paddingHorizontal: 10,
              alignItems: "center",
              backgroundColor: "#8FA3B5",
              height: 150,
              width: 150,
              borderRadius: 10,
            }} onTouchStart={() => router.push({ pathname: "/pages/employeeList", params: { title: "Liste des employees" } })}>
              {/* <Image source={require("")}></Image> */}
              <Text style={{
                color: "white",
                fontSize: 15,
                textAlign: "center"
              }}>Liste des employees</Text>
            </View>

            {/* <View style={{
              display: "flex",
              justifyContent: "space-around",
              paddingHorizontal: 10,
              alignItems: "center",
              backgroundColor: "#8FA3B5",
              height: 150,
              width: 150,
              borderRadius: 10,
            }} onTouchStart={() => router.push({ pathname: "/", params: { title: "Liste des employees" } })}>
              <Text style={{
                color: "white",
                fontSize: 15,
                textAlign: "center"
              }}>Ajouter un site de travail</Text>
            </View> */}
        </View>
        <View style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              paddingHorizontal: 10,
              alignItems: "center",
              backgroundColor: "#8FA3B5",
              height: 100,
              borderRadius: 10,
            }} onTouchStart={() => router.push({ pathname: "/", params: { title: "Generation des rapports" } })}>
              {/* <Image source={require("")}></Image> */}
              <Text style={{
                color: "white",
                fontSize: 15,
                textAlign: "center"
              }}>Generer des rapports</Text>
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

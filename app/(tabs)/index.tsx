import { StyleSheet, Dimensions, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';
import API from '@/utils/API';
import * as jwtDecode from "jwt-decode";

export default function HomeScreen() {
  const router = useRouter();
  const api = new API();

  const [userRole, setUserRole] = useState<"employee" | "admin" | "controller">();
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    (async () => {
      setUserRole(await LocalStorageManagement.getItem("role"));
      setUserId(jwtDecode.jwtDecode(await LocalStorageManagement.getItem("token")).id);
      api.getData(
        api.apiUrl + `/employees/employee/${jwtDecode.jwtDecode(await LocalStorageManagement.getItem("token")).id}`,
        await LocalStorageManagement.getItem("token")
      )
        .then((res) => {
          setUserData(res.employee);
        }).catch((err) => {
          console.error(err);
        });
    })();
  }, []);

  async function sendScoringRequest() {
    api.postData(api.apiUrl + `/scoring/requestForScoring/${userId}`, {}, null, false)
      .then((res) => {
        if (res.message === "No more scoring permitted") {
          alert("Aucun pointage supplémentaire n'est autorisé de la journée");
        } else {
          alert("Requête de pointage envoyée au contrôleur avec succès");
        }
      }).catch((err) => {
        console.error(err);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.welcomeText}>Bon retour</Text>
        <Text style={styles.userName}>{userData.name + " " + userData.surname}</Text>
      </View>

      {userRole && (
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Votre lieu d'affectation est le site de COPSCECO</Text>
          <Text style={styles.infoText}>Vos horaires de travail sont de 8h - 17h</Text>
        </View>
      )}

      {userRole === "employee" || userRole === "controller" ? (
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Démarrez votre procédure de pointage !</Text>
          {userRole === "employee" && (
            <View style={styles.actionCard} onTouchStart={sendScoringRequest}>
              <Text style={styles.actionText}>Envoyer une requête au contrôleur</Text>
            </View>
          )}
          {userRole === "controller" && (
            <View
              style={styles.actionCard}
              onTouchStart={() => router.push({ pathname: "/pages/scoringList", params: { title: "Pointage via un contrôleur" } })}
            >
              <Text style={styles.actionText}>Liste des requêtes</Text>
            </View>
          )}
          <View
            style={styles.actionCard}
            onTouchStart={() => router.push({ pathname: "/pages/autoScoring", params: { title: "Pointage automatique" } })}
          >
            <Text style={styles.actionText}>Pointage par reconnaissance biométrique</Text>
          </View>
        </View>
      ) : (
        <View style={styles.adminActions}>
          <Text style={styles.adminTitle}>Actions administratives</Text>
          <View style={styles.adminGrid}>
            <View style={styles.adminCard} onTouchStart={() => router.push({ pathname: "/pages/registerForm", params: { title: "Ajouter un employé" } })}>
              <Image source={require("@/assets/images/add.png")} style={styles.icon} />
              <Text style={styles.adminText}>Ajouter un employé</Text>
            </View>
            <View style={styles.adminCard} onTouchStart={() => router.push({ pathname: "/pages/employeeList", params: { title: "Liste des employés" } })}>
              <Image source={require("@/assets/images/list.png")} style={styles.icon} />
              <Text style={styles.adminText}>Liste des employés</Text>
            </View>
            <View style={styles.adminCard} onTouchStart={() => router.push({ pathname: "/pages/repport", params: { title: "Générer des rapports" } })}>
              <Image source={require("@/assets/images/report.png")} style={styles.icon} />
              <Text style={styles.adminText}>Générer des rapports</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5FCFF",
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#224A6D",
  },
  userName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
  },
  infoCard: {
    backgroundColor: "#224A6D",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginVertical: 5,
  },
  actionSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  adminActions: {
    marginTop: 20,
  },
  adminTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  adminGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  adminCard: {
    backgroundColor: "#8FA3B5",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  adminText: {
    color: "#FFF",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 10,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});

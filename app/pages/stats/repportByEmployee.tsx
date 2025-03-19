import API from "@/utils/API";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

export default function RepportByEmployee() {
  type customEmployeeType = {
    id: number;
    employee: {
      createAt: string;
      email: string;
      id: string;
      is_active: boolean;
      name: string;
      phone_number: number;
      position: string;
      profile: string;
      role: string;
      surname: string;
      updateat: string;
    };
  };

  type customEmployeeStats = {
    attendance: {
      date: string;
      endTime: string;
      startTime: string;
    }[];
    totalHours: number;
  };

  const api = new API();
  const [data, setData] = useState<customEmployeeStats>();
  const [employeeList, setEmployeeList] = useState<customEmployeeType[]>([]);
  const [pageToDisplay, setPageToDisplay] = useState(0);

  // Fonction pour afficher les statistiques d'un employé
  function handleClick(id: string) {
    getStat(id);
  }

  function getStat(id: string) {
    api
      .getData(api.apiUrl + `/stats/getStatsByEmployee/${id}`)
      .then((res) => {
        console.log(res.message);
        setPageToDisplay(1);
        setData(res.message);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  // Chargement de la liste des employés
  useEffect(() => {
    api
      .getData(api.apiUrl + "/sites/getAllEmployee")
      .then((res: { employees: customEmployeeType[] }) => {
        console.log(res);
        setEmployeeList(res.employees.filter((employee) => employee.employee.role !== "admin"));
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, []);

  return (
    <View style={styles.container}>
      {/* Titre principal */}
      <View style={styles.header}>
        <Text style={styles.title}>Rapport par Employé</Text>
      </View>

      {/* Contenu conditionnel selon la page affichée */}
      {pageToDisplay === 0 ? (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {employeeList.map((employee) => (
            <View
              key={employee.employee.id}
              style={styles.card}
              onTouchStart={() => handleClick(employee.employee.id.toString())}
            >
              <Text style={styles.name}>
                {employee.employee.name + " " + employee.employee.surname}
              </Text>
              <Text style={styles.email}>{employee.employee.email}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.detailContainer}>
          <Text style={styles.totalHours}>
            Nombre d'heures de travail :{" "}
            <Text style={styles.totalHoursValue}>{data?.totalHours.toPrecision(2)} heures</Text>
          </Text>
          <FlatList
            data={data?.attendance}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.attendanceDate}>{item.date}</Text>
                <View style={styles.timeRow}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeLabel}>Heure d'arrivée</Text>
                    <Text style={styles.timeValue}>{item.startTime || "Pas de pointage"}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeLabel}>Heure de départ</Text>
                    <Text style={styles.timeValue}>{item.endTime || "Pas de pointage"}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5FCFF",
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#224A6D",
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  detailContainer: {
    paddingHorizontal: 20,
  },
  totalHours: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  totalHoursValue: {
    fontWeight: "bold",
    color: "#224A6D",
  },
  attendanceDate: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  timeLabel: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 5,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});

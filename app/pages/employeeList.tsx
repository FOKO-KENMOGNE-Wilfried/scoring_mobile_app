import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import API from '@/utils/API';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<customEmployeeResponseType[]>([]);

  type customEmployeeResponseType = {
    createAt: string,
    employee: {
      createAt: string,
      email: string,
      id: string,
      is_active: boolean,
      name: string,
      phone_number: string,
      position: string,
      profile: string,
      role: string,
      surname: string,
      updateat: string,
    },
    id: number,
    site: {
      area: number,
      createAt: string,
      id: number,
      location: string,
      name: string,
      siteSchedules: string,
      updateat: string,
    },
    updateat: string
  }

  const [sites, setSites] = useState<any[]>([
    {
      name: "All",
      isSelected: true
    }
  ]);

  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [searchQuery, setSearchQuery] = useState("");
  const api = new API();
  const [editingRole, setEditingRole] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [employeeSite, setEmployeeSite] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fonction de recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredEmployees(employees); // Réinitialiser si la recherche est vide
    } else {
      setFilteredEmployees(
        employees.filter((emp) =>
          emp.employee.name.toLowerCase().includes(query.toLowerCase()) ||
          emp.employee.email.toLowerCase().includes(query.toLowerCase()) ||
          emp.employee.role.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };


  const handleSuspend = async (id: string) => {
    api.putData(api.apiUrl + `/employees/suspendEmployeeAccount/${id}`, {}, await LocalStorageManagement.getItem("token"), false)
      .then(() => {
        getAllEmployee();
      }).catch((err) => { throw new Error(err) })
  };


  const handleChangeRole = async (id: string, newRole: string) => {
    api.putData(api.apiUrl + `/employees/updateEmployeeRole/${id}`, { role: newRole }, await LocalStorageManagement.getItem("token"), false)
      .then(() => {
        getAllEmployee();
        setEditingRole(null);
      }).catch((err) => { throw new Error(err) })
  };


  function setIsSelectedSite(index: number) {
    const updatedSiteList = sites.map((site, i) => ({
      ...site,
      isSelected: i === index,
    }));

    const selectedSite = updatedSiteList[index];
    setEmployeeSite(selectedSite.name === "All" ? "All" : selectedSite.id);
    setSites(updatedSiteList);
    if (selectedSite.name == "All") {
      getAllEmployee();
    } else {
      getEmployeeBySite(updatedSiteList.filter((element) => element.isSelected)[0].id);
    }
  }


  const handleAssignSite = async () => {
    console.log(selectedSite);
    console.log(editingSite);

    api.postData(api.apiUrl + `/sites/addEmployeeToSite/${selectedSite}`, { employee_id: editingSite }, await LocalStorageManagement.getItem("token"), false)
      .then(() => {
        getAllEmployee();
        setEditingSite(null);
        setSelectedSite("");
        setIsModalVisible(false);
      }).catch((err) => { throw new Error(err) })

  };

  function getAllEmployee() {
    api.getData(api.apiUrl + "/sites/getAllEmployee", null)
      .then((res) => {
        setEmployees(res.employees.filter((element: any) => element.employee.role === "employee" || element.employee.role === "controller"));
        setFilteredEmployees(res.employees.filter((element: any) => element.employee.role === "employee" || element.employee.role === "controller"))
      }).catch((err) => {
        throw new Error(err);
      })
  }

  function getEmployeeBySite(siteId: number) {
    api.getData(api.apiUrl + `/sites/getEmployeeBySite/${siteId}`, null)
      .then((res) => {
        setEmployees(res.employees.filter((element: any) => element.employee.role === "employee" || element.employee.role === "controller"));
        setFilteredEmployees(res.employees.filter((element: any) => element.employee.role === "employee" || element.employee.role === "controller"))
      }).catch((err) => {
        throw new Error(err);
      })
  }

  useEffect(() => {
    api.getData(api.apiUrl + "/sites/getAllSite", null)
      .then((res: { sitesList: [any] }) => {
        res.sitesList.map((site) => {
          site.isSelected = false
        })
        setSites(
          [
            sites[0],
            ...res.sitesList
          ]
        )
        setSelectedSite(sites.filter((element) => element.name !== "All")[0]?.id);
        getAllEmployee();
      }).catch((err) => {
        throw new Error(err);
      })
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Employés</Text>

      {/* Barre de recherche */}
      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Rechercher un employé..."
        style={styles.searchBar}
      />

      {/* Liste des sites */}
      <View style={styles.siteList}>
        {sites.map((site, i) => (
          <View
            key={i}
            onTouchStart={() => setIsSelectedSite(i)}
            style={[
              styles.siteBadge,
              { backgroundColor: site.isSelected ? "#224A6D" : "#DEDEDE" },
            ]}
          >
            <Text
              style={{
                color: site.isSelected ? "white" : "black",
              }}
            >
              {site.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Liste des employés */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.employee.name + " " + item.employee.surname}
            </Text>
            <Text style={styles.email}>{item.employee.email}</Text>
            <Text style={styles.role}>
              Rôle : {item.employee.role.toUpperCase()}
            </Text>
            <Text style={styles.site}>Site : {item.site.name}</Text>

            {/* Actions pour chaque employé */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: item.employee.is_active ? "#6BCB77" : "#FF6B6B" },
                ]}
                onPress={() => handleSuspend(item.employee.id)}
              >
                <Text style={styles.buttonText}>
                  {item.employee.is_active ? "Suspendre" : "Réactiver"}
                </Text>
              </TouchableOpacity>

              {/* Modification du rôle */}
              {editingRole === item.employee.id ? (
                <Picker
                  selectedValue={item.employee.role}
                  style={{ flex: 1, backgroundColor: "#f0f0f0" }}
                  onValueChange={(value) =>
                    handleChangeRole(item.employee.id, value)
                  }
                >
                  <Picker.Item label="Employé" value="employee" />
                  <Picker.Item label="Administrateur" value="admin" />
                  <Picker.Item label="Contrôleur" value="controller" />
                </Picker>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setEditingRole(item.employee.id)}
                >
                  <Text style={styles.buttonText}>Modifier le rôle</Text>
                </TouchableOpacity>
              )}

              {/* Modification du site */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setEditingSite(item.employee.id);
                  setIsModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Modifier le site</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Popup pour assigner un site */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisissez un site</Text>
            <Picker
              selectedValue={selectedSite}
              onValueChange={(itemValue) => setSelectedSite(itemValue)}
              style={styles.picker}
            >
              {sites
                .filter((element) => element.name !== "All")
                .map((site) => (
                  <Picker.Item key={site.id} label={site.name} value={site.id} />
                ))}
            </Picker>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#6BCB77" }]}
                onPress={handleAssignSite}
              >
                <Text style={styles.modalButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#224A6D",
    marginBottom: 20,
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  siteList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  siteBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#224A6D",
  },
  site: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#6c757d",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  button: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#224A6D",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#224A6D",
    marginBottom: 15,
  },
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B6B",
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([
    { id: "1", name: "Foko Kenmogne", email: "foko@example.com", role: "employee", isSuspended: false, site: "Aucun" },
    { id: "2", name: "John Doe", email: "john.doe@example.com", role: "admin", isSuspended: false, site: "Site de Yaoundé" },
    { id: "3", name: "Jane Smith", email: "jane.smith@example.com", role: "controller", isSuspended: true, site: "Site de COPSCECO" },
  ]);

  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingRole, setEditingRole] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [selectedSite, setSelectedSite] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fonction de recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredEmployees(employees); // Réinitialiser si la recherche est vide
    } else {
      setFilteredEmployees(
        employees.filter((emp) =>
          emp.name.toLowerCase().includes(query.toLowerCase()) ||
          emp.email.toLowerCase().includes(query.toLowerCase()) ||
          emp.role.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const handleSuspend = (id: string) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === id ? { ...emp, isSuspended: !emp.isSuspended } : emp
      )
    );
    setFilteredEmployees((prevFilteredEmployees) =>
      prevFilteredEmployees.map((emp) =>
        emp.id === id ? { ...emp, isSuspended: !emp.isSuspended } : emp
      )
    );
  };

  const handleChangeRole = (id: string, newRole: string) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === id ? { ...emp, role: newRole } : emp
      )
    );
    setFilteredEmployees((prevFilteredEmployees) =>
      prevFilteredEmployees.map((emp) =>
        emp.id === id ? { ...emp, role: newRole } : emp
      )
    );
    setEditingRole(null);
  };

  const handleAssignSite = () => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === editingSite ? { ...emp, site: selectedSite } : emp
      )
    );
    setFilteredEmployees((prevFilteredEmployees) =>
      prevFilteredEmployees.map((emp) =>
        emp.id === editingSite ? { ...emp, site: selectedSite } : emp
      )
    );
    setIsModalVisible(false);
    setEditingSite(null);
    setSelectedSite("");
  };

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
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.role}>Rôle : {item.role.toUpperCase()}</Text>
            <Text style={styles.site}>Site : {item.site}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: item.isSuspended ? "#FF6B6B" : "#6BCB77" }]}
                onPress={() => handleSuspend(item.id)}
              >
                <Text style={styles.buttonText}>
                  {item.isSuspended ? "Réactiver" : "Suspendre"}
                </Text>
              </TouchableOpacity>
              {editingRole === item.id ? (
                <Picker
                  selectedValue={item.role}
                  style={{ flex: 1, backgroundColor: "#f0f0f0" }}
                  onValueChange={(value) => handleChangeRole(item.id, value)}
                >
                  <Picker.Item label="Employé" value="employee" />
                  <Picker.Item label="Administrateur" value="admin" />
                  <Picker.Item label="Contrôleur" value="controller" />
                </Picker>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setEditingRole(item.id)}
                >
                  <Text style={styles.buttonText}>Modifier le rôle</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setEditingSite(item.id);
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
              <Picker.Item label="Site de COPSCECO" value="Site de COPSCECO" />
              <Picker.Item label="Site de Yaoundé" value="Site de Yaoundé" />
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#224A6D",
    marginBottom: 10,
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
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
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#224A6D",
    marginVertical: 5,
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
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#224A6D",
    marginBottom: 15,
  },
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 15,
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

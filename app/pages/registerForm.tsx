import { useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [position, setPosition] = useState("");

  // Gestion des erreurs
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!name.trim()) newErrors.name = "Le nom est requis.";
    if (!surname.trim()) newErrors.surname = "Le prénom est requis.";
    if (!phoneNumber.trim() || !/^\d{9,10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Le numéro doit contenir entre 9 et 10 chiffres.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "L'email n'est pas valide.";
    }
    if (!password.trim() || password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }
    if (!position.trim()) newErrors.position = "Le poste est requis.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        name,
        surname,
        phone_number: phoneNumber,
        email,
        password,
        role,
        position,
      };

      console.log("Données soumises :", formData);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Formulaire d'inscription</Text>
          {/* Champs du formulaire */}
          <View style={styles.inputContainer}>
            <Text style={styles.textColor}>Nom</Text>
            <TextInput
              onChangeText={setName}
              value={name}
              placeholder="Votre nom"
              style={styles.input}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textColor}>Prénom</Text>
            <TextInput
              onChangeText={setSurname}
              value={surname}
              placeholder="Votre prénom"
              style={styles.input}
            />
            {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textColor}>Numéro de téléphone</Text>
            <TextInput
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              placeholder="Votre numéro de téléphone"
              keyboardType="phone-pad"
              style={styles.input}
            />
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textColor}>Email</Text>
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="Votre adresse email"
              keyboardType="email-address"
              style={styles.input}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textColor}>Mot de passe</Text>
            <TextInput
              onChangeText={setPassword}
              value={password}
              placeholder="Votre mot de passe"
              secureTextEntry
              style={styles.input}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textColor}>Rôle</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Employé" value="employee" />
                <Picker.Item label="Administrateur" value="admin" />
                <Picker.Item label="Contrôleur" value="controller" />
              </Picker>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textColor}>Position</Text>
            <TextInput
              onChangeText={setPosition}
              value={position}
              placeholder="Votre poste (ex: manager)"
              style={styles.input}
            />
            {errors.position && <Text style={styles.errorText}>{errors.position}</Text>}
          </View>
          <Button onPress={handleSubmit} color={"#224A6D"} title="S'inscrire" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8FA3B5",
  },
  scrollContainer: {
    display: "flex",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  formContainer: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#224A6D",
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    height: 45,
  },
  textColor: {
    color: "#224A6D",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    // height: 45,
    // backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

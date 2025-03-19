import { useEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TextInput, View, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ImagePickers from '@/components/imagePicker';
import API from '@/utils/API';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';
import AppLoader from '@/components/ui/AppLoader';
import { useRouter } from 'expo-router';
// import ImagePickers from '@/components/imagePicker';

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [site, setSite] = useState<any[]>();
  const [selectedSite, setSelectedSite] = useState<any[]>();
  const [position, setPosition] = useState("");
  const [profile, setProfile] = useState("");
  const [isDisplayLoader, setIsDisplayLoader] = useState(false)
  const api = new API();
  const router = useRouter();

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
    if (!profile.trim()) {
      newErrors.password = "La photo de profil de l'utilisateur est requise.";
    }
    if (!position.trim()) newErrors.position = "Le poste est requis.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit() {
    if (validateForm()) {
      const token = await LocalStorageManagement.getItem('token');
      const data = {
        name,
        surname,
        phone_number: phoneNumber,
        email,
        password,
        role,
        position,
      };
      const formData = new FormData();
      formData.append("profile", {
        uri: profile,
        type: 'image/jpeg',
        name: 'profile.jpg'
      });
      setIsDisplayLoader(true);
      api.postData(api.apiUrl + "/auth/signup", data, token, false)
        .then((res) => {
          api.putData(api.apiUrl + `/employees/addEmployeeProfile/${res.employeeDataSent.id}`, formData, token, true)
            .then(() => {
              api.postData(api.apiUrl + `/sites/addEmployeeToSite/${selectedSite}`, {employee_id: res.employeeDataSent.id}, token, false)
                .then(() => {
                  setIsDisplayLoader(false);
                  router.replace("/");
                }).catch((err) => {throw new Error(err)});
            }).catch((err) => {
              setIsDisplayLoader(false);
              alert("Une erreur est survenu lors de la procedure, veillez reesayer ulterieurement !");
              throw new Error(err);
            });
        }).catch((err) => {
          setIsDisplayLoader(false);
          alert("Une erreur est survenu lors de la procedure, veillez reesayer ulterieurement !");
          throw new Error(err);
        });
    }
  };

  useEffect(() => {
      api.getData(api.apiUrl + "/sites/getAllSite", null)
        .then((res: { sitesList: [any] }) => {
          res.sitesList.map((site) => {
            site.isSelected = false
          })
          setSite(res.sitesList)
        }).catch((err) => {
          throw new Error(err);
        })
    }, [])

  return (
    <View style={styles.container}>
      {
        isDisplayLoader
        ?
        <View style={{
          position: "absolute",
          zIndex: 10,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height
        }}>
          <AppLoader message='Enregistrement en cours...' />
        </View>
        :
        <View style={{display: "none"}}></View>
      }
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

          <View>
            <ImagePickers profile={profile} setProfile={setProfile} />
            {errors.profile && <Text style={styles.errorText}>{errors.profile}</Text>}
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
            <Text style={styles.textColor}>Site d'affectation</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSite}
                onValueChange={(itemValue) => setSelectedSite(itemValue)}
                style={styles.picker}
              >
                {
                  site?.map((item, index) => (
                    <Picker.Item key={index} label={item.name} value={item.id} />
                  ))
                }
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.textColor}>Position</Text>
            <TextInput
              onChangeText={setPosition}
              value={position}
              placeholder="Entrez le poste (ex: manager)"
              style={styles.input}
            />
            {errors.position && <Text style={styles.errorText}>{errors.position}</Text>}
          </View>
          <Button onPress={() => handleSubmit()} color={"#224A6D"} title="S'inscrire" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8", // Couleur de fond modernisée
  },
  scrollContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  formContainer: {
    display: "flex",
    gap: 15,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6, // Meilleur effet d'ombre
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#224A6D",
    marginBottom: 15,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    padding: 12,
    backgroundColor: "#f9f9f9", // Fond des champs plus neutre
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    height: 50,
  },
  textColor: {
    color: "#224A6D",
    marginBottom: 5,
    fontWeight: "600",
    fontSize: 16, // Texte légèrement plus grand
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#224A6D",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

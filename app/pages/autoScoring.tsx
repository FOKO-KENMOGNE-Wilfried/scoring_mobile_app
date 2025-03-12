import CameraPopUp from '@/components/CameraPopUp';
import API from '@/utils/API';
import { LocalStorageManagement } from '@/utils/LocalStorageManagement';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import * as jwtDecode from "jwt-decode";
import AppLoader from '@/components/ui/AppLoader';

export default function autoScoring() {

  const router = useRouter();
  const [employeeImage, setEmployeeImage] = useState("");
  const [isDisplayCamera, setIsDisplayCamera] = useState(true);
  const [displayLoading, setDisplayLoading] = useState(false);

  useEffect(() => {
    isDisplayCamera ? null : router.push("/");
  }, [isDisplayCamera])

  useEffect(() => {

    if(employeeImage) {
      (async () => {
        const api = new API()
        const formData = new FormData();
        formData.append("profile", {
          uri: employeeImage,
          type: 'image/jpeg',
          name: 'profile.jpg'
        });
        setDisplayLoading(true);
        api.postData(api.apiUrl + `/scoring/doScoring/${jwtDecode.jwtDecode(await LocalStorageManagement.getItem("token")).id}`, formData, await LocalStorageManagement.getItem("token"), true)
          .then((res) => {
            if(res.message == "No more scoring permitted") {
              alert("Vous avez deja effectuer vos deux pointages de la journee !");
              router.push("/");
            } else {
              setDisplayLoading(false);
              alert("Pointage effectuer avec success !");
              setEmployeeImage("");
              router.push("/");
            }
          }).catch((err) => {
            setDisplayLoading(false);
            setEmployeeImage("");
            throw new Error(err)
          })
      })();
    }

  }, [employeeImage])

  return (
    <View style={styles.container}>
      <View style={{
        position: "absolute",
        zIndex: 10,
      }}>
        {
          displayLoading ? <AppLoader message='Verification en cour' /> : <View style={{
            display: "none"
          }}></View>
        }
      </View>
      <CameraPopUp customStyle={{}} setEmployeeImage={setEmployeeImage} setIsDisplayCamera={setIsDisplayCamera} displayLoading={displayLoading}  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
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
  }
});

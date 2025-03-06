import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppLoader from './ui/AppLoader';

export default function CameraPopUp(
  {
    customStyle,
    setIsDisplayCamera,
    setEmployeeImage,
    displayLoading
  } : {
    customStyle: {},
    setIsDisplayCamera: (isDisplay: boolean) => void,
    setEmployeeImage: (image: string) => void,
    displayLoading: boolean
  }){

  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setEmployeeImage(photo.uri);
    } else {
      console.error("Caméra indisponible");
    }
  };
  

  return (
    <View style={customStyle}>
      {
        displayLoading ? <AppLoader /> : <View style={{
          display: "none"
        }}></View>
      }
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <Pressable onPress={takePicture}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Take Picture</Text>
        </Pressable>
      </CameraView>
      <View style={{
        display: "flex",
        justifyContent: "space-around",
        marginBottom: 10,
        gap: 10,
      }}>
        <View
          style={{
            backgroundColor: "#812D25",
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onTouchStart={() => setIsDisplayCamera(false)}
        >
          <Text style={{color: "white"}}>Annuler</Text>
        </View>
        <View
          style={{
            backgroundColor: "#25814e",
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onTouchStart={() => takePicture()}
        >
          <Text style={{color: "white"}}>Lancer la verification</Text>
        </View>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: Dimensions.get("window").height,
      width: Dimensions.get("window").width,
      borderRadius: 10,
      padding: 20,
      gap: 20,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    height: 300,
    width: 300,
    borderRadius: 300
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

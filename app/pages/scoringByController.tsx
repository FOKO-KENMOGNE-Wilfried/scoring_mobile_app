import { useRouter } from 'expo-router';
import { Button, Dimensions, Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function scoringByController() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>controller</Text>
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

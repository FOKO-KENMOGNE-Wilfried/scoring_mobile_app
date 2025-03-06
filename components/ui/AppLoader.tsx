import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Dimensions } from 'react-native';

export default function AppLoader({ message = "Chargement en cours..." }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#224A6D" />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

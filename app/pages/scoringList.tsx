import API from '@/utils/API';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScoringList() {

  const router = useRouter();
  const api = new API();

  const [scoringRequestList, setScoringRequestList] = useState([]);

  async function validateScoringRequest(scoringRequestId: string) {
    api.putData(api.apiUrl + `/scoring/validatedScoringRequest/${scoringRequestId}`, {}, null, false)
      .then(() => {
        alert("Scoring was successfully validated");
        router.push("/");
      }).catch((err) => {throw new Error(err);});
  }
  async function rejectScoringRequest(scoringRequestId: string) {
    api.putData(api.apiUrl + `/scoring/rejectedScoringRequest/${scoringRequestId}`, {}, null, false)
      .then(() => {
        alert("Scoring was successfully rejected");
        router.push("/");
      }).catch((err) => {throw new Error(err);});
  }

  useEffect(() => {
    api.getData(api.apiUrl + "/scoring/getScoringRequest", null)
      .then((res) => {
        console.log(res);
        setScoringRequestList(res.scoringRequests)
      }).catch((err) => {throw new Error(err);});
  }, [])

  return (
    <View style={styles.container}>
      <Text style={{
        fontSize: 24,
        fontWeight: "bold"
      }}>Liste des requetes</Text>
      {
        scoringRequestList.map((scoringRequest) => (
          <View key={scoringRequest.id} style={{
            backgroundColor: "#fff",
            padding: 15,
            marginVertical: 5,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}>
            <Text>{scoringRequest.employee.name + " " + scoringRequest.employee.surname}</Text>
            <View style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
            }}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#6BCB77" }]}
                onPress={() => validateScoringRequest(scoringRequest.id)}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              {/*  */}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#FF6B6B" }]}
                onPress={() => rejectScoringRequest(scoringRequest.id)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    gap: 40,
    paddingHorizontal: 10,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "#F5FCFF",
  },
  textColor: {
    color: "white",
  },
  modalButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#FF6B6B",
    marginHorizontal: 2,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inputContainer: {
    display: "flex",
    gap: 4,
  }
});

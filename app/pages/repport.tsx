import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function Report() {
    const router = useRouter();

    return (
        <View style={style.container}>
            <Text style={style.title}>Rapports de pointage</Text>
            <View style={style.cardContainer}>
                <TouchableOpacity
                    style={style.card}
                    onPress={() => router.push({ pathname: "/pages/stats/repportByEmployee", params: { title: "Rapport par employé" } })}
                >
                    <Text style={style.cardText}>Rapport par employé</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={style.card}
                    onPress={() => router.push({ pathname: "/pages/stats/repportBySite", params: { title: "Rapport par site" } })}
                >
                    <Text style={style.cardText}>Rapport par site de travail</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={style.card}
                    onPress={() => router.push({ pathname: "/pages/stats/repportByCompany", params: { title: "Rapport de l'entreprise" } })}
                >
                    <Text style={style.cardText}>Rapport global de l'entreprise</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F5FCFF",
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#224A6D",
        marginBottom: 20,
    },
    cardContainer: {
        width: "100%",
        alignItems: "center",
        gap: 15,
    },
    card: {
        width: "90%",
        backgroundColor: "#8FA3B5",
        paddingVertical: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    cardText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});

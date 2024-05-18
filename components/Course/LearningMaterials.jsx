import { StyleSheet, ScrollView, View, Image } from "react-native";
import { Text } from "react-native-paper";

import LearningMaterialCard from "./LearningMaterialCard";

export default function LearningMaterials({ materials }) {


  const LearningMaterials = materials?.map((item, index) => {
    return (
      <LearningMaterialCard
        key={index}
        title={item}
      />
    );
  });

  return (
    <ScrollView style={styles.container}>
      {/* Learning Materials */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.title}>
          Learning Materials
        </Text>
        <View style={styles.cards}>
          {LearningMaterials}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  section: {
    marginBottom: 40,
  },
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
});

import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

import LearningMaterialCard from "./LearningMaterialCard";

export default function LearningMaterials({ materials }) {
  const [materialUrls, setMaterialUrls] = useState([]);

  console.log("Materials: " + materials);
  console.log("Type of materials: " + typeof materials);

  useEffect(() => {
    if (materials && Array.isArray(materials)) {
      setMaterialUrls(materials);
    }
  }, [materials]);

  const LearningMaterials = materialUrls.map((item, index) => {
    return (
      <LearningMaterialCard
        key={index}
        title={`Learning Material ${index + 1}`}
        pdfUrl={item} // Pass the URL as the pdfUrl prop
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

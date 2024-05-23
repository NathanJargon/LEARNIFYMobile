import { Card } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function LearningMaterialCard({ title, pdfUrl }) {
  const navigation = useNavigation();
  console.log("PDF URL: " + pdfUrl);

  return (
    <Card
      onPress={() => navigation.navigate('PDFViewer', { pdfUrl })}
      style={[styles.card, { backgroundColor: theme.colors.background }]}
    >
      <Card.Cover
        style={{ height: 120, borderRadius: 6 }}
        source={require("../../assets/Icons/pdfCover.png")}
      />
      <Card.Title title={title} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    padding: 10,
  },
});
import { Card } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ActivityCard({title, id}) {
  const navigation = useNavigation();

  return (
    <Card
      onPress={() => navigation.navigate("Quiz", {id: id})}
      style={[styles.card, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.contentWrapper}>
        <Card.Cover
          style={styles.image}
          source={require("../../assets/Icons/quizCover.png")}
        />
        <Card.Title
          style={styles.title}
          title={title}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  contentWrapper: {
    flexDirection: "row",
    padding: 10,
  },
  image: {
    height: 70,
    width: 60,
  },
  title: {
    flex: 1,
  },
});
